import { SURVEY_STATUS } from "src/constants/SurveyStatus";
import { v4 as uuid } from "uuid";
import SurveyService from "../../service/Survey";

export async function createSurvey(body: any, userEmail: string) {
  const id = uuid();

  return await SurveyService.createSurvey({
    surveyID: id,
    surveyTitle: body.surveyTitle,
    surveyDesc: body.surveyDesc,
    expireDate: body.expireDate,
    status: SURVEY_STATUS.ACTIVE,
    questions: body.questions,
    createdAt: new Date().toISOString(),
    userId: userEmail,
  });
}
