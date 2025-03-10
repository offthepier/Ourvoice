import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { StatusCodes } from "http-status-codes";
import { VERIFICATION_STATUS } from "src/constants/verificationStatus";
import formatJSONResponse from "src/core/formatJsonResponse";
import IUserPublic from "src/models/UserPublic";
import User from "../../models/User";
import ausGeoLocationService from "../AusGeolocationService";
import adminMPService from "src/service/MpService";
import { AWS_USER_POOL_ID } from "src/config/aws";
import * as AWS from "aws-sdk";

class UserProfileService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  async getUserProfile(email: string): Promise<User> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { email },
      })
      .promise();

    let rank = null;

    //if the score exists retrieve rank
    if (result && result.Item?.score > 0) {
      //retrieve user rank
      rank = await this.getUserRank(result.Item?.score);
    }

    return { ...result.Item, rank: rank } as User;
  }

  async getUserPublicProfile(email: string): Promise<IUserPublic> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { email },
      })
      .promise();

    let rank = null;

    //if the score exists retrieve rank
    if (result && result.Item?.score > 0) {
      //retrieve user rank
      rank = await this.getUserRank(result.Item?.score);
    }

    return {
      firstName: result?.Item?.firstName,
      lastName: result?.Item?.lastName,
      gender: result?.Item?.gender,
      intro: result?.Item?.intro,
      imageUrl: result?.Item?.imageUrl,
      imageFullUrl: result.Item.imageFullUrl,
      geoLocation: {
        country: result?.Item?.geoLocation?.country,
      },
      score: result.Item?.score,
      rank: rank,
      interests: result.Item?.interests,
      role: result.Item?.role,
      verificationStatus: result.Item?.verificationStatus,
    };
  }

  async getUserProfileScore(email: string): Promise<User> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { email },
        ProjectionExpression: "score",
      })
      .promise();

    return result.Item as User;
  }

  /*This function will return user rank */
  async getUserRank(score: number): Promise<number> {
    const params = {
      TableName: this.tableName,
      IndexName: "RankIndex",
      KeyConditionExpression: "searchVisibility = :pk and score > :sk",
      ExpressionAttributeValues: {
        ":pk": "PUBLIC",
        ":sk": score,
      },
      Select: "COUNT",
    };

    const data = await this.docClient
      .query(params, function (err, data) {
        if (err) console.log(err);
        else console.log("Count:", data.Count);
      })
      .promise();

    //Increase count by 1 to get user rank
    return data.Count + 1;
  }

  //User Profile Update

  async updateUserProfile(
    userEmail: string,
    updatedDetails: Partial<User>
  ): Promise<User> {
    const existingUser = await this.getUserProfile(userEmail);
    const { email } = existingUser;
    const mpData = await adminMPService.getMPInviteByEmail(userEmail);

    const cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider();

    if (updatedDetails.geoLocation) {
      updatedDetails.geoLocation = {
        ...existingUser.geoLocation,
        ...updatedDetails.geoLocation,
      };
    }
    let exp = {
      UpdateExpression: "set",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    };

    // If suburb or postCode is updated, update the electorate details
    if (
      updatedDetails.geoLocation &&
      ("suburb" in updatedDetails.geoLocation ||
        "postCode" in updatedDetails.geoLocation)
    ) {
      const locationDetails = await ausGeoLocationService.getByKeys({
        suburb: updatedDetails.geoLocation.suburb,
        postcode: updatedDetails.geoLocation.postCode,
      });

      if (!locationDetails) {
        throw new Error(
          JSON.stringify({
            statusCode: 400,
            body: "Invalid suburb or postal code",
          })
        );
      }

      // Update the electorate details in the User object
      updatedDetails.electorate = {
        localElectorate: locationDetails.localElectorate,
        stateElectorate: locationDetails.stateElectorate,
        federalElectorate: locationDetails.federalElectorate,
      };

      // Update the separate electorate properties at the root of the user object
      updatedDetails.localElectorate = locationDetails.localElectorate;
      updatedDetails.stateElectorate = locationDetails.stateElectorate;
      updatedDetails.federalElectorate = locationDetails.federalElectorate;

      // Check if the updated electorate matches the MP's electorate
      if (
        mpData &&
        updatedDetails.electorate[
          `${mpData.electorateType.toLowerCase()}Electorate`
        ] !== mpData.electorateName
      ) {
        throw new Error(
          JSON.stringify({
            statusCode: 400,
            body: "Updated address details do not match with the electorate that you are assigned.",
          })
        );
      }
    }

    Object.entries(updatedDetails).forEach(([key, item]) => {
      exp.UpdateExpression += ` #${key} =  :${key},`;
      exp.ExpressionAttributeNames[`#${key}`] = key;
      exp.ExpressionAttributeValues[`:${key}`] = item;
    });
    exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);

    const updatedUser = await this.docClient
      .update({
        TableName: this.tableName,
        Key: { email },
        UpdateExpression: exp.UpdateExpression,
        ExpressionAttributeValues: exp.ExpressionAttributeValues,
        ExpressionAttributeNames: exp.ExpressionAttributeNames,
        ReturnValues: "ALL_NEW",
      })
      .promise();

    if (!updatedUser) {
      return formatJSONResponse(StatusCodes.NOT_FOUND, "Unable to find");
    }

    await this.docClient
      .update({
        TableName: this.tableName,
        Key: { email },
        UpdateExpression: "set #MyVariable = :y",
        ExpressionAttributeNames: {
          "#MyVariable": "searchableName",
        },
        ExpressionAttributeValues: {
          ":y":
            updatedUser?.Attributes?.firstName?.toLowerCase() +
            " " +
            updatedUser.Attributes.lastName?.toLowerCase(),
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    //If suburb or postCode is updated, update the Cognito user attributes
    if (
      updatedDetails.geoLocation &&
      ("suburb" in updatedDetails.geoLocation ||
        "postCode" in updatedDetails.geoLocation)
    ) {
      const userPoolId = AWS_USER_POOL_ID;
      const userName = email;

      const attributeList = [
        {
          Name: "custom:Suburb",
          Value: updatedDetails.geoLocation.suburb,
        },
        {
          Name: "custom:Postal_Code",
          Value: updatedDetails.geoLocation.postCode,
        },
      ];

      const params = {
        UserPoolId: userPoolId,
        Username: userName,
        UserAttributes: attributeList,
      };

      await cognitoIdentityServiceProvider
        .adminUpdateUserAttributes(params)
        .promise();
    }

    return updatedUser.Attributes as User;
  }

  async updateVerificationStatus(userId: string): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        email: userId,
      },
      UpdateExpression: "set #MyVariable = :y",
      ExpressionAttributeNames: {
        "#MyVariable": "verificationStatus",
      },
      ExpressionAttributeValues: {
        ":y": VERIFICATION_STATUS.KYC_COMPLETE,
      },
    };

    const data = await this.docClient.update(params).promise();
    if (data) return "Verification status updated in challenge";
    else return "Error updating Verification status";
  }

  async updateEmailSubscription(
    userEmail: string,
    emailSubscription: string
  ): Promise<string> {
    const { email } = await this.getUserProfile(userEmail);

    let exp = {
      UpdateExpression: "set emailSubscription = :r",
      ExpressionAttributeValues: { ":r": emailSubscription },
    };

    const updatedItem = await this.docClient
      .update({
        TableName: this.tableName,
        Key: { email },
        UpdateExpression: exp.UpdateExpression,
        ExpressionAttributeValues: exp.ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return updatedItem.Attributes.emailSubscription;
  }

  async getUserEmailSubscription(email: string): Promise<{ status: string }> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { email },
      })
      .promise();

    return { status: result.Item.emailSubscription };
  }
}

export default UserProfileService;
