interface IAnswer {
  answerId: string;
}
interface IQuestion {
  questionId: string;
  questionType?: string;
  answers: IAnswer[];
}

interface IResponse {
  userId: string;
  surveyID: string;
  questions?: IQuestion[];
}

export default IResponse;
