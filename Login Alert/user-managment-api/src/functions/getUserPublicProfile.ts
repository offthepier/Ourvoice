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
import { decrypt } from "src/utils/encrypt";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    console.log(
      decodeURIComponent(decrypt(event.queryStringParameters.userId))
    );
    try {
      const userProfile = await userProfileService.getUserPublicProfile(
        decodeURIComponent(decrypt(event.queryStringParameters.userId))
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
