import { handler } from "../../../src/functions/survey/createSurveyFunction";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { StatusCodes } from "http-status-codes";
import { generateEvent } from "../../utils/eventGenerator";
import createDynamoDBClient from "../../../src/config/db";
import { v4 as uuid } from "uuid";
import SurveyService from "../../../src/service/Survey";

jest.mock("../../../src/service/Survey"); // Add this line
jest.setTimeout(30000);

describe("Create survey by mp", function () {
  const docClient: DocumentClient = createDynamoDBClient();

  const survey = {
    surveyTitle: "Survey version 2",
    surveyDesc: "Survey  description",
    expireDate: "10/12/2023",
    questions: [
      {
        questionTitle: "What is the type of food",
        questionType: "MC",
        answers: [
          {
            answer: "one",
          },
          {
            answer: "two",
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    (SurveyService.createSurvey as jest.Mock).mockClear();
  });

  it("Verifies successful response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const newSurvey = {
      surveyID: uuid(),
      surveyTitle: survey.surveyTitle,
      surveyDesc: survey.surveyDesc,
      community: "Melbourne",
      communityType: "STATE",
      uniqueCommunity: "Melbourne#STATE",
      expireDate: survey.expireDate,
      status: "ACTIVE",
      questions: survey.questions.map((question) => ({
        questionId: uuid(),
        questionTitle: question.questionTitle,
        questionType: question.questionType,
        answers: question.answers.map((answer) => ({
          answerId: uuid(),
          answer: answer.answer,
          count: 0,
        })),
      })),
      createdAt: new Date().toISOString(),
      userID: "yeson19223@rolenot.com",
    };

    const surveyServiceCreateSurveyMock =
      SurveyService.createSurvey as jest.Mock;

    surveyServiceCreateSurveyMock.mockResolvedValue(newSurvey);

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "yeson19223@rolenot.com",
        },
        body: survey,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.CREATED);
    expect(surveyServiceCreateSurveyMock).toHaveBeenCalled();
  });

  it("Verifies error response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const error = new Error("Failed to create survey");

    // Mock the createSurveyByAdmin function to throw an error
    const surveyServiceCreateSurveyMock =
      SurveyService.createSurvey as jest.Mock;

    surveyServiceCreateSurveyMock.mockRejectedValue(error);

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "yeson19223@rolenot.com",
        },
        body: survey,
      }),
      context,
      {} as any
    );

    const responseBody = JSON.parse(reqBody.body);

    expect(reqBody.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(responseBody.error).toEqual(undefined);
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
