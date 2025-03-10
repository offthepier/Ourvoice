import { handler } from "../src/functions/posts/getPost";
import { generateEvent } from "./utils/eventGenerator";

jest.setTimeout(50000);

describe("Test GetPersonalizedFeed Endpoint", function () {
  it("Verifies successful response for all community", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "slimmortals.004@gmail.com",
        },
        body: {
          community: "ALL",
          limit: 15,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toHaveProperty("posts");
    expect(JSON.parse(result.body)).toHaveProperty("lastEvaluatedType");
  });

  it("Verifies successful response for local community", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "slimmortals.004@gmail.com",
        },
        body: {
          community: "LOCAL",
          limit: 15,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toHaveProperty("posts");
    expect(JSON.parse(result.body)).toHaveProperty("lastEvaluatedType");
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });

  it("Verifies successful response for federal community", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "slimmortals.004@gmail.com",
        },
        body: {
          community: "FEDERAL",
          limit: 15,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toHaveProperty("posts");
    expect(JSON.parse(result.body)).toHaveProperty("lastEvaluatedType");
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
