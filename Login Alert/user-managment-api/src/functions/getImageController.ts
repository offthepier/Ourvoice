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

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    console.log(event);
    //store the image in the dynamodb table
    const { authorizer } = event.requestContext;
    const email = authorizer?.claims?.email;
    try {
      const userProfile = await profilePicService.getUserProfilePic(email);
      if (!userProfile) {
        return formatJSONResponse(StatusCodes.NOT_FOUND, "Unable to find");
      }
      return formatJSONResponse(StatusCodes.OK, userProfile);
    } catch (err) {
      return formatJSONResponse(StatusCodes.NOT_FOUND, err);
    }
  }
);
