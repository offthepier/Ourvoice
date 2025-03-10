interface ICompleteSurvey {
  body: {
    surveyId: string;
    limit: number;
  };

  cognitoPoolClaims: {
    userId: string;
  };
}

export default ICompleteSurvey;
