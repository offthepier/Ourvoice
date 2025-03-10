import notificationService from "../../src/service/NotificationService";
import NOTIFICATION_TYPES from "../../src/constants/NotificationTypes";
import VOTE_TYPES from "../../src/constants/VotesType";
import IFollow from "../../src/models/Follow";
import { runEmailJob } from "../../src/service/EmailService/Email.service";
import { getTestUser } from "../utils/getTestUser";
import { TestGeneralPostSample } from "../utils/SamplePost";
import { VOTE_EMAIL, LIKED_EMAIL } from "../../src/constants/emailTemplates";

const GetUserInfoService = require("../../src/service/GetUserInfoService");
const PetitionService = require("../../src/service/PetitionService");
const FollowersService = require("../../src/service/FollowersService");

jest.mock("../../src/service/GetUserInfoService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("../../src/service/PetitionService", () => ({
  getPostById: jest.fn(),
}));

jest.mock("../../src/service/FollowersService", () => ({
  getPostFollowingList: jest.fn(),
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

    const FollowersList = Promise.resolve([user]);
    FollowersService.getPostFollowingList.mockImplementation(
      (postId: string) => FollowersList
    );

    const result =
      await notificationService.generateUserCommentedFollowingPostNotification(
        TestGeneralPostSample.postId,
        "test1234@gmail.com"
      );

    expect(runEmailJob).toHaveBeenCalledWith({
      toAddresses: ["e964ae31-bf12-4bc5-8f81-a089fc1de42a"],
      message: {
        subject: "Someone Commented On A Post You Are Following",
        body: 'Test User has commented on a post you are following"',
      },
    });
  });
});
