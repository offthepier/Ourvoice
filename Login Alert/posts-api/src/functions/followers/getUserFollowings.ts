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
import { StatusCodes } from "http-status-codes";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    console.log("___Event____");
    console.log(event);

    const { authorizer } = event.requestContext;
    try {
      const list = await FollowersService.getUserFollowingList(
        authorizer.claims.email
      );

      return formatJSONResponse(StatusCodes.OK, list);
    } catch (err) {
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
);
