import createDynamoDBClient from "../../config/db";
import CommentsService from "./comments.service";

const COMMENTS_TABLE = process.env.COMMENTS_TABLE || "Comments";

const commentsService = new CommentsService(
  createDynamoDBClient(),
  COMMENTS_TABLE
);

export default commentsService;
