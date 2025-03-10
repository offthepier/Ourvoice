interface CreatePost {
  body: {
    title: string;
    postType: string;
    description: string;
    challenge: string;
    challengeID: string;
    community: string;
    tags?: [];
    images?: [];
    postId?: string;
  };
  cognitoPoolClaims: {
    email: string;
    groups: string;
    First_Name: string;
    Last_Name: string;
    sub: string;
  };
}

export default CreatePost;
