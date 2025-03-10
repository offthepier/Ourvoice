interface IEmailJob {
  toAddresses: string[];
  message: {
    body: string;
    subject: string;
  };
}

export default IEmailJob;
