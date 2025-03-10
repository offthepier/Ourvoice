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
import postsService from "src/service/PetitionService";
import { decrypt } from "src/utils/encrypt";
import userInfoService from "src/service/GetUserInfoService";
import { StatusCodes } from "http-status-codes";
import GetPostsByUser from "src/dtos/getUserPosts";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & GetPostsByUser,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const userId = decrypt(
      decodeURIComponent(event.body.userId)
    );

    const user = await userInfoService.getUserProfile(userId);

    try {
      const posts = await postsService.getPostsByUser(
        user.email,
        user.role,
        event.body.limit ?? 10,
        event.body.lastEvaluatedKey
      );
      return formatJSONResponse(StatusCodes.OK, posts);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
);
