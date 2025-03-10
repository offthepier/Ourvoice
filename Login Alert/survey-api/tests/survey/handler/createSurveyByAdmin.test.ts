import { handler } from "../../../src/functions/adminSurvey/createSurveyByAdminFunction";
import { StatusCodes } from "http-status-codes";
import { generateEvent } from "../../utils/eventGenerator";
import { v4 as uuid } from "uuid";
import COMMUNITY_TYPES from "../../../src/constants/CommunityTypes";
import SurveyService from "../../../src/service/Survey";

jest.setTimeout(30000);

jest.mock("../../../src/service/Survey");

describe("Create survey by Admin", function () {
  const survey = {
    surveyTitle: "Admin Survey 2022",
    surveyDesc: "Admin  Survey 2022",
    expireDate: "10/12/2023",
    userId: "krishnamohanramachandran789@gmail.com",
    status: "ACTIVE",
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
    (SurveyService.createSurveyByAdmin as jest.Mock).mockClear();
  });

  it("Verifies successful response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const newSurvey = {
      surveyID: uuid(),
      community: COMMUNITY_TYPES.ALL.toLowerCase(),
      communityType: COMMUNITY_TYPES.ALL,
      uniqueCommunity: `${COMMUNITY_TYPES.ALL.toLowerCase()}#${
        COMMUNITY_TYPES.ALL
      }`,
      surveyTitle: survey.surveyTitle,
      surveyDesc: survey.surveyDesc,
      userID: survey.userId,
      expireDate: survey.expireDate,
      createdAt: new Date().toISOString(),
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
      status: survey.status,
    };

    (SurveyService.createSurveyByAdmin as jest.Mock).mockImplementation(() =>
      Promise.resolve(newSurvey)
    );

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "krishnamohanramachandran789@gmail.com",
        },
        body: survey,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.CREATED);
    expect(SurveyService.createSurveyByAdmin).toHaveBeenCalled();
  });

  it("Verifies error response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const error = new Error("Failed to create survey");

    // Mock the createSurveyByAdmin function to throw an error
    (SurveyService.createSurveyByAdmin as jest.Mock).mockImplementation(() => {
      throw error;
    });

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "krishnamohanramachandran789@gmail.com",
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
