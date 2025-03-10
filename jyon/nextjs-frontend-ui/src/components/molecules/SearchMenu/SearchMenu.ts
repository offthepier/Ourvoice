import IPost from "@/components/atoms/TopProposals/Proposals.interface";
import IUser from "@/types/IUser";

interface ISearchMenu {
  onClose?: () => void;
  anchorEl?: any;
  open?: boolean;
  searchResults?: {
    userResults: IUser[];
    postResults: IPost[];
  };
  loadingResults?: boolean;
}

export default ISearchMenu;
