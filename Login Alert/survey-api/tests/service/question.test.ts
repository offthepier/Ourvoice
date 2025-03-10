// __tests__/QuestionService.test.ts

import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Survey from "../../src/models/Survey";
import QuestionService, {
  IQuestion,
} from "../../src/service/question/question.service";
import formatJSONResponse from "../../src/core/formatJsonResponse";
import { StatusCodes } from "http-status-codes";

const mockUpdate = jest.fn();

jest.mock("aws-sdk/clients/dynamodb", () => {
  return {
    DocumentClient: jest.fn(() => ({
      update: (params) => ({
        promise: () => mockUpdate(params),
      }),
    })),
  };
});

describe("QuestionService remove question", () => {
  const docClient = new DocumentClient();
  const tableName = "test-table";
  const questionService = new QuestionService(docClient, tableName);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should remove a question from a survey", async () => {
    const question: IQuestion = {
      surveyID: "survey1",
      userID: "user1",
      questionIndex: 1,
    };

    const updatedSurvey: Survey = {
      userId: "user1",
      surveyID: "survey1",
      questions: [
        {
          questionId: "q1",
          questionTitle: "hello",
          questionType: "MC",
          answers: [],
        },
        {
          questionId: "q2",
          questionTitle: "hello",
          questionType: "MC",
          answers: [],
        },
      ],
    };

    mockUpdate.mockResolvedValueOnce({ Attributes: updatedSurvey });

    const result = await questionService.removeQuestion(question);

    expect(mockUpdate).toHaveBeenCalledWith({
      TableName: tableName,
      Key: {
        userID: question.userID,
        surveyID: question.surveyID,
      },
      UpdateExpression: `REMOVE question[${question.questionIndex}]`,
      ReturnValues: "ALL_NEW",
    });

    expect(result).toEqual(updatedSurvey);
  });

  it("should return a NOT_FOUND response if the question is not removed", async () => {
    const question: IQuestion = {
      surveyID: "survey1",
      userID: "user1",
      questionIndex: 1,
    };

    mockUpdate.mockResolvedValueOnce(null); // Simulate a null response

    try {
      await questionService.removeQuestion(question);
    } catch (error) {
      expect(mockUpdate).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          userID: question.userID,
          surveyID: question.surveyID,
        },
        UpdateExpression: `REMOVE question[${question.questionIndex}]`,
        ReturnValues: "ALL_NEW",
      });

      // Verify the error message and status code
      expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(error.message).toBe("Unable to find");
    }
  });
});
