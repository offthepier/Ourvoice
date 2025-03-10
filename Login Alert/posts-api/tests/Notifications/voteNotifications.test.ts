import notificationService from "../../src/service/NotificationService";
import NOTIFICATION_TYPES from "../../src/constants/NotificationTypes";
import VOTE_TYPES from "../../src/constants/VotesType";
import IFollow from "../../src/models/Follow";
import { runEmailJob } from "../../src/service/EmailService/Email.service";
import { getTestUser } from "../utils/getTestUser";
import { TestGeneralPostSample } from "../utils/SamplePost";
import { LIKED_EMAIL } from "../../src/constants/emailTemplates";

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

  test("generatePostVotedNotification creates a notification and sends an email", async () => {
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

    const result = await notificationService.generateUserVoteNotification({
      postID: TestGeneralPostSample.postId,
      userID: "test1234@gmail.com",
      voteType: VOTE_TYPES.POSITIVE,
      postCreatorId: TestGeneralPostSample.userId,
      status: true,
    });

    const resultLike = await notificationService.generateUserVoteNotification({
      postID: TestGeneralPostSample.postId,
      userID: "test1234@gmail.com",
      voteType: VOTE_TYPES.LIKE,
      postCreatorId: TestGeneralPostSample.userId,
      status: true,
    });

    expect(result).toMatchObject({
      fromUserId: "test1234@gmail.com",
      userID: TestGeneralPostSample.userId,
      notificationType: NOTIFICATION_TYPES.POST_LIKE,
    });

    expect(resultLike).toMatchObject({
      fromUserId: "test1234@gmail.com",
      userID: TestGeneralPostSample.userId,
      notificationType: NOTIFICATION_TYPES.POST_LIKE,
    });

    expect(runEmailJob).toHaveBeenCalledWith({
      toAddresses: [TestGeneralPostSample.userId],
      message: {
        subject: LIKED_EMAIL.subject,
        body: 'Test User has liked your post"',
      },
    });

    expect(runEmailJob).toHaveBeenCalledWith({
      toAddresses: [TestGeneralPostSample.userId],
      message: {
        subject: LIKED_EMAIL.subject,
        body: 'Test User has liked your post"',
      },
    });
  });
});
