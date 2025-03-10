interface CreateChallenge {
  
  body: {
    title: string;
    challengeID: string;
    community: string;
  };
}

export default CreateChallenge;
