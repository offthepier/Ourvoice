import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import middify from "../core/middify";
import formatJSONResponse from "../core/formatJsonResponse";
import profilePicService from "src/service/ImageSaveService";
import * as AWS from "aws-sdk";
import { AWS_USER_POOL_ID } from "src/config/aws";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    console.log(event);
    const cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider();
    const { authorizer } = event.requestContext;
    const email = authorizer?.claims?.email;
    const { imageUrl, imageFullUrl } = event.body as any;

    const userPoolId = AWS_USER_POOL_ID;
    const userName = email;

    const attributeList = [
      {
        Name: "custom:profilePic",
        Value: imageUrl,
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

    //store the image in the dynamodb table
    try {
      const userProfile = await profilePicService.updateUserProfile(
        email,
        imageUrl,
        imageFullUrl
      );
      if (!userProfile) {
        return formatJSONResponse(StatusCodes.NOT_FOUND, "Unable to find");
      }
      return formatJSONResponse(StatusCodes.OK, userProfile);
    } catch (err) {
      return formatJSONResponse(StatusCodes.NOT_FOUND, err);
    }
  }
);
