import IPost from "../TopProposals/Proposals.interface";

interface ISideBarItem {
  onClick?: (key: string) => void;
  post: IPost;
}

export default ISideBarItem;
