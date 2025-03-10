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

interface IInterests {
  interests: string[];
}

interface IDocuments {
  documents: string[];
}

interface IProfile {
  id: string;
  firstName: string;
  email: string;
  intro?: string;
  lastName: string;
  imageUrl?: string;
  imageFullUrl?: string;
  geoLocation?: IGeoLocation;
  electorate: IElectorate;
  street?: string;
  role?: string;
  addressLine1?: string;
  addressLine2?: string;
  phoneNumber?: string;
  gender?: string;
  city?: string;
  dob?: string;
  interests?: string[];
  docs?: IDocuments;
  score?: number;
  rank?: number;
  verificationStatus?: string;
}

export default IProfile;
