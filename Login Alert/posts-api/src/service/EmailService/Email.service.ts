import { AWS_REGION, AWS_SES_EMAIL_SOURCE } from "src/config/common";
import IEmailJob from "src/models/Email";

const aws = require("aws-sdk");
const ses = new aws.SES({ region: AWS_REGION });

const runEmailJob = async (emailJob: IEmailJob) => {
  let params = {
    Destination: {
      ToAddresses: [...emailJob.toAddresses],
    },
    Message: {
      Body: {
        Text: { Data: emailJob.message.body },
      },

      Subject: { Data: emailJob.message.subject },
    },
    Source: AWS_SES_EMAIL_SOURCE,
  };

  try {
    return await ses.sendEmail(params).promise();
  } catch (e) {
    console.log(e);
  }
};

const runEmailJobHTML = async (emailJob: IEmailJob) => {

  let params = {
    Destination: {
      ToAddresses: [...emailJob.toAddresses],
    },
    Message: {
      Body: {
        Html: { Data: emailJob.message.body },
      },

      Subject: { Data: emailJob.message.subject },
    },
    Source: AWS_SES_EMAIL_SOURCE,
  };

  try {
    return await ses.sendEmail(params).promise();
  } catch (e) {
    console.log(e);
  }
};

export { runEmailJob, runEmailJobHTML };
