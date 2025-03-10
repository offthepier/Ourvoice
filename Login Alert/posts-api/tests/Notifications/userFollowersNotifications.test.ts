import notificationService from "../../src/service/NotificationService";
import NOTIFICATION_TYPES from "../../src/constants/NotificationTypes";
import IFollow from "../../src/models/Follow";
import { runEmailJob } from "../../src/service/EmailService/Email.service";

const GetUserInfoService = require("../../src/service/GetUserInfoService");

jest.mock("../../src/service/GetUserInfoService", () => ({
  getUserProfile: jest.fn(),
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

    const p = Promise.resolve(user);

    GetUserInfoService.getUserProfile.mockImplementation(() => p);

    const result = await notificationService.generateUserFollowedNotification(
      follow
    );

    expect(result).toMatchObject({
      fromUserId: follow.userID,
      userID: follow.followerID,
      notificationType: NOTIFICATION_TYPES.USER_FOLLOW,
    });

    expect(runEmailJob).toHaveBeenCalledWith({
      toAddresses: [follow.followerID],
      message: {
        subject: "You Have A New Follower",
        body: "John Doe started following you",
      },
    });
  });
});
