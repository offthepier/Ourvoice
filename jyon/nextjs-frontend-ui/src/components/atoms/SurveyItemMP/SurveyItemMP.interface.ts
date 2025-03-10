import ISurvey from "@/service/Surveys/ISurveys.interface";

interface ISurveyItemMP {
  onClickView?: () => void;
  onClickResults?: () => void;
  visibility?: boolean;
  surveyItem: ISurvey;
}

export default ISurveyItemMP;
