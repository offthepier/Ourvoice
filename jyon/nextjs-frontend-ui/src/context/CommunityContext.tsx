import React, { createContext, ReactNode, useState } from "react";

interface ContextProps {
  activeCommunity: string;
  setActiveCommunity: (community: string) => void;
  isChallengeOrProposalSelected: boolean;
  setIsChallengeOrProposalSelected: (value: boolean) => void;
}

export const CommunityContext = createContext<ContextProps>({
  activeCommunity: "ALL",
  setActiveCommunity: () => {},
  isChallengeOrProposalSelected: false,
  setIsChallengeOrProposalSelected: () => {},
});

interface IAuthContextProps {
  children: ReactNode;
}

export const CommunityContextProvider = ({ children }: IAuthContextProps) => {
  const [activeCommunity, setActiveCommunity] = useState<string>("ALL");
  const [isChallengeOrProposalSelected, setIsChallengeOrProposalSelected] =
    useState<boolean>(false);

  return (
    <CommunityContext.Provider
      value={{
        activeCommunity,
        setActiveCommunity,
        isChallengeOrProposalSelected,
        setIsChallengeOrProposalSelected,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export default CommunityContextProvider;
