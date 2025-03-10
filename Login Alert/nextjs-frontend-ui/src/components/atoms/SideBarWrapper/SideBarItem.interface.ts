import { ReactNode } from "react";

interface ISideBarWrapper {
  children?: ReactNode;
  selectedItem: boolean;
  lastIndex: number;
  role?: string;
}

export default ISideBarWrapper;
