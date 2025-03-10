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
import GetCommentsByPost from "src/dtos/getCommentsByPost";
import commentsService from "src/service/CommentsService";
import formatErrorResponse from "src/core/formatErrorResponse";
import { StatusCodes } from "http-status-codes";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { GetCommentsByPostReqSchema } from "src/helpers/validators/schemas/GetCommentsByPostReqValidation.schema";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & GetCommentsByPost,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {

    try {
      const comments = await commentsService.getCommentsByPost(
        event?.body?.postID,
        event?.body?.limit,
        event?.body?.lastEvaluatedKey
      );

      return formatJSONResponse(StatusCodes.OK, comments);
    } catch (err) {
      return formatErrorResponse(err);
    }
  }
).use(requestValidator({ body: GetCommentsByPostReqSchema }));
