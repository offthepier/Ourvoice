import { handler } from "../src/functions/comments/createComment";
import { generateEvent } from "./utils/eventGenerator";
import { TestGeneralPostSample } from "./utils/SamplePost";

jest.setTimeout(50000);

jest.mock("../src/service/GetUserInfoService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("../src/service/NotificationService", () => ({
  generateUserCommentedNotification: jest.fn(),
  generateUserCommentedFollowingPostNotification: jest.fn(),
}));

jest.mock("uuid", () => ({ v4: () => "98fa966c-3bf4-4fc4-9ecd-39c5c0994fc2" }));

describe("Verifies Comment Creating", function () {
  it("Verifies Request Validations on Comment Create Endpoint", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    //Create Comment
    const result = await handler(
      generateEvent({
        claims: {
          email: TestGeneralPostSample.userId,
          ["custom:First_Name"]: TestGeneralPostSample.userFirstName,
          ["custom:Last_Name"]: TestGeneralPostSample.userLastName,
        },
        body: {
          comment: null,
          commentType: "type",
          postID: TestGeneralPostSample.postId,
        },
      }),
      context,
      {} as any
    );
    expect(result.statusCode).toEqual(400);
  });

  it("Verifies successful post comment", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;


    //Like Post
    const result = await handler(
      generateEvent({
        claims: {
          email: TestGeneralPostSample.userId,
          ["custom:First_Name"]: TestGeneralPostSample.userFirstName,
          ["custom:Last_Name"]: TestGeneralPostSample.userLastName,
        },
        body: {
          comment: "Test Comment",
          commentType: "GENERAL",
          postID: TestGeneralPostSample.postId,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(201);
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
