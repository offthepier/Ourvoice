import {
  CognitoUserAttribute,
  ISignUpResult,
} from "amazon-cognito-identity-js";
import UserPool from "../../../aws/cognito/UserPool";
import ISignUp from "./SignUp.interface";

const getAttributeList = (data: ISignUp) => {
  let attributeList = [
    new CognitoUserAttribute({
      Name: "custom:First_Name",
      Value: data.firstName,
    }),
    new CognitoUserAttribute({
      Name: "custom:Last_Name",
      Value: data.lastName,
    }),
    new CognitoUserAttribute({
      Name: "custom:Country",
      Value: data.country,
    }),
    new CognitoUserAttribute({
      Name: "custom:Postal_Code",
      Value: data.postalCode,
    }),
    new CognitoUserAttribute({
      Name: "custom:Suburb",
      Value: data.suburb,
    }),
    new CognitoUserAttribute({
      Name: "custom:refToken",
      Value: "12345",
    }),
  ];
  return attributeList;
};

// OnSubmit
const signUp = async (
  data: ISignUp,
  onFailure: (err: Error) => void,
  onSuccess: (results: ISignUpResult, data: ISignUp) => void
) => {
  console.log(data);
  UserPool.signUp(
    data.email,
    data.password,
    getAttributeList(data),
    [],
    (err, results) => {
      if (results) {
        onSuccess(results, data);
      }

      if (err) {
        console.log(err);
        onFailure(err);
      }
    }
  );
};

const SignUpService = {
  signUp,
};

export default SignUpService;
