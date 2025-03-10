import { runEmailJob } from "../../src/service/EmailService/Email.service";
import NOTIFICATION_TYPES from "../../src/constants/NotificationTypes";
import { getTestUser } from "../utils/getTestUser";
import { TestGeneralPostSample } from "../utils/SamplePost";
import { POST_FOLLOWED_EMAIL } from "../../src/constants/emailTemplates";

jest.mock("aws-sdk", () => {
  return {
    // just an object, not a function
    SES: jest.fn(() => ({
      sendEmail: jest.fn().mockImplementation(() => {
        console.log("Mock Insert Done");
        return {
          promise() {
            return Promise.resolve({});
          },
        };
      }),
    })),
  };
});

describe("EmailService - RunEmailJob", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("test runEmailJob", async () => {
    const result = await runEmailJob({
      toAddresses: ["test@gmail.com"],
      message: {
        subject: "test message",
        body: "test message",
      },
    });
  });
});
