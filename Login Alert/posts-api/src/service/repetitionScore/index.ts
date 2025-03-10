import createDynamoDBClient from "../../config/db";
import RepetitionScoreService from "./repetionScore.service";

const USER_TABLE =  process.env.USER_TABLE || "User";

const getUpdatedScoreService = new RepetitionScoreService(
  createDynamoDBClient(),
  USER_TABLE
);

export default getUpdatedScoreService;
