import createDynamoDBClient from "../../config/db";
import FollowersService from "./followers.service";

const FOLLOWERS_TABLE = process.env.FOLLOWERS_TABLE || "Followers";

const followersService = new FollowersService(
  createDynamoDBClient(),
  FOLLOWERS_TABLE
);

export default followersService;
