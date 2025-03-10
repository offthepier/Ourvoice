import notificationService from "../../src/service/NotificationService";
import NOTIFICATION_TYPES from "../../src/constants/NotificationTypes";
import IFollow from "../../src/models/Follow";
import { runEmailJob } from "../../src/service/EmailService/Email.service";
import { getTestUser } from "../utils/getTestUser";
import { TestGeneralPostSample } from "../utils/SamplePost";
import { POST_FOLLOWED_EMAIL } from "../../src/constants/emailTemplates";

const GetUserInfoService = require("../../src/service/GetUserInfoService");
const PetitionService = require("../../src/service/PetitionService");

jest.mock("../../src/service/GetUserInfoService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("../../src/service/PetitionService", () => ({
  getPostById: jest.fn(),
}));

jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      // just an object, not a function
      DocumentClient: jest.fn(() => ({
        put: jest.fn().mockImplementation(() => {
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

describe("NotificationService - generatePostFollowedNotification", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("generatePostFollowedNotification creates a notification and sends an email", async () => {
    const follow: IFollow = {
      userID: "user1",
      followerID: "user2",
    };

    const user = getTestUser();
    const userPromise = Promise.resolve(user);
    GetUserInfoService.getUserProfile.mockImplementation(() => userPromise);

    const postPromise = Promise.resolve(TestGeneralPostSample);
    PetitionService.getPostById.mockImplementation(
      (postId: string) => postPromise
    );

    const failedResult =
      await notificationService.generatePostFollowedNotification(
        user.email || "test@gmail.com",
        TestGeneralPostSample.postId
      );

    const result = await notificationService.generatePostFollowedNotification(
      "test123@gmail.com",
      TestGeneralPostSample.postId
    );
    console.log(result);

    expect(failedResult).toBeUndefined();

    expect(result).toMatchObject({
      fromUserId: "test123@gmail.com",
      userID: TestGeneralPostSample.userId,
      notificationType: NOTIFICATION_TYPES.POST_FOLLOW,
    });

    expect(runEmailJob).toHaveBeenCalledWith({
      toAddresses: [TestGeneralPostSample.userId],
      message: {
        subject: POST_FOLLOWED_EMAIL.subject,
        body: "Test User started following your post\"",
      },
    });
  });
});
