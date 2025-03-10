import { DocumentClient } from "aws-sdk/clients/dynamodb";
import createDynamoDBClient from "../src/config/db";
import { handler } from "../src/functions/votes/voteComment";
import { generateEvent } from "./utils/eventGenerator";
import { getTestUser } from "./utils/getTestUser";
import { TestGeneralPostSample } from "./utils/SamplePost";
import VOTE_TYPES from "../src/constants/VotesType";

const GetUserInfoService = require("../src/service/GetUserInfoService");

jest.setTimeout(30000);

jest.mock("../src/service/GetUserInfoService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("../src/service/NotificationService", () => ({
  generateCommentLikeNotification: jest.fn(),
}));

jest.mock("../src/service/repetitionScore", () => ({
  getUpdatedScore: jest.fn(),
}));

describe("Verifies Comment Voting", function () {
  it("Verifies Request Validations on Vote Comment Endpoint", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const p = Promise.resolve(getTestUser());
    GetUserInfoService.getUserProfile.mockImplementation(() => p);

    //Like Post
    const result = await handler(
      generateEvent({
        claims: {
          email: TestGeneralPostSample.userId,
        },
        body: {
          postID: TestGeneralPostSample.postId,
          commentID: "98fa966c-3bf4-4fc4-9ecd-39c5c0994fc2",
          postCreatorID: TestGeneralPostSample.userId,
          status: "123",
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(400);
  });

  it("Verifies successful comment like", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    //Like Post
    const result = await handler(
      generateEvent({
        claims: {
          email: TestGeneralPostSample.userId,
        },
        body: {
          postID: TestGeneralPostSample.postId,
          commentID: "98fa966c-3bf4-4fc4-9ecd-39c5c0994fc2",
          postCreatorID: TestGeneralPostSample.userId,
          status: true,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(201);
  });

  it("Verifies successful comment un-like", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const p = Promise.resolve(getTestUser());
    GetUserInfoService.getUserProfile.mockImplementation(() => p);

    //Like Post
    const result = await handler(
      generateEvent({
        claims: {
          email: TestGeneralPostSample.userId,
        },
        body: {
          postID: TestGeneralPostSample.postId,
          commentID: "98fa966c-3bf4-4fc4-9ecd-39c5c0994fc2",
          postCreatorID: TestGeneralPostSample.userId,
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
