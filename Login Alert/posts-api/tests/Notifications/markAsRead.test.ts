import notificationService from "../../src/service/NotificationService";
import NOTIFICATION_TYPES from "../../src/constants/NotificationTypes";
import VOTE_TYPES from "../../src/constants/VotesType";
import IFollow from "../../src/models/Follow";
import { runEmailJob } from "../../src/service/EmailService/Email.service";
import { getTestUser } from "../utils/getTestUser";
import { TestGeneralPostSample } from "../utils/SamplePost";
import { VOTE_EMAIL, LIKED_EMAIL } from "../../src/constants/emailTemplates";

const GetUserInfoService = require("../../src/service/GetUserInfoService");

jest.mock("../../src/service/GetUserInfoService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      // just an object, not a function
      DocumentClient: jest.fn(() => ({
        update: jest.fn().mockImplementation(() => {
          console.log("Mock Insert Done");
          return {
            promise() {
              return Promise.resolve({});
            },
          };
        }),
      })),
    },
  };
});

jest.mock("../../src/service/EmailService/Email.service", () => ({
  runEmailJob: jest.fn(() => {
    console.log("Mock Email Job Completed");
  }),
}));

describe("NotificationService - Mark As Read", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("test markAsRead endpoint in NotificationService", async () => {
    const user = getTestUser();
    const userPromise = Promise.resolve(user);
    GetUserInfoService.getUserProfile.mockImplementation(() => userPromise);

    const result = await notificationService.markRead(
      TestGeneralPostSample.postId,
      "test1234@gmail.com"
    );

    expect(result).toBe("Notification Marked as Read");
  });
});
