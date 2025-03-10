import { handler as followHandler } from "../../src/functions/followers/followChallenge";
import { handler as unfollowHandler } from "../../src/functions/followers/unfollowChallenge";
import { generateEvent } from "../utils/eventGenerator";
import { TestGeneralPostSample } from "../utils/SamplePost";

jest.setTimeout(30000);

jest.mock("../../src/service/NotificationService", () => ({
  generatePostFollowedNotification: jest.fn(),
}));

/**
 * Verifies that the request validations on the Challenge Following endpoint are working correctly.
 * @param None
 * @returns None
 */
describe("Verifies Challenge Following", function () {
  it("Verifies Request Validations on Challenge Following Endpoint", async () => {
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
          challenge: TestGeneralPostSample.challenge,
          community: TestGeneralPostSample.community,
        },
      }),
      context,
      {} as any
    );
    expect(result.statusCode).toEqual(400);
  });

  it("Verifies successful challenge follow", async () => {
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
          challengeId: TestGeneralPostSample.challengeID,
          challenge: TestGeneralPostSample.challenge,
          community: TestGeneralPostSample.community,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(201);
  });

  it("Verifies successful challenge un-follow", async () => {
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
          challengeId: TestGeneralPostSample.challengeID,
          challenge: TestGeneralPostSample.challenge,
          community: TestGeneralPostSample.community,
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
