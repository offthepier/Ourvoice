import IQuestion from "@/types/Question.interface";

interface ISurveyTable {
  questions?: IQuestion[];
  getSum: (e: IQuestion) => number;
}

export default ISurveyTable;
