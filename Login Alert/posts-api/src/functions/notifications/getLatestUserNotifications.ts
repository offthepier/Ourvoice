/**
 * Module  -  Post Controller
 * Date -  13/12/2022
 */
import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import middify from "../../core/middify";
import formatJSONResponse from "../../core/formatJsonResponse";
import notificationService from "src/service/NotificationService";
import { StatusCodes } from "http-status-codes";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {

    const { authorizer } = event.requestContext;
    try {
      const list = await notificationService.getUserNotifications(
        authorizer?.claims?.email,
        10,
        null
      );

      return formatJSONResponse(StatusCodes.OK, list);
    } catch (err) {
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
);
