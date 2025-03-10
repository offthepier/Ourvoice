import { handler } from "../src/functions/search/search";
import { generateEvent } from "./utils/eventGenerator";

jest.setTimeout(30000);

describe("Test Search Endpoint", function () {
  it("Verifies successful response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "slimmortals.004@gmail.com",
        },
        queryStringObject: {
          searchText: "a",
        },
      }),
      context,
      {} as any
    );
    const resultFailed = await handler(
      generateEvent({
        claims: {
          email: "slimmortals.004@gmail.com",
        },
        queryStringObject: { searchText: "" },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(200);
    expect(resultFailed.statusCode).toEqual(400);
    expect(JSON.parse(result.body)).toHaveProperty("userResults");
    expect(JSON.parse(result.body)).toHaveProperty("postResults");
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
