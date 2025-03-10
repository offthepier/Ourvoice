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
import FollowersService from "src/service/FollowersService";
import { decrypt } from "src/utils/encrypt";
import { StatusCodes } from "http-status-codes";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;

    const userId = decrypt(
      decodeURIComponent(event.queryStringParameters.userId)
    );

    try {
      const following = await FollowersService.getUserFollowingStatus(
        authorizer?.claims?.email,
        userId
      );

      return formatJSONResponse(StatusCodes.OK, { following });
    } catch (err) {
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
);
