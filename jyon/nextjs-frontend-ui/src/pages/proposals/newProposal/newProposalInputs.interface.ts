import IChallenge from "@/types/IChallenge";
/*
community was originally tied to challenge (IChallenge),
this meant that community could not be changed and was
completely dependent on the challenge. This prevented
users from changing the community to other communities
like Federal, State or Local. By having it as a separate
variable independent of challenge, users can freely
post in different communities.
*/
interface IProposalInputs {
  challenge: IChallenge;
  postType: string;
  title: string;
  community: string;
  description: string;
  tags: [];
}

export default IProposalInputs;
