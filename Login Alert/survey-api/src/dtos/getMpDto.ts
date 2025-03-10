interface ICreateSurvey {
  body: {
    community: string;
    limit: number;
  };

  cognitoPoolClaims: {
    userId: string;
  };
}

export default ICreateSurvey;
