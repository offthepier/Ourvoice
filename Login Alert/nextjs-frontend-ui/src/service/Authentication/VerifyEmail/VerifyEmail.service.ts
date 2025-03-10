import { CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "../../../aws/cognito/UserPool";
import IVerifyEmail from "./VerifyEmail.interface";

// OnSubmit
const verifyEmail = async (
  data: IVerifyEmail,
  onFailure: (err: any) => void,
  onSuccess: (results: any) => void
) => {
  const user = new CognitoUser({
    Username: data.email,
    Pool: UserPool,
  });

  user.confirmRegistration(data.code, true, (err, result) => {
    if (err) {
      onFailure(err);
    }
    if (result) {
      onSuccess(result);
    }
  });
};

// OnSubmit
const sendVerificationCode = async (
  data: { email: string },
  onFailure: (err: any) => void,
  onSuccess: (results: any) => void
) => {
  const user = new CognitoUser({
    Username: data.email,
    Pool: UserPool,
  });

  user.resendConfirmationCode((err, result) => {
    if (err) {
      onFailure(err);
    }
    if (result) {
      onSuccess(result);
    }
  });
};

const VerifyEmailService = {
  verifyEmail,
  sendVerificationCode,
};

export default VerifyEmailService;
