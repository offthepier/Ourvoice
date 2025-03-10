export interface IUpdateProfile {
  firstName: string;
  lastName: string;
  street?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
}

export interface IImage {
  imageUrl: string;
}

export interface IEmailSuscription {
  emailSubscription: string;
}

export interface ICreateMP {
  fullName: string;
  email: string;
  electorateType?: string;
  electorateName?: string;
}

export interface IVerifyUser {
  grantToken: string;
  transactionID: string;
}

export interface IMPBulk {
  fileId: string;
}
