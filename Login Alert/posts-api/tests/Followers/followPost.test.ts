import { handler as followHandler } from "../../src/functions/followers/followPost";
import { handler as unfollowHandler } from "../../src/functions/followers/unfollowPost";
import { generateEvent } from "../utils/eventGenerator";
import { getTestUser } from "../utils/getTestUser";
import { TestGeneralPostSample } from "../utils/SamplePost";

jest.setTimeout(30000);

jest.mock("../../src/service/NotificationService", () => ({
  generatePostFollowedNotification: jest.fn(),
}));

describe("Verifies Post Following", function () {
  it("Verifies Request Validations on Post Following Endpoint", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    //Like Post
    const result = await followHandler(
      generateEvent({
        claims: {
          email: "testuser1@gmail.com",
        },
        body: {},
      }),
      context,
      {} as any
    );
    expect(result.statusCode).toEqual(400);
  });

  it("Verifies successful post follow", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    //Like Post
    const result = await followHandler(
      generateEvent({
        claims: {
          email: "testuser1@gmail.com",
        },
        body: {
          postId: TestGeneralPostSample.postId,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(201);
  });

  it("Verifies successful post un-follow", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    //Like Post
    const result = await unfollowHandler(
      generateEvent({
        claims: {
          email: TestGeneralPostSample.userId,
        },
        body: {
          postId: TestGeneralPostSample.postId,
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
