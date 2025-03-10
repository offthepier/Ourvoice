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
import IFollowUser from "src/dtos/followUser";
import { decrypt } from "src/utils/encrypt";
import { StatusCodes } from "http-status-codes";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { UnFollowUserReqValidation } from "src/helpers/validators/schemas/Followers/UnFollowUserReqValidation.schema";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & IFollowUser,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { body } = event;

    const { authorizer } = event.requestContext;
    const userId = decrypt(decodeURIComponent(body.followerId));

    try {
      const post = await FollowersService.unfollowUser({
        userID: authorizer?.claims?.email,
        followerID: userId,
      });

      return formatJSONResponse(StatusCodes.CREATED, post);
    } catch (err) {
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err.message);
    }
  }
).use(requestValidator({ body: UnFollowUserReqValidation }));;
