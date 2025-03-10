interface ICompleteSurvey {
  body: {
    limit: number;
  };

  cognitoPoolClaims: {
    userId: string;
  };
}

export default ICompleteSurvey;
