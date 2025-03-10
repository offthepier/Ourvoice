import createDynamoDBClient from "../../config/db";
import NewsFeedService from "./newsFeedService.service";

const POSTS_TABLE = process.env.FEEDS_TABLE || "Feeds";

const newsFeedService = new NewsFeedService(
  createDynamoDBClient(),
  POSTS_TABLE
);

export default newsFeedService;
