import { handler } from "../src/functions/challenges/getTopChallenges";
import { generateEvent } from "./utils/eventGenerator";

jest.setTimeout(30000);

describe("Test GetTopChallenges Endpoint", function () {
  it("Verifies successful response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "slimmirtals.004@gmail.com",
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
