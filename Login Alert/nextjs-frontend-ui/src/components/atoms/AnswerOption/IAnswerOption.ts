import IAnswer from "@/types/IAnswer";
import IQuestion from "@/types/Question.interface";
import { RefInQuestion } from "../Question/Question";

interface IAnswerOptionsComponent {
    qType: string,
    questionObj: IQuestion | undefined,
    answers: IAnswer[],
    handleAddAnswer: (
      answer: string,
      auto: boolean,
      submissionDone: boolean
    ) => void,
    handleRemoveAnswer: (index: number) => void,
    myRef: React.MutableRefObject<RefInQuestion>
  }

  export default IAnswerOptionsComponent;