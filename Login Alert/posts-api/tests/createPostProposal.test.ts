import { handler } from "../src/functions/posts/createPost";
import { generateEvent } from "./utils/eventGenerator";
import { getTestUser } from "./utils/getTestUser";
import { TestProposalPostSample } from "./utils/SamplePost";

const GetUserInfoService = require("../src/service/GetUserInfoService");

jest.setTimeout(50000);

jest.mock("../src/service/GetUserInfoService", () => ({
  getUserProfile: jest.fn(),
}));

jest.mock("uuid", () => ({ v4: () => "98fa966c-3bf4-4fc4-9ecd-39c5c0994f2p" }));

describe("Test Create Post Endpoint", function () {
  it("Verifies successful creation of post", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const p = Promise.resolve(getTestUser());
    GetUserInfoService.getUserProfile.mockImplementation(() => p);

    const result = await handler(
      generateEvent({
        claims: {
          email: TestProposalPostSample.userId,
          ["custom:First_Name"]: TestProposalPostSample.userFirstName,
          ["custom:Last_Name"]: TestProposalPostSample.userLastName,
          ["cognito:groups"]: "CITIZEN",
        },
        body: {
          challengeID: TestProposalPostSample.challengeID,
          challenge: TestProposalPostSample.challenge,
          community: TestProposalPostSample.community,
          title: TestProposalPostSample.title,
          description: TestProposalPostSample?.description,
          images: TestProposalPostSample.images,
          postType: TestProposalPostSample.postType,
          tags: TestProposalPostSample.tags,
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
