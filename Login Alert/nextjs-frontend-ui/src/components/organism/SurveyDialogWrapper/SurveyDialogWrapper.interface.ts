interface ISurveyDialogWrapper {
  open: boolean;
  onClose?: () => void;
  title: string;
  description: string;
  expiration?: string;
  children?: React.ReactNode;

}

export default ISurveyDialogWrapper;
