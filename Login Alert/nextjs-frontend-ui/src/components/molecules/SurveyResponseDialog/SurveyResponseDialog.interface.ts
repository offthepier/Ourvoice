import { ISurveyResponseItem } from "@/types/ISurveyResponse";
import IQuestion from "@/types/Question.interface";

interface ISurveyPreviewDialog {
  title?: string;
  description?: string;
  buttonText?: string;
  onClickAction?: (responses: ISurveyResponseItem[]) => void;
  onClose?: () => void;
  imageUrl?: string;
  open?: boolean;
  questions?: IQuestion[];
  expiration?: string;
}

export default ISurveyPreviewDialog;
