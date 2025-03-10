import createDynamoDBClient from "../../config/db";
import QuesionService from "./question.service";

const SURVEY_TABLE = process.env.SURVEY_TABLE || "Surveys";

const quizService = new QuesionService(createDynamoDBClient(), SURVEY_TABLE);

export default quizService;
