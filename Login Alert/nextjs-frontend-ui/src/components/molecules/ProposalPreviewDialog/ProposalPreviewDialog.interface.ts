import Post from "@/types/Post";

interface IProposalPreviewDialog {
  title?: string;
  description?: string;
  buttonText?: string;
  onClickAction?: () => void;
  onClickPost?: () => void;
  onClose?: () => void;
  imageUrl?: string;
  open?: boolean;
  post: Post;
  editMode?: boolean
}

export default IProposalPreviewDialog;
