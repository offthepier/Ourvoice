/**
 * Module  - Get Mp Email Function
 * Date -  13/12/2022
 */
import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import middify from "../../core/middify";
import formatJSONResponse from "../../core/formatJsonResponse";
import mpService from "src/service/MpService";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    console.log(event);
    const { authorizer } = event.requestContext;
    const email = authorizer?.claims?.email;
    try {
      const mpEmail = await mpService.getMPInviteByEmail(email);
      if (!mpEmail) {
        return formatJSONResponse(StatusCodes.NOT_FOUND, "Unable to find");
      }
      return formatJSONResponse(StatusCodes.OK, mpEmail);
    } catch (err) {
      return formatJSONResponse(StatusCodes.NOT_FOUND, err);
    }
  }
);
