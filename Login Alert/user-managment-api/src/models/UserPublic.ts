export interface IGeoLocation {
  country: string;
}

interface IUserPublic {
  firstName: string;
  lastName: string;
  imageUrl?: string;
  geoLocation: IGeoLocation;
  gender?: string;
  intro?: string;
  interests?: string[];
  score?: number;
  verificationStatus?: string;
  role?: string;
  rank?: number;
  imageFullUrl?: string;
}

export default IUserPublic;
