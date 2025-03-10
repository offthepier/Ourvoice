import notificationService from "../../src/service/NotificationService";
import NOTIFICATION_TYPES from "../../src/constants/NotificationTypes";
import IFollow from "../../src/models/Follow";
import { runEmailJob } from "../../src/service/EmailService/Email.service";
import { TestGeneralPostSample } from "../utils/SamplePost";
import { COMMENT_EMAIL } from "../../src/constants/emailTemplates";
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

describe("NotificationService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("generateUserFollowedNotification creates a notification and sends an email", async () => {
    const follow: IFollow = {
      userID: "user1",
      followerID: "user2",
    };

    const user = {
      firstName: "John",
      lastName: "Doe",
      imageUrl: "https://example.com/johndoe.jpg",
    };

    const u = Promise.resolve(user);
    GetUserInfoService.getUserProfile.mockImplementation(() => u);

    const p = Promise.resolve(TestGeneralPostSample);
    PetitionService.getPostById.mockImplementation((postId: string) => p);

    const result = await notificationService.generateUserCommentedNotification(
      follow
    );

    expect(result).toMatchObject({
      fromUserId: follow.userID,
      userID: TestGeneralPostSample.userId,
      notificationType: NOTIFICATION_TYPES.COMMENT,
    });

    expect(runEmailJob).toHaveBeenCalledWith({
      toAddresses: [TestGeneralPostSample.userId],
      message: {
        subject: COMMENT_EMAIL.subject,
        body: "John Doe has commented on your post\"",
      },
    });
  });
});
