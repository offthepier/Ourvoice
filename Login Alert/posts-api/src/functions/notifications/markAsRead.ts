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
import MarkAsReadNotification from "src/dtos/markAsRead";
import { StatusCodes } from "http-status-codes";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { NotificationMarkReadValidation } from "src/helpers/validators/schemas/Notifications/NotificationMarkReadValidation.schema";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & MarkAsReadNotification,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { notificationId } = event.body;
    const { authorizer } = event.requestContext;
    try {
      const list = await notificationService.markRead(
        notificationId,
        authorizer?.claims?.email
      );

      return formatJSONResponse(StatusCodes.CREATED, list);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
).use(requestValidator({ body: NotificationMarkReadValidation }));
