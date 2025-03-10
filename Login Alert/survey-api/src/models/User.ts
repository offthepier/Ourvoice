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
  geoLocation: IGeoLocation;
  electorate: IElectorate;
  street?: string;
  role?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  intro?: string;
  interests?: string[];
  docs?: IDocuments;
  score?: number;
}

export default IUser;
