import IChallenge from "@/types/IChallenge";

interface IProposalInputs {
  challenge: IChallenge;
  postType: string;
  title: string;
  description: string;
  tags: [];
}

export default IProposalInputs;
