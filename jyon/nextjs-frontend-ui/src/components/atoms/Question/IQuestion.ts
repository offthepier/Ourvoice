import IQuestion from "@/types/Question.interface";

interface IQuestionComponent {
  onAddQuestion?: (question: IQuestion, auto: boolean) => void;
  onRemoveQuestion?: (index: number) => void;
  questionObj?: IQuestion;
  index?: number;
  onSubmit?: () => void;
}

export default IQuestionComponent;
