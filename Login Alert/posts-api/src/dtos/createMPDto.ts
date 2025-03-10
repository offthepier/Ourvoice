interface CreateToken {
  body: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default CreateToken;
