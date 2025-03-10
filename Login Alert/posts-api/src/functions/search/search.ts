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
import userInfoService from "src/service/GetUserInfoService";
import postsService from "src/service/PetitionService";
import { StatusCodes } from "http-status-codes";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    try {
      const userResults = await userInfoService.searchUser(
        decodeURIComponent(event.queryStringParameters.searchText)
      );

      const postResults = await postsService.searchPost(
        decodeURIComponent(event.queryStringParameters.searchText)
      );

      return formatJSONResponse(StatusCodes.OK, { userResults, postResults });
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
);
