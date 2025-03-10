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
import GetNotifications from "src/dtos/getNotifications";
import { StatusCodes } from "http-status-codes";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & GetNotifications,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {

    const { limit, lastEvaluatedKey } = event.body;
    const { authorizer } = event.requestContext;
    try {
      const list = await notificationService.getUserNotifications(
        authorizer?.claims?.email,
        limit,
        lastEvaluatedKey
      );

      return formatJSONResponse(StatusCodes.OK, list);
    } catch (err) {
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
);
