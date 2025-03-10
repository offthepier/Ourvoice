import IS3FileType from "src/pages/proposals/newProposal/Logic/IFileType";

interface ISideBarItem {
  onClickDelete: (file: IS3FileType) => void;
  file: IS3FileType;
}

export default ISideBarItem;
