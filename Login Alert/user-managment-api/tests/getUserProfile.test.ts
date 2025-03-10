import { handler } from "../src/functions/getUserProfile";
import { generateEvent } from "./utils/eventGenerator";
import createDynamoDBClient from "../src/config/db";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { getTestUser } from "./utils/getTestUser";

const tableName = process.env.USER_TABLE || "User";
jest.setTimeout(30000);

describe("Test GetUserProfile Endpoint", function () {
  const docClient: DocumentClient = createDynamoDBClient();

  const user = getTestUser();

  it("Verifies successful response", async () => {
    await docClient
      .put({
        TableName: tableName,
        Item: user,
      })
      .promise();

    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          sub: "12345",
          email: user.email,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toMatchObject(user);

    await docClient
      .delete({
        TableName: tableName,
        Key: { email: user.email },
      })
      .promise();
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
