import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import UserPool from "../../../aws/cognito/UserPool";
import IResetInputs from "./ResetPassword.interface";

// OnSubmit
const resetPassword = async (
  data: IResetInputs,
  onFailure: (err: any, data: IResetInputs) => void,
  onSuccess: (results: CognitoUserSession, data: IResetInputs) => void
) => {
  console.log(data);
  const user = new CognitoUser({
    Username: data.email,
    Pool: UserPool,
  });

  user.forgotPassword({
    onSuccess: (result) => {
      console.log(result);
      onSuccess(result, data);
    },
    onFailure: (err) => {
      onFailure(err, data);
    },
    // inputVerificationCode: (data) => {
    //   console.log("new password required", data);
    // },
  });
};

const ResetPasswordService = {
  resetPassword,
};

export default ResetPasswordService;
