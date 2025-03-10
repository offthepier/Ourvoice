export interface IGeoLocation {
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

interface IDocuments {
  documents: string[];
}

interface IUser {
  id: string;
  firstName: string;
  email: string;
  lastName: string;
  imageUrl?: string;
  imageFullUrl?: string;
  geoLocation: IGeoLocation;
  electorate: IElectorate;
  federalElectorate?: string;
  localElectorate?: string;
  stateElectorate?: string;
  street?: string;
  role?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  intro?: string;
  interests?: string[];
  docs?: IDocuments;
  score?: number;
  verificationStatus?: string;
  searchableName?: string;
  searchVisibility?: string;
  emailSubscription?: string;
  rank?: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
}

export default IUser;
