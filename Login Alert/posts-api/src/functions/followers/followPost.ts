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
import IFollowPost from "src/dtos/followPost";
import { StatusCodes } from "http-status-codes";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { FollowPostReqValidation } from "src/helpers/validators/schemas/Followers/FollowPostReqValidation.schema";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & IFollowPost,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { body } = event;

    const { authorizer } = event.requestContext;

    try {
      const post = await FollowersService.followPost(
        authorizer?.claims?.email,
        body.postId
      );

      return formatJSONResponse(StatusCodes.CREATED, post);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err.message);
    }
  }
).use(requestValidator({ body: FollowPostReqValidation }));
