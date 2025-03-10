import {
    Handler,
    Context,
    APIGatewayProxyResult,
  } from "aws-lambda";
  import middify from "../../core/middify";
  import formatJSONResponse from "../../core/formatJsonResponse";
  import postsService from "src/service/PetitionService";
  import { StatusCodes } from "http-status-codes";
  
  /**
   * Delete post by its id
   */
  export const handler: Handler = middify(
    async (
      _context: Context
    ): Promise<APIGatewayProxyResult> => {
  
      try {

        const allDeletedPosts = await postsService.getDeletedPosts();
  
        return formatJSONResponse(StatusCodes.OK, { allDeletedPosts });
      } catch (err) {
        console.log(err);
        return formatJSONResponse(StatusCodes.BAD_REQUEST, err);
      }
    }
  );
  