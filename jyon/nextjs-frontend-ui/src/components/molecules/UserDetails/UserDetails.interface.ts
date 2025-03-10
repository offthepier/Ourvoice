interface IAddress {
  postCode: string;
  suburb: string;
  state?: string;
  country: string;
}
interface IInterests {
  interests: string[];
}

interface IElectorate {
  federalElectorate?: string;
  localElectorate?: string;
  stateElectorate?: string;
}
interface IUserDetails {
  firstName?: string;
  lastName?: string;
  addressLine1?: string;
  addressLine2?: string;
  electorate: IElectorate;
  intro?: string;
  country?: string;
  geoLocation?: IAddress;
  phoneNumber?: string;
  gender?: string;
  city?: string;
  dob?: string;
  interests?: string[];
  post?: [];
}

export default IUserDetails;
