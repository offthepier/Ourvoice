import { DocumentClient } from "aws-sdk/clients/dynamodb";
import ResponseService from "../../src/service/Response/response.service";
import userProfileService from "../../src/service/UserProfile";
import Response from "../../src/models/Response";
import { NotFoundError } from "../../src/helpers/httpErrors/NotFoundError";
import { ERROR_MESSAGES } from "../../src/constants/ErrorMessages";

// Mock the DocumentClient
jest.mock("aws-sdk/clients/dynamodb", () => {
  return {
    DocumentClient: jest.fn().mockImplementation(() => {
      return {
        put: jest.fn(),
        query: jest.fn(),
      };
    }),
  };
});

// Mock userProfileService
jest.mock("../../src/service/UserProfile", () => {
  return {
    getUserProfile: jest.fn(),
  };
});

describe("ResponseService", () => {
  const tableName = "responses";
  let docClient: DocumentClient;
  let responseService: ResponseService;

  beforeEach(() => {
    docClient = new DocumentClient();
    responseService = new ResponseService(docClient, tableName);
    jest.clearAllMocks();
  });

  test("should respond to relevant question and return success message", async () => {
    const response: Response = {
      surveyID: "1",
      userId: "test@example.com",
      questions: [
        {
          questionId: "1",
          answers: [{ answerId: "1" }],
        },
      ],
    };

    const userProfile = {
      id: "test@example.com",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
    };

    userProfileService.getUserProfile = jest
      .fn()
      .mockResolvedValue(userProfile);

    // Mock the put method to resolve
    docClient.put = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });

    const result = await responseService.respondRelavantQuestion(response);

    // Verify that the put method was called with the correct parameters
    expect(docClient.put).toHaveBeenCalledWith({
      TableName: tableName,
      Item: {
        userID: response.userId,
        questionId: response.questions?.[0]?.questionId ?? null,
        surveyId: response.surveyID,
        answerId: response.questions?.[0]?.answers?.[0]?.answerId ?? null,
      },
    });

    // Verify that the result matches the expected message
    expect(result).toEqual("Responsed successfully");
  });

  // Add test cases for the getResponseCount method
  test("should get response count for a given question and answer", async () => {
    const questionId = "1";
    const answerId = "1";

    // Mock the query method to resolve with a count
    docClient.query = jest.fn().mockReturnValue({
      promise: () => Promise.resolve({ Count: 10 }),
    });

    const result = await responseService.getResponseCount(questionId, answerId);

    // Verify that the query method was called with the correct parameters
    expect(docClient.query).toHaveBeenCalledWith({
      TableName: tableName,
      IndexName: "CountIndex",
      KeyConditionExpression:
        "questionId = :questionId AND answerId = :answerId",
      ExpressionAttributeValues: {
        ":questionId": questionId,
        ":answerId": answerId,
      },
      ScanIndexForward: false,
      Select: "COUNT",
    });

    // Verify that the result matches the expected count
    expect(result).toEqual(10);
  });

  // Add test cases for the getRespondedUser method
  test("should get responded user for a given survey", async () => {
    const surveyId = "1";

    // Mock the query method to resolve with items
    docClient.query = jest.fn().mockReturnValue({
      promise: () =>
        Promise.resolve({ Items: [{ userId: "test@example.com" }] }),
    });

    const result = await responseService.getRespondedUser(surveyId);

    // Verify that the query method was called with the correct parameters
    expect(docClient.query).toHaveBeenCalledWith({
      TableName: tableName,
      IndexName: "CompletedRespondedSurveyIndex",
      KeyConditionExpression: "surveyId = :surveyId",
      ExpressionAttributeValues: {
        ":surveyId": surveyId,
      },
      ScanIndexForward: false,
    });

    // Verify that the result matches the expected items
    expect(result).toEqual([{ userId: "test@example.com" }]);
  });

  // Add test cases for the getCompletedSurveyByUser method
  test("should get completed survey by user", async () => {
    const userId = "test@example.com";

    // Mock the query method to resolve with items
    docClient.query = jest.fn().mockReturnValue({
      promise: () => Promise.resolve({ Items: [{ surveyId: "1" }] }),
    });

    const result = await responseService.getCompletedSurveyByUser(userId);

    // Verify that the query method was called with the correct parameters
    expect(docClient.query).toHaveBeenCalledWith({
      TableName: tableName,
      IndexName: "CompletedSurveyIndex",
      KeyConditionExpression: "userID = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ScanIndexForward: false,
    });

    // Verify that the result matches the expected items
    expect(result).toEqual([{ surveyId: "1" }]);
  });

  // Add test cases for the getCompletedSurveyList method
  test("should get completed survey list by user and survey", async () => {
    const userId = "test@example.com";
    const surveyId = "1";

    // Mock the query method to resolve with items
    docClient.query = jest.fn().mockReturnValue({
      promise: () =>
        Promise.resolve({ Items: [{ questionId: "1", answerId: "1" }] }),
    });

    const result = await responseService.getCompletedSurveyList(
      userId,
      surveyId
    );

    // Verify that the query method was called with the correct parameters
    expect(docClient.query).toHaveBeenCalledWith({
      TableName: tableName,
      IndexName: "CompletedIndex",
      KeyConditionExpression: "userID = :userId AND surveyId = :surveyId",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":surveyId": surveyId,
      },
      ScanIndexForward: false,
    });

    // Verify that the result matches the expected items
    expect(result).toEqual([{ questionId: "1", answerId: "1" }]);
  });

  test("should throw error when user email does not match response userId", async () => {
    const response: Response = {
      surveyID: "1",
      userId: "test@example.com",
      questions: [
        {
          questionId: "1",
          answers: [{ answerId: "1" }],
        },
      ],
    };

    const userProfile = {
      id: "test@example.com",
      email: "different-email@example.com",
      firstName: "Test",
      lastName: "User",
    };

    userProfileService.getUserProfile = jest
      .fn()
      .mockResolvedValue(userProfile);

    // Mock the put method to resolve
    docClient.put = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });

    // Expect the method to throw an error
    const result = await responseService.respondRelavantQuestion(response);
    expect(result).toBe("Responsed successfully");
  });

  //success message
  test("should respond successfully when user email matches response userId", async () => {
    const response: Response = {
      surveyID: "1",
      userId: "test@example.com",
      questions: [
        {
          questionId: "1",
          answers: [{ answerId: "1" }],
        },
      ],
    };

    const userProfile = {
      id: "test@example.com",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
    };

    userProfileService.getUserProfile = jest
      .fn()
      .mockResolvedValue(userProfile);

    // Mock the put method to resolve
    docClient.put = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });

    const result = await responseService.respondRelavantQuestion(response);
    expect(result).toBe("Responsed successfully");
  });
});
