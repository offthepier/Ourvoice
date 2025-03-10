import { handler } from "../src/functions/getUserPublicProfile";
import { generateEvent } from "./utils/eventGenerator";
import createDynamoDBClient from "../src/config/db";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { getTestUser } from "./utils/getTestUser";
import { encrypt } from "../src/utils/encrypt";

const tableName = process.env.USER_TABLE || "User";
jest.setTimeout(30000);

describe("Test GetUserPublicProfile Endpoint", function () {
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
        queryStringObject: {
          userId: encrypt(user.email),
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toHaveProperty("firstName", user.firstName);
    expect(JSON.parse(result.body)).toHaveProperty("lastName", user.lastName);
    expect(JSON.parse(result.body)).toHaveProperty("gender", user.gender);
    expect(JSON.parse(result.body)).toHaveProperty("imageUrl", user.imageUrl);
    expect(JSON.parse(result.body)).toHaveProperty("role", user.role);

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
