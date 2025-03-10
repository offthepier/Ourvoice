/**
 * Module  - Admin Survey Module
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
import SurveyService from "../../service/Survey";
import formatErrorResponse from "src/core/formatErrorResponse";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { CreateSurveyReqSchema } from "src/helpers/validators/schema/SurveyValidationSchema";
import { v4 as uuid } from "uuid";
import { SURVEY_STATUS } from "src/constants/SurveyStatus";
import { StatusCodes } from "http-status-codes";
export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & CreateSurvey,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { body } = event;
    console.log("___Event____");
    const { authorizer } = event.requestContext;
    const id = uuid();
    try {
      const survey = await SurveyService.createSurveyByAdmin({
        surveyID: id,
        surveyTitle: body.surveyTitle,
        surveyDesc: body.surveyDesc,
        expireDate: body.expireDate,
        status: SURVEY_STATUS.ACTIVE,
        questions: body.questions,
        createdAt: new Date().toISOString(),
        userId: authorizer?.claims?.email,
      });
      return formatJSONResponse(StatusCodes.CREATED, survey);
    } catch (err) {
      console.log(err);
      return formatErrorResponse(err);
    }
  }
).use(requestValidator({ body: CreateSurveyReqSchema }));
