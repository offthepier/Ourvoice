interface CreateSurvey {
  body: {
    surveyID: string;
    questionIndex: number;
  };

  cognitoPoolClaims: {
    userId: string;
  };
}

export default CreateSurvey;
