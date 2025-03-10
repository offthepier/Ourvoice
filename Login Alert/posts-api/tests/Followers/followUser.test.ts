import { handler as followHandler } from "../../src/functions/followers/followUser";
import { handler as unfollowHandler } from "../../src/functions/followers/unfollowUser";
import { generateEvent } from "../utils/eventGenerator";
import { getTestUser } from "../utils/getTestUser";
import { TestGeneralPostSample } from "../utils/SamplePost";
import { encrypt } from "../../src//utils/encrypt";
const GetUserInfoService = require("../../src/service/GetUserInfoService");

jest.setTimeout(40000);

jest.mock("../../src/service/GetUserInfoService", () => ({
  getUserProfile: jest.fn(),
}));

describe("Verifies User Following", function () {
  const p = Promise.resolve(getTestUser());
  GetUserInfoService.getUserProfile.mockImplementation(() => p);

  it("Verifies Request Validations on User Following Endpoint", async () => {
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

  it("Verifies successful user follow", async () => {
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
          followerId: encrypt(TestGeneralPostSample.userId),
        },
      }),
      context,
      {} as any
    );

    console.log(result);

    expect(result.statusCode).toEqual(201);
  });

  it("Verifies successful user un-follow", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    //Like Post
    const result = await unfollowHandler(
      generateEvent({
        claims: {
          email: "testuser1@gmail.com",
        },
        body: {
          followerId: encrypt(TestGeneralPostSample.userId),
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
