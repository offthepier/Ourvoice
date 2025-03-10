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
import CreateComment from "src/dtos/createComment";
import commentsService from "src/service/CommentsService";
import { StatusCodes } from "http-status-codes";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { CreateCommentReqSchema } from "src/helpers/validators/schemas/CreateCommentReqValidation.schema";

export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & CreateComment,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { authorizer } = event.requestContext;

    try {
      const post = await commentsService.createComment({
        createdAt: new Date().toISOString(),
        userID: authorizer?.claims?.email,
        userFirstName: authorizer?.claims?.["custom:First_Name"],
        userLastName: authorizer?.claims?.["custom:Last_Name"],
        comment: event.body?.comment,
        commentType: event.body?.commentType,
        postID: event.body?.postID,
        likesCount: 0,
      });

      return formatJSONResponse(StatusCodes.CREATED, post);
    } catch (err) {
      console.log(err);
      return formatJSONResponse(StatusCodes.BAD_GATEWAY, err);
    }
  }
).use(requestValidator({ body: CreateCommentReqSchema }));
