import ISurvey from "@/service/Surveys/ISurveys.interface";

interface ISurveyItem {
  onClick?: () => void;
  visibility?: boolean;
  actionType: "getStarted" | "preview";
  surveyItem: ISurvey;
}

export default ISurveyItem;
