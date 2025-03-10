import { CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "../../../aws/cognito/UserPool";

// OnSubmit
const confirmPassword = async (
  data: {
    email: string;
    code: string;
    newPassword: string;
  },
  onFailure: (err: any) => void,
  onSuccess: (results: any) => void
) => {
  const user = new CognitoUser({
    Username: data.email,
    Pool: UserPool,
  });

  user.confirmPassword(data.code, data.newPassword, {
    onSuccess: (result) => {
      console.log(result);
      onSuccess(result);
    },
    onFailure: (err) => {
      onFailure(err);
    },
  });
};

const ConfirmPasswordService = {
  confirmPassword,
};

export default ConfirmPasswordService;
