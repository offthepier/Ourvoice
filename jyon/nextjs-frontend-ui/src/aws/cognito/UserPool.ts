import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || "ap-southeast-2_4D3Vmgn2p",
  ClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || "7h6nlohnnvsim6sm54s4ifv11b",
  // UserPoolId: "local_6WqnL6dD",
  // ClientId: "38oas2cdro9nhufaz00rho7fy",
  // endpoint: "http://localhost:9229/",
  // endpoint: ""
};
export default new CognitoUserPool(poolData);
