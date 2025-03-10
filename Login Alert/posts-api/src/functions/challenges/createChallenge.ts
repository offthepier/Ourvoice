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
import CreateChallenge from "../../dtos/createChallenge";
import ChallengeService from "src/service/ChallengeService";
import { StatusCodes } from "http-status-codes";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { CreateChallengeReqSchema } from "src/helpers/validators/schemas/CreateChallengeRequestValidation.schema";
import { USER_ROLES } from "src/constants/UserRoles";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & CreateChallenge,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { body, requestContext } = event;
    try {
      //If user is not an admin reject the request
      if (
        !requestContext.authorizer?.claims?.["cognito:groups"].includes(
          USER_ROLES.ADMIN
        )
      ) {
        return formatJSONResponse(
          StatusCodes.UNAUTHORIZED,
          "Action Not Allowed!"
        );
      }

      const challenge = await ChallengeService.createChallenge({
        community: body.community,
        title: body.title,
      });

      return formatJSONResponse(StatusCodes.CREATED, challenge);
    } catch (err) {
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
).use(requestValidator({ body: CreateChallengeReqSchema }));
