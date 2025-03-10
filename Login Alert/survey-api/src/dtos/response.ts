interface IAnswer {
  answerId: string;
}
interface IQuestion {
  questionId: string;
  answers: IAnswer[];
}
interface IResponse {
  body: {
    surveyID: string;
    questions?: IQuestion[];
  };

  cognitoPoolClaims: {
    userId: string;
  };
}

export default IResponse;
