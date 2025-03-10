interface GetUserSurvey {
  body: {
    community: string;
    limit: number;
  };

  cognitoPoolClaims: {
    userId: string;
  };
}
export default GetUserSurvey;
