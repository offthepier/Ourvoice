import IUser from "@/types/IUser";

interface ISideBarItem {
  onClick?: (key: string) => void;
  user?: IUser;
}

export default ISideBarItem;
