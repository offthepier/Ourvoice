/**
 * Module  -  Create a new Survey
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
import CreateSurvey from "../../dtos/surveyDto";
import formatErrorResponse from "src/core/formatErrorResponse";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { CreateSurveyReqSchema } from "src/helpers/validators/schema/SurveyValidationSchema";
import { StatusCodes } from "http-status-codes";
import { createSurvey } from "./surveyCreationHelper";
export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & CreateSurvey,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { body } = event;
    const { authorizer } = event.requestContext;

    try {
      const survey = await createSurvey(body, authorizer?.claims?.email);
      return formatJSONResponse(StatusCodes.CREATED, survey);
    } catch (err) {
      console.log(err);
      return formatErrorResponse(err);
    }
  }
).use(requestValidator({ body: CreateSurveyReqSchema }));
