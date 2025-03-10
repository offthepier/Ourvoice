import { DocumentClient } from "aws-sdk/clients/dynamodb";
import SurveyService from "../../src/service/Survey/survey.service";

describe("SurveyService", () => {
  const docClient = new DocumentClient();
  const tableName = "Response";
  const surveyService = new SurveyService(docClient, tableName);

  it("should update the answer count successfully", async () => {
    const userID = "user1";
    const surveyID = "survey1";
    const questionId = "question1";
    const answerId = "answer1";

    const updateResponse = {
      Attributes: {
        userID: userID,
        surveyID: surveyID,
        questions: [
          {
            questionId: questionId,
            answers: [
              {
                answerId: answerId,
                count: 2,
              },
            ],
          },
        ],
      },
    };

    docClient.update = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(updateResponse),
    });

    const result = await surveyService.answerCountUpdate(
      userID,
      surveyID,
      questionId,
      answerId
    );

    expect(docClient.update).toHaveBeenCalled();
    expect(result).toEqual("Successfully Answer Count updated");
  });
});
