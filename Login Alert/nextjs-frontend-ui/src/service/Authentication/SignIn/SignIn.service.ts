import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import axios from "axios";
import { setIsNewUser } from "src/util/setNewUserFlag";
import UserPool from "../../../aws/cognito/UserPool";
import ISignIn from "./SignIn.interface";

// OnSubmit
const login = async (
  data: ISignIn,
  onFailure: (err: any, data: ISignIn) => void,
  onSuccess: (results: CognitoUserSession) => void
) => {
  console.log(data);
  const user = new CognitoUser({
    Username: data.email,
    Pool: UserPool,
  });

  const authDetails = new AuthenticationDetails({
    Username: data.email,
    Password: data.password,
  });

  user.authenticateUser(authDetails, {
    onSuccess: (result) => {
      onSuccess(result);
      setIsNewUser();
    },
    onFailure: (err) => {
      onFailure(err, data);
    },
    newPasswordRequired: (data) => {
      console.log("new password required", data);
    },
  });
};

const SignInService = {
  login,
};

export default SignInService;
