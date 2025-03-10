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
import VotePost from "src/dtos/votePost";
import { StatusCodes } from "http-status-codes";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { VotePostReqSchema } from "src/helpers/validators/schemas/Votes/VotePostReqValidation.schema";
import { decrypt } from "src/utils/encrypt";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & VotePost,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { body } = event;
    console.log("___Event____");

    const { authorizer } = event.requestContext;

    try {
      const post = await votingService.votePost({
        postID: body.postID,
        userID: authorizer?.claims?.email,
        voteType: body.type,
        postCreatorId: decrypt(body.postCreatorID),
        status: body.status,
      });

      return formatJSONResponse(StatusCodes.CREATED, post);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
).use(requestValidator({ body: VotePostReqSchema }));;
