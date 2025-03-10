/**
 * Module  -  Post Controller
 * Date -  28/11/2022
 */
import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import middify from "../core/middify";
import formatJSONResponse from "../core/formatJsonResponse";
import userProfileService from "src/service/UserProfile";
import UpdateProfile from "src/dtos/updateProfile";
import * as AWS from "aws-sdk";
import { AWS_USER_POOL_ID } from "src/config/aws";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & UpdateProfile,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;
    const id = authorizer?.claims?.email;
    const cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider();
    const { body } = event;
    const { firstName, lastName } = event.body as any;

    const userPoolId = AWS_USER_POOL_ID;
    const userName = id;

    const attributeList = [
      {
        Name: "custom:First_Name",
        Value: firstName,
      },
      {
        Name: "custom:Last_Name",
        Value: lastName,
      },
    ];

    const params = {
      UserPoolId: userPoolId,
      Username: userName,
      UserAttributes: attributeList,
    };

    try {
      await cognitoIdentityServiceProvider
        .adminUpdateUserAttributes(params)
        .promise();
    } catch (error) {
      return formatJSONResponse(StatusCodes.NOT_FOUND, error);
    }

    try {
      const updateUserProfile = await userProfileService.updateUserProfile(
        id,
        body
      );
      if (!updateUserProfile) {
        return formatJSONResponse(StatusCodes.NOT_FOUND, "Unable to find");
      }
      return formatJSONResponse(StatusCodes.OK, updateUserProfile);
    } catch (err) {
      return {
        statusCode: 400,
        body: err.message,
      };
    }
  }
);
