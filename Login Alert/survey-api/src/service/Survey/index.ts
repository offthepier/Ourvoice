import createDynamoDBClient from "../../config/db";
import SurveyService from "./survey.service";

const SURVEY_TABLE = process.env.SURVEY_TABLE || "Surveys";

const surveyService = new SurveyService(createDynamoDBClient(), SURVEY_TABLE);

export default surveyService;
