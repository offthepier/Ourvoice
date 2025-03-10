interface CreateToken {
  body: {
    id: string;
    fullName: string;
    email: string;
    electorateType?: string;
    electorateName?: string;
  };
}

export default CreateToken;
