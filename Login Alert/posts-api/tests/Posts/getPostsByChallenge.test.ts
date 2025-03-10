import { handler } from "../../src/functions/posts/getPostsByChallenge";
import { generateEvent } from "../utils/eventGenerator";
import { getTestUser } from "../utils/getTestUser";

const GetUserInfoService = require("../../src/service/GetUserInfoService");

jest.setTimeout(30000);

jest.mock("../../src/service/GetUserInfoService", () => ({
  getUserProfile: jest.fn(),
}));

describe("Test GetPostsByChallenge Endpoint", function () {
  it("Verifies successful response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const p = Promise.resolve(getTestUser());
    GetUserInfoService.getUserProfile.mockImplementation(() => p);

    const result = await handler(
      generateEvent({
        claims: {
          email: "testuser@gmail.com",
        },
        queryStringObject: {
          challengeId: "1234",
        },
        pathParametersObject: {
          limit: 10,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(200);
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
