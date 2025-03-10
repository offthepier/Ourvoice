import ISurveyResponse from "@/types/ISurveyResponse";
import SurveyAPI from "../SurveyAPI";
import ISurvey from "./ISurveys.interface";
import { SURVEY_ENDPOINTS } from "@/constants/Path";

const getUserSurveys = async () => {
  return await (
    await SurveyAPI.post(`${SURVEY_ENDPOINTS.GET_USER_SURVEYS}`, {
      limit: 20,
    })
  ).data?.surveys;
};

const getMPSurveys = async () => {
  return await (
    await SurveyAPI.get(`${SURVEY_ENDPOINTS.GET_MP_SURVEYS}`)
  ).data;
};

const getUserCompletedSurveys = async () => {
  return await (
    await SurveyAPI.post(`${SURVEY_ENDPOINTS.GET_COMPLETED_SURVEYS}`, {
      limit: 20,
    })
  ).data.surveys;
};

const createSurvey = async (data: ISurvey) => {
  return await SurveyAPI.post(`${SURVEY_ENDPOINTS.CREATE_SURVEY}`, data);
};

const createSurveyAdmin = async (data: ISurvey) => {
  return await SurveyAPI.post(
    `${SURVEY_ENDPOINTS.CREATE_SURVEY_BY_ADMIN}`,
    data
  );
};

const sendResponse = async (data: ISurveyResponse) => {
  return await SurveyAPI.post(`${SURVEY_ENDPOINTS.GET_SURVEY_RESPONSE}`, data);
};

const SurveyService = {
  getMPSurveys,
  createSurvey,
  getUserSurveys,
  sendResponse,
  getUserCompletedSurveys,
  createSurveyAdmin,
};

export default SurveyService;
