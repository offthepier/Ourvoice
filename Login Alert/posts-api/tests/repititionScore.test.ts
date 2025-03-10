import reputationService from "../src/service/repetitionScore";
import { SCORE_TYPES } from "../src/constants/scoreTypes";

jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      // just an object, not a function
      DocumentClient: jest.fn(() => ({
        update: jest.fn().mockImplementation(() => {
          console.log("Mock Insert Done");
          return {
            promise() {
              return Promise.resolve({
                Attributes: {
                  score: 10,
                },
              });
            },
          };
        }),
        get: jest.fn().mockImplementation(() => {
          return {
            promise() {
              return Promise.resolve({
                Item: { email: "test@gmail.com", score: 0 },
              });
            },
          };
        }),
      })),
    },
  };
});

describe("RepetitionScoreService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("generateUserFollowedNotification creates a notification and sends an email", async () => {
    // const p = Promise.resolve(getTestUser());
    // GetUserInfoService.getUserProfile.mockImplementation(() => p);

    const resultOwnLike = await reputationService.getUpdatedScore({
      userEmail: "test@gmail.com",
      type: {
        scoreType: SCORE_TYPES.ownCommentLike,
      },
    });

    const resultLiked = await reputationService.getUpdatedScore({
      userEmail: "test@gmail.com",
      type: {
        scoreType: SCORE_TYPES.liked,
      },
    });
    const resultUnliked = await reputationService.getUpdatedScore({
      userEmail: "test@gmail.com",
      type: {
        scoreType: SCORE_TYPES.unliked,
      },
    });
    const resultProposalCreator = await reputationService.getUpdatedScore({
      userEmail: "test@gmail.com",
      type: {
        scoreType: SCORE_TYPES.proposalCreator,
      },
    });
    const resultProposalVoter = await reputationService.getUpdatedScore({
      userEmail: "test@gmail.com",
      type: {
        scoreType: SCORE_TYPES.proposalVoter,
      },
    });
    const resultOwnCommentLike = await reputationService.getUpdatedScore({
      userEmail: "test@gmail.com",
      type: {
        scoreType: SCORE_TYPES.ownCommentLike,
      },
    });
    const resultCommentLike = await reputationService.getUpdatedScore({
      userEmail: "test@gmail.com",
      type: {
        scoreType: SCORE_TYPES.commentLike,
      },
    });
    const resultOwnPostLike = await reputationService.getUpdatedScore({
      userEmail: "test@gmail.com",
      type: {
        scoreType: SCORE_TYPES.ownPostLike,
      },
    });

    const score = await reputationService.getUserProfileScore("test@gmail.com");

    expect(resultLiked).toBeDefined();
    expect(resultOwnCommentLike).toBeDefined();
    expect(resultOwnLike).toBeDefined();
    expect(resultProposalCreator).toBeDefined();
    expect(resultUnliked).toBeDefined();
    expect(resultProposalVoter).toBeDefined();
    expect(resultCommentLike).toBeDefined();
    expect(resultOwnPostLike).toBeDefined();
    expect(score).toBeDefined();
  });
});
