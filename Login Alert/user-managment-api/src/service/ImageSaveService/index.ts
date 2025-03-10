import createDynamoDBClient from "../../config/db";
import ImageSaveService from "./imageSave.service";
const USER_TABLE = process.env.USER_TABLE || "User";

const profilePicService = new ImageSaveService(
  createDynamoDBClient(),
  USER_TABLE
);

export default profilePicService;
