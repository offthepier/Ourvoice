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
import newsFeedService from "src/service/NewsFeedService";
import GetPosts from "src/dtos/getPosts";
import { StatusCodes } from "http-status-codes";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & GetPosts,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;
    try {
      const posts = await newsFeedService.generatePersonalizedFeed({
        userId: authorizer?.claims?.email,
        limit: event.body?.limit,
        offset: event.body?.offset,
        community: event.body?.community,
        lastEvaluatedType: event.body?.lastEvaluatedType,
        lastEvaluatedKey: event.body?.lastEvaluatedKey,
      });

      return formatJSONResponse(StatusCodes.OK, posts);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_GATEWAY, err);
    }
  }
);
