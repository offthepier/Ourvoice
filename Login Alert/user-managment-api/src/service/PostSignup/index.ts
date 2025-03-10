import createDynamoDBClient from "../../config/db";
import PostSignupSaveUser from "./post.signup.saveUser.service";

const USER_TABLE = process.env.USER_TABLE || "User";

const userService = new PostSignupSaveUser(createDynamoDBClient(), USER_TABLE);

export { userService };
