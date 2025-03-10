import { handler } from "../src/functions/getImageController";
import { generateEvent } from "./utils/eventGenerator";
import createDynamoDBClient from "../src/config/db";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const tableName = process.env.USER_TABLE || "User";
jest.setTimeout(30000);

describe("Test GetUserImage Endpoint", function () {
  const docClient: DocumentClient = createDynamoDBClient();

  // const user = getTestUser();

  it("Verifies successful response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "zekonolu@tutuapp.bid",
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toHaveProperty("firstName", "jenny");
    expect(JSON.parse(result.body)).toHaveProperty("lastName", "anderson");
  });

  it("User Notfound", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "abc.004@gmail.com",
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(404);
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
