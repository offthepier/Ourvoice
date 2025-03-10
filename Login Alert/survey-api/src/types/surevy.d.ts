export interface IAnswers {
  answer: string;
}

export interface IQuestions {
  questionTitle: string;
  questionType: string;
  answers: IAnswers[];
}
export interface Survey {
  surveyTitle?: string;
  surveyDesc?: string;
  expireDate?: string;
  questions?: IQuestion[];
}

export interface PostISurvey {
  surveyTitle?: string;
  surveyDesc?: string;
  expireDate?: string;
  questions?: IQuestions[];
}

export interface IAnswer {
  answerId: string;
}
export interface IQuestion {
  questionId: string;
  answers: IAnswer[];
}
export interface IResponse {
  surveyID: string;
  questions?: IQuestion[];
}

export interface ISurveyLimit {
  limit: number;
}
