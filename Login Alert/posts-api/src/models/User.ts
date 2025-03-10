interface IGeoLocation {
  street?: string;
  postCode: string;
  suburb: string;
  state?: string;
  country: string;
}

interface IElectorate {
  federalElectorate?: string;
  localElectorate?: string;
  stateElectorate?: string;
}

interface IUser {
  id: string;
  firstName: string;
  email?: string;
  lastName: string;
  imageUrl?: string;
  geoLocation?: IGeoLocation;
  electorate?: IElectorate;
  street?: string;
  role?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  score?: number;
  emailSubscription?: string;
}

export default IUser;
