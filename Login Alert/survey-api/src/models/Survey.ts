export interface IAnswer {
  answerId: string;
  answer: string;
  count?: number;
}

export interface IQuestion {
  questionId: string;
  questionTitle: string;
  questionType: string;
  answers: IAnswer[];
  randomize?: boolean;
}

interface ISurvey {
  surveyID: string;
  community?: string;
  surveyTitle?: string;
  surveyDesc?: string;
  userId: string;
  expireDate?: string;
  createdAt?: string;
  questions?: IQuestion[];
  communityType?: string;
  status?: string;
  uniqueCommunity?: string;
}

export default ISurvey;
