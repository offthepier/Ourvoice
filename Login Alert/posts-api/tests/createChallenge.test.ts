import { handler } from "../src/functions/challenges/createChallenge";
import { generateEvent } from "./utils/eventGenerator";
import { TestChallengeSample } from "./utils/SampleChallenge";
import { TestGeneralPostSample } from "./utils/SamplePost";

jest.setTimeout(50000);

jest.mock("uuid", () => ({ v4: () => "1234" }));

describe("Test Create Post Endpoint", function () {
  it("Verifies successful creation of post", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "testuser@gmail.com",
          ["custom:First_Name"]: TestGeneralPostSample.userFirstName,
          ["custom:Last_Name"]: TestGeneralPostSample.userLastName,
          ["cognito:groups"]: "ADMIN",
        },
        body: {
          community: TestChallengeSample.community,
          title: TestChallengeSample.title,
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
