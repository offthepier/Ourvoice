import {
  APIGatewayEvent,
  Handler,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import middify from "../../core/middify";
import formatJSONResponse from "../../core/formatJsonResponse";
import SurveyService from "../../service/Survey";
import IUserSurvey from "src/dtos/getUserSurvey";
import { StatusCodes } from "http-status-codes";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { SurevyLimitValidator } from "src/helpers/validators/schema/SurevyLimitValidator";
export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & IUserSurvey,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;
    const { body } = event;

    const userId = authorizer?.claims?.email;
    let limit = body?.limit;
    try {
      const surveys = await SurveyService.getUserSurvey(userId, limit);
      return formatJSONResponse(StatusCodes.OK, surveys);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
    }
  }
).use(requestValidator({ body: SurevyLimitValidator }));
