interface IAnswer {
  answerId: string;
  answer: string;
  count?: number;
}

interface IQuestion {
  questionId: string;
  questionTitle: string;
  questionType: string;
  answers: IAnswer[];
  randomize?: boolean;
}

interface CreateSurvey {
  body: {
    surveyTitle?: string;
    surveyDesc?: string;
    expireDate?: string;
    createdAt?: string;
    questions: IQuestion[];
  };

  cognitoPoolClaims: {
    userId: string;
  };
}

export default CreateSurvey;
