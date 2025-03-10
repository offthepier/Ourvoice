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
import { requestValidator } from "src/helpers/RequestValidator";
import { EmailSubscriptionRequestValidator } from "src/helpers/validators";
export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    console.log(event);
    const { authorizer } = event.requestContext;
    const email = authorizer?.claims?.email;
    const { emailSubscription } = event.body as any;
    try {
      const updateUserProfile =
        await userProfileService.updateEmailSubscription(
          email,
          emailSubscription
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
).use(requestValidator({ body: EmailSubscriptionRequestValidator }));
