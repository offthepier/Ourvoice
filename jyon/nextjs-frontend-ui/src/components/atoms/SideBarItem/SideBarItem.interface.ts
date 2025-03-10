import { ReactNode } from "react";

interface ISideBarItem {
  onClick?: (key: string) => void;
  visibility?: boolean;
  nested?: boolean;
  icon?: ReactNode;
  text?: string;
  className?: string;
  keyId: string;
  selectedItem?: boolean;
  showDivider?: boolean;
  disabled?: boolean;
}

export default ISideBarItem;
