import createDynamoDBClient from "../../config/db";
import PetitionService from "./petition.service";

const POSTS_TABLE = process.env.POSTS_TABLE || "Posts";
const MP_POSTS_TABLE = process.env.MP_POSTS_TABLE || "MPPosts";

const postsService = new PetitionService(
  createDynamoDBClient(),
  POSTS_TABLE,
  MP_POSTS_TABLE
);

export default postsService;
