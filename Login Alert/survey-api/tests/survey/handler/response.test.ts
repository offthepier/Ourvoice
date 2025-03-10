import { handler } from "../../../src/functions/response/responseFunction";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { StatusCodes } from "http-status-codes";
import { generateEvent } from "../../utils/eventGenerator";
import createDynamoDBClient from "../../../src/config/db";
import { v4 as uuid } from "uuid";
import COMMUNITY_TYPES from "../../../src/constants/CommunityTypes";
import responseService from "../../../src/service/Response";

jest.setTimeout(30000);

describe("Create Response", function () {
  const docClient: DocumentClient = createDynamoDBClient();

  const respose = {
    surveyID: "123",
    questions: [
      {
        questionId: "123",
        answers: [
          {
            answerId: "123",
          },
        ],
      },
    ],
  };

  const notValidResponse = {
    questions: [
      {
        questionId: "123",
        answers: [
          {
            answerId: "123",
          },
        ],
      },
    ],
  };

  it("Verifies successful response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;
    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "test@123@gmail.com",
        },
        body: respose,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(201);
  });

  it("Response failure", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;
    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "test@123@gmail.com",
        },
        body: notValidResponse,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(400);
  });

  it("Verifies error response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 6000,
    } as any;

    // Simulate error being thrown from surveyService.getPendingSurvey
    jest
      .spyOn(responseService, "respondRelavantQuestion")
      .mockRejectedValue(new Error("Internal Server Error"));

    const result = await handler(
      generateEvent({
        claims: {
          email: "abc.004@gmail.com",
        },
        body: {
          limit: 10,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);

    // Restore the original function after the test
    jest.spyOn(responseService, "respondRelavantQuestion").mockRestore();
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
