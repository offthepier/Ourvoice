import createDynamoDBClient from "../../config/db";
import ResponseService from "./response.service";

const RESPONSE_TABLE = process.env.RESPONSE_TABLE || "Responses";
const responseService = new ResponseService(
  createDynamoDBClient(),
  RESPONSE_TABLE
);

export default responseService;
