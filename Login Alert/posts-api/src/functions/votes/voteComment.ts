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

import VoteComment from "src/dtos/voteComment";
import votingService from "src/service/VotingService";
import { StatusCodes } from "http-status-codes";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { VoteCommentReqSchema } from "src/helpers/validators/schemas/Votes/VoteCommentReqValidation.schema";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & VoteComment,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;

    try {
      const post = await votingService.likeComment({
        postID: event.body?.postID,
        commentID: event.body?.commentID,
        userID: authorizer?.claims?.email,
        status: event.body?.status,
      });

      return formatJSONResponse(StatusCodes.CREATED, post);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
).use(requestValidator({ body: VoteCommentReqSchema }));;
