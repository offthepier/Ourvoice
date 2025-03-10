interface IModelDialog {
  title?: string;
  description?: string;
  buttonText?: string;
  onClickAction?: () => void;
  onClose?: () => void;
  imageUrl?: string;
  open?: boolean;
}

export default IModelDialog;
