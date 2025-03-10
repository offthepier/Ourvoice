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
import votingService from "src/service/VotingService";
import formatErrorResponse from "src/core/formatErrorResponse";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { object, string } from "yup";
import postsService from "src/service/PetitionService";
import followersService from "src/service/FollowersService";
import userInfoService from "src/service/GetUserInfoService";
import { StatusCodes } from "http-status-codes";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;
    console.log(event.queryStringParameters);
    try {
      //Get votes for the post
      let data = await votingService.getVoteStatusByPost(
        authorizer?.claims?.email,
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

      return formatJSONResponse(StatusCodes.OK, {
        data,
        postFollowStatus: followStatus,
        postCreatorInfo: {
          firstName,
          lastName,
          imageUrl,
          role,
        },
      });
    } catch (err) {
      return formatErrorResponse(err);
    }
  }
).use(
  requestValidator({
    queryStringParameters: object({
      postId: string().required("postId is required"),
    }),
  })
);
