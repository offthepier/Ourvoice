/**
 * Module  -  Post Controller
 * Date -  28/11/2022
 */
import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import middify from "../../core/middify";
import formatJSONResponse from "../../core/formatJsonResponse";
import getUpdatedScoreService from "src/service/repetitionScore";
import GetScore from "src/dtos/scoreStatus";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & GetScore,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;
    const email: string = authorizer?.claims?.email;
    try {
      const reputationScore = await getUpdatedScoreService.getUserProfileScore(
        email
      );
      if (!reputationScore) {
        return formatJSONResponse(StatusCodes.NOT_FOUND, "Unable to find");
      }
      return formatJSONResponse(StatusCodes.OK, reputationScore);
    } catch (err) {
      return formatJSONResponse(StatusCodes.NOT_FOUND, err);
    }
  }
);
