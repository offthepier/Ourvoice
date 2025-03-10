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
import GetPosts from "src/dtos/getPosts";
import postsService from "src/service/PetitionService";
import { StatusCodes } from "http-status-codes";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & GetPosts,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    try {
      const posts = await postsService.getPostsByChallenge(
        event.queryStringParameters.challengeId,
        parseInt(event.pathParameters.limit) ?? 10
      );

      return formatJSONResponse(StatusCodes.OK, { posts });
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
);
