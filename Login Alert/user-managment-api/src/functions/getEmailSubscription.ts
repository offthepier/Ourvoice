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

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    console.log(event);
    const { authorizer } = event.requestContext;
    const email = authorizer?.claims?.email;
    try {
      const userEmailStatus = await userProfileService.getUserEmailSubscription(
        email
      );
      if (!userEmailStatus) {
        return formatJSONResponse(StatusCodes.NOT_FOUND, "Unable to find");
      }
      return formatJSONResponse(StatusCodes.OK, userEmailStatus);
    } catch (err) {
      return formatJSONResponse(StatusCodes.NOT_FOUND, err);
    }
  }
);
