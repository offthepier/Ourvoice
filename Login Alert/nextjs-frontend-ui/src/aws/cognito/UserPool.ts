import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || "ap-southeast-2_sJm75qNri",
  ClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || "3j6v2oqckv8sc81lvvqf4udm9k",
};
export default new CognitoUserPool(poolData);
