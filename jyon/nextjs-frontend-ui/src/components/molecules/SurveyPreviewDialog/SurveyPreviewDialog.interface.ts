import IQuestion from "@/types/Question.interface";

interface ISurveyPreviewDialog {
  title?: string;
  description?: string;
  buttonText?: string;
  onClickAction?: () => void;
  onClose?: () => void;
  imageUrl?: string;
  open?: boolean;
  questions?: IQuestion[];
  expiration?: string;
  disabled?: boolean;
}

export default ISurveyPreviewDialog;
