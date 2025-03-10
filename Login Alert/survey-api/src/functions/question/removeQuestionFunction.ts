/**
 * Module  - Remove question from survey
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
import QuestionService from "../../service/question";
import Question from "src/dtos/questionDto";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & Question,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;
    try {
      const surveys = await QuestionService.removeQuestion({
        userID: authorizer?.claims?.email,
        questionIndex: event?.body?.questionIndex,
        surveyID: event?.body?.surveyID,
      });
      return formatJSONResponse(201, surveys);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(400, err);
    }
  }
);
