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
import followersService from "src/service/FollowersService";
import userInfoService from "src/service/GetUserInfoService";
import votingService from "src/service/VotingService";
import { StatusCodes } from "http-status-codes";
import { encrypt } from "src/utils/encrypt";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & GetPosts,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;

    try {
      let post = await postsService.getPostById(
        event.queryStringParameters.postId
      );
      //Get post follow status
      let followStatus = await followersService.getPostFollowStatus(
        authorizer?.claims?.email,
        event.queryStringParameters.postId
      );

      //Get postData to retrieve creator id
      let postData = await postsService.getPostById(
        event.queryStringParameters.postId
      );

      //Get Post Creator information
      let { firstName, lastName, role, imageUrl } =
        await userInfoService.getUserProfile(postData.userId);

      //post like status
      let likeStatus = await votingService.getVoteStatusByPost(
        authorizer?.claims?.email,
        event.queryStringParameters.postId
      );

      //Encrypt User ID
      post.userId = encrypt(post.userId)

      return formatJSONResponse(StatusCodes.OK, {
        post,
        postFollowStatus: followStatus,
        postCreatorInfo: {
          firstName,
          lastName,
          imageUrl,
          role,
        },
        likeStatus,
      });
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
);
