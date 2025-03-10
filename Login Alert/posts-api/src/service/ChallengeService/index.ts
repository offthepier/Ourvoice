import createDynamoDBClient from "../../config/db";
import ChallengeService from "./challenge.service";

const CHALLENGES_TABLE = process.env.CHALLENGES_TABLE || "Challenges";

const challengesService = new ChallengeService(
  createDynamoDBClient(),
  CHALLENGES_TABLE
);

export default challengesService;
