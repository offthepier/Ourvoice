export default interface ISignUp {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  postalCode: string;
  suburb: string;
  password: string;
  refToken?: string;
}
