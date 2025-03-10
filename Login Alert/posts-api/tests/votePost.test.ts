import { handler } from "../src/functions/votes/votePost";
import { generateEvent } from "./utils/eventGenerator";
import { getTestUser } from "./utils/getTestUser";
import {
  TestGeneralPostSample,
  TestProposalPostSample,
} from "./utils/SamplePost";
import VOTE_TYPES from "../src/constants/VotesType";
import { encrypt } from "../src/utils/encrypt";
const GetUserInfoService = require("../src/service/GetUserInfoService");

jest.setTimeout(30000);

jest.mock("../src/service/GetUserInfoService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("../src/service/NotificationService", () => ({
  generateUserVoteNotification: jest.fn(),
}));

jest.mock("../src/service/repetitionScore", () => ({
  getUpdatedScore: jest.fn(),
}));

describe("Verifies Post Voting", function () {
  it("Verifies Request Validations on Vote Post Endpoint", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const p = Promise.resolve(getTestUser());
    GetUserInfoService.getUserProfile.mockImplementation(() => p);

    //Like Post
    const result = await handler(
      generateEvent({
        claims: {
          email: "test@example.com",
        },
        body: {
          postID: TestGeneralPostSample.postId,
          type: "VOTE_TYPES.LIKE",
          postCreatorID: encrypt(TestGeneralPostSample.userId),
          status: "false",
        },
      }),
      context,
      {} as any
    );
    // console.log(result);

    expect(result.statusCode).toEqual(400);
  });

  it("Verifies successful post like", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const p = Promise.resolve(getTestUser());
    GetUserInfoService.getUserProfile.mockImplementation(() => p);

    //Like Post
    const result = await handler(
      generateEvent({
        claims: {
          email: "test@example.com",
        },
        body: {
          postID: TestGeneralPostSample.postId,
          type: VOTE_TYPES.LIKE,
          postCreatorID: encrypt(TestGeneralPostSample.userId),
          status: true,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(201);
  });

  it("Verifies successful post un-like", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const p = Promise.resolve(getTestUser());
    GetUserInfoService.getUserProfile.mockImplementation(() => p);

    //Like Post
    const result = await handler(
      generateEvent({
        claims: {
          email: "test@example.com",
        },
        body: {
          postID: TestGeneralPostSample.postId,
          type: VOTE_TYPES.LIKE,
          postCreatorID: encrypt(TestGeneralPostSample.userId),
          status: false,
        },
      }),
      context,
      {} as any
    );
    console.log(result);

    expect(result.statusCode).toEqual(201);
  });

  it("Verifies successful post vote", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const p = Promise.resolve(getTestUser());
    GetUserInfoService.getUserProfile.mockImplementation(() => p);

    //Like Post
    const result = await handler(
      generateEvent({
        claims: {
          email: "test@example.com",
        },
        body: {
          postID: TestProposalPostSample.postId,
          type: VOTE_TYPES.POSITIVE,
          postCreatorID: encrypt(TestGeneralPostSample.userId),
          status: true,
        },
      }),
      context,
      {} as any
    );
    console.log(result);

    expect(result.statusCode).toEqual(201);
  });

  it("Verifies successful post change-vote", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const p = Promise.resolve(getTestUser());
    GetUserInfoService.getUserProfile.mockImplementation(() => p);

    //Like Post
    const result = await handler(
      generateEvent({
        claims: {
          email: "test@example.com",
        },
        body: {
          postID: TestProposalPostSample.postId,
          type: VOTE_TYPES.NEGATIVE,
          postCreatorID: encrypt(TestGeneralPostSample.userId),
          status: true,
        },
      }),
      context,
      {} as any
    );
    console.log(result);

    expect(result.statusCode).toEqual(201);
  });

  it("Verifies successful post un-vote", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const p = Promise.resolve(getTestUser());
    GetUserInfoService.getUserProfile.mockImplementation(() => p);

    //Like Post
    const result = await handler(
      generateEvent({
        claims: {
          email: "test@example.com",
        },
        body: {
          postID: TestProposalPostSample.postId,
          type: VOTE_TYPES.POSITIVE,
          postCreatorID: encrypt(TestGeneralPostSample.userId),
          status: false,
        },
      }),
      context,
      {} as any
    );
    console.log(result);

    expect(result.statusCode).toEqual(201);
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
