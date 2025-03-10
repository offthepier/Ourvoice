interface IRadioAnswers {
  onAddAnswer?: (text: string, auto: boolean, submissionDone: boolean) => void;
  onRemoveAnswer?: (text: number) => void;
  text?: string;
  disabled?: boolean;
  hideButton?: boolean;
  index?: number;
}

export default IRadioAnswers;
