interface IUpdateProfile {
  firstName?: string;
  intro?: string;
  lastName?: string;
  imageUrl?: string;
  street?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  interests?: string[];
  geoLocation?: {
    suburb?: string;
    postCode?: string;
  };
}

export default IUpdateProfile;
