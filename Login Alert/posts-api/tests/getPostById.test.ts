import { handler } from "../src/functions/posts/getPostById";
import { generateEvent } from "./utils/eventGenerator";
import { getTestUser } from "./utils/getTestUser";
import { TestGeneralPostSample } from "./utils/SamplePost";

const GetUserInfoService = require("../src/service/GetUserInfoService");

jest.setTimeout(30000);

jest.mock("../src/service/GetUserInfoService", () => ({
  getUserProfile: jest.fn(),
}));

describe("Test Get Post By Id Endpoint", function () {
  const p = Promise.resolve(getTestUser());
  GetUserInfoService.getUserProfile.mockImplementation(() => p);

  it("Verifies successful response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: TestGeneralPostSample.userId,
        },
        queryStringObject: {
          postId: TestGeneralPostSample.postId,
        },
      }),
      context,
      {} as any
    );
    console.log(result);

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body).post).toHaveProperty(
      "postId",
      TestGeneralPostSample.postId
    );
    expect(JSON.parse(result.body).post).toHaveProperty(
      "challenge",
      TestGeneralPostSample.challenge
    );
    expect(JSON.parse(result.body).post).toHaveProperty(
      "description",
      TestGeneralPostSample.description
    );
    expect(JSON.parse(result.body).post).toHaveProperty(
      "communityType",
      TestGeneralPostSample.community
    );
    expect(JSON.parse(result.body).post).toHaveProperty(
      "postType",
      TestGeneralPostSample.postType
    );

    expect(JSON.parse(result.body)).toHaveProperty("likeStatus");
    expect(JSON.parse(result.body)).toHaveProperty("postCreatorInfo");
    expect(JSON.parse(result.body)).toHaveProperty("postFollowStatus");
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
