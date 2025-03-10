interface ICognitoPoolClaims {
  cognitoPoolClaims: {
    email: string;
    groups: string;
    First_Name: string;
    Last_Name: string;
    sub: string;
  };
}

export default ICognitoPoolClaims;
