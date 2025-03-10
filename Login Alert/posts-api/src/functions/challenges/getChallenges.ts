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
import CreatePost from "../../dtos/createPostDto";
import ChallengeService from "src/service/ChallengeService/";
import { StatusCodes } from "http-status-codes";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & CreatePost,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    try {
      const posts = await ChallengeService.getChallenges();
      return formatJSONResponse(StatusCodes.OK, posts);
    } catch (err) {
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
);
