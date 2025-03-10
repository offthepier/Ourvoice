import IQuestion from "@/types/Question.interface";

interface IRadioQuestion {
  question?: IQuestion;
  onChangeAnswer?: (answerId: { answerId: string }[]) => void;
  index?: number;
  disabled?:boolean
}
export default IRadioQuestion;
