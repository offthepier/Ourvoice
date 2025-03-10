import createDynamoDBClient from "../../config/db";
import UserProfile from "./userProfile.service";

const USER_TABLE = process.env.USER_TABLE || "User";

const userProfileService = new UserProfile(createDynamoDBClient(), USER_TABLE);

export default userProfileService;
