/**
 * Module  - Survey response
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
import ResponseService from "../../service/Response";
import IResponse from "src/dtos/response";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { ResponseBodyValidator } from "src/helpers/validators/schema/ResponseBodyValidator";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & IResponse,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;
    try {
      const surveys = await ResponseService.respondRelavantQuestion({
        surveyID: event?.body?.surveyID,
        questions: event?.body?.questions,
        userId: authorizer?.claims?.email,
      });
      return formatJSONResponse(201, surveys);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(400, err);
    }
  }
).use(requestValidator({ body: ResponseBodyValidator }));
