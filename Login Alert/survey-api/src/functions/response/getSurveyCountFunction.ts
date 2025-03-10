/**
 * Module -  Published Surevy for MPs
 * Date - 10/03/2023
 */

import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import middify from "../../core/middify";
import formatJSONResponse from "../../core/formatJsonResponse";
import SurveyService from "../../service/Survey";
import IPublishSurvey from "src/dtos/getMpSurveyAllDto";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & IPublishSurvey,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;

    const email = authorizer?.claims?.email;
    try {
      const surveys = await SurveyService.getMpPublishSurvey(email);
      return formatJSONResponse(201, surveys);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(400, err);
    }
  }
);
