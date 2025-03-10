import { handler } from "../../../src/functions/question/removeQuestionFunction";
import QuestionService from "../../../src/service/question";
import { generateEvent } from "../../utils/eventGenerator";

jest.mock("../../../src/service/question");

describe("Remove question from survey", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should remove question and return the updated survey", async () => {
    const mockQuestionService = QuestionService as jest.Mocked<
      typeof QuestionService
    >;
    const expectedResult = { success: true };
    mockQuestionService.removeQuestion.mockResolvedValue(expectedResult);
    const context = {
      getRemainingTimeInMillis: () => 6000,
    } as any;
    const response = await handler(
      generateEvent({
        claims: {
          email: "abc.004@gmail.com",
        },
        body: JSON.stringify({ surveyID: "1", questionIndex: 1 }),
      }),
      context,
      {} as any
    );

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(JSON.stringify(expectedResult));
  });

  it("should return a 400 error if an exception occurs", async () => {
    const mockQuestionService = QuestionService as jest.Mocked<
      typeof QuestionService
    >;
    mockQuestionService.removeQuestion.mockRejectedValue(
      new Error("Error occurred")
    );

    const context = {
      getRemainingTimeInMillis: () => 6000,
    } as any;
    const response = await handler(
      generateEvent({
        claims: {
          email: "abc.004@gmail.com",
        },
        body: JSON.stringify({ surveyID: "1", questionIndex: 1 }),
      }),
      context,
      {} as any
    );

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(JSON.stringify(new Error("Error occurred")));
  });
});
