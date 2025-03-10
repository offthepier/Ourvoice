import IAnswer from "./IAnswer";
interface IQuestion {
  questionId?: string;
  questionTitle: string;
  questionType: string;
  answers: IAnswer[];
  respondedCount?: number;
  randomize?: boolean;
}
export default IQuestion;
