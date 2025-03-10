interface VerifyUser {
  body: {
    grantToken: string;
    transactionID: string;
  };
}

export default VerifyUser;
