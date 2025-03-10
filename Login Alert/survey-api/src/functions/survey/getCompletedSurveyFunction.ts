/**
 * Module  - Survey completed by the user
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
import ICompleteSurvey from "src/dtos/getCompletedSurveyDto";
import { StatusCodes } from "http-status-codes";
import surveyService from "src/service/Survey";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { SurevyLimitValidator } from "src/helpers/validators/schema/SurevyLimitValidator";
export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & ICompleteSurvey,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;
    const userId = authorizer?.claims?.email;
    const limit = event?.body.limit;
    try {
      const surveys = await surveyService.getCompletedUserSurvey(userId, limit);
      return formatJSONResponse(StatusCodes.OK, surveys);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
).use(requestValidator({ body: SurevyLimitValidator }));
