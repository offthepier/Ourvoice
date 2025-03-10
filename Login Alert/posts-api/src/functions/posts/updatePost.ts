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
import CreatePost from "../../dtos/createPostDto";
import PetitionService from "../../service/PetitionService";
import formatErrorResponse from "src/core/formatErrorResponse";
import { requestValidator } from "src/helpers/validators/RequestValidator";
import { StatusCodes } from "http-status-codes";
import { UpdatePostReqSchema } from "src/helpers/validators/schemas/UpdatePostRequestValidation.schema";
export const handler: Handler = middify(
  async (
    event: APIGatewayEvent & CreatePost,
    _context: Context
  ): Promise<APIGatewayProxyResult> => {
    const { body } = event;
    console.log("___Event____");
    const { authorizer } = event.requestContext;

    try {
      const post = await PetitionService.updatePost({
        challengeID: body.challengeID,
        challenge: body.challenge,
        community: body.community,
        title: body?.title ?? "",
        description: body?.description,
        images: body.images,
        postType: body.postType,
        tags: body.tags,
        createdAt: new Date().toISOString(),
        userId: authorizer?.claims?.email,
        userFirstName: authorizer?.claims?.["custom:First_Name"],
        userLastName: authorizer?.claims?.["custom:Last_Name"],
        userRole: authorizer?.claims?.["cognito:groups"],
        postId: body.postId,
      });

      return formatJSONResponse(StatusCodes.CREATED, post);
    } catch (err) {
      console.log(err);
      return formatErrorResponse(err);
    }
  }
).use(requestValidator({ body: UpdatePostReqSchema }));
