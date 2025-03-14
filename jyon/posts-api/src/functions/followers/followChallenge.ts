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
import IFollowChallenge from "src/dtos/followChallenge";
import { StatusCodes } from "http-status-codes";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { FollowChallengeReqValidation } from "src/helpers/validators/schemas/Followers/FollowChallengeReqValidation.schema";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & IFollowChallenge,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { body } = event;

    const { authorizer } = event.requestContext;

    try {
      const post = await FollowersService.followChallenge({
        userID: authorizer?.claims?.email,
        challengeID: body.challengeId,
        challenge: body.challenge,
        community: body.community,
        createdAt: new Date().toISOString(),
      });

      return formatJSONResponse(StatusCodes.CREATED, post);
    } catch (err) {
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
).use(requestValidator({ body: FollowChallengeReqValidation }));
