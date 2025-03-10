interface ICompletedSurvey {
  userID: string;
  questionId: string;
  surveyId?: string;
  answerId?: string;
}

export default ICompletedSurvey;
