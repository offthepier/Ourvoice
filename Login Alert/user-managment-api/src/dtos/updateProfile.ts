interface UpdateProfile {
  body: {
    firstName: string;
    lastName: string;
    street?: string;
    phoneNumber?: string;
  };
}

export default UpdateProfile;
