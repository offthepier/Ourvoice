import { runEmailJob, ses } from "../../src/service/EmailService/Email.service";
import { AWS_REGION, AWS_SES_EMAIL_SOURCE } from "../../src/config/common";
import IEmailJob from "../../src/models/Email";
import * as aws from "aws-sdk";

jest.setTimeout(500000);

// Mock aws.SES
jest.mock("aws-sdk", () => {
  const sendEmailMock = jest.fn();

  return {
    SES: jest.fn().mockImplementation(() => {
      return {
        sendEmail: sendEmailMock,
      };
    }),
  };
});

describe("EmailService - runEmailJob", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call sendEmail with correct parameters", async () => {
    const emailJob: IEmailJob = {
      toAddresses: ["test@example.com"],
      message: {
        subject: "Test Subject",
        body: "Test Body",
      },
    };

    const sendEmailSpy = jest.spyOn(ses, "sendEmail");

    // Mock the sendEmail method to resolve with a fake response
    sendEmailSpy.mockImplementation(() => {
      return {
        promise: () => Promise.resolve({ MessageId: "test-message-id" }),
      } as any;
    });

    await runEmailJob(emailJob);

    // Check if sendEmail was called with the correct parameters
    const expectedParams = {
      Destination: {
        ToAddresses: [...emailJob.toAddresses],
      },
      Message: expect.any(Object),
      Source: AWS_SES_EMAIL_SOURCE,
    };

    expect(sendEmailSpy).toHaveBeenCalledWith(expectedParams);
  });

  it("should log error message to console in case of error", async () => {
    const emailJob: IEmailJob = {
      toAddresses: ["test@example.com"],
      message: {
        subject: "Test Subject",
        body: "Test Body",
      },
    };

    const sendEmailSpy = jest.spyOn(ses, "sendEmail");

    // Mock the sendEmail method to reject with an error
    const error = new Error("Test Error");
    sendEmailSpy.mockImplementation(() => {
      throw error;
    });

    // Spy on console.log to verify it is called with the error message
    const consoleSpy = jest.spyOn(console, "log");

    await expect(runEmailJob(emailJob)).rejects.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(String));
  });
});
