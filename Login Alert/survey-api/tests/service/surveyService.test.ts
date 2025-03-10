import { DocumentClient } from "aws-sdk/clients/dynamodb";
import SurveyService from "../../src/service/Survey/survey.service";

describe("SurveyService", () => {
  const docClient = new DocumentClient();
  const tableName = "Surveys";
  const surveyService = new SurveyService(docClient, tableName);

  it("should return a list of completed surveys", async () => {
    const surveyArray = [
      {
        surveyID: "survey1",
        surveyTitle: "Survey 1",
        surveyDesc: "Survey 1 description",
        community: "Melbourne",
        userId: "user1@example.com",
        expireDate: "10/12/2023",
        createdAt: new Date().toISOString(),
        status: "ACTIVE",
        questions: [
          {
            questionId: "question1",
            questionTitle: "What is the type of food",
            questionType: "MC",
            answers: [
              {
                answerId: "answer1",
                answer: "one",
              },
              {
                answerId: "answer2",
                answer: "two",
              },
            ],
          },
        ],
      },
    ];

    const responseArray = [
      {
        questionId: "question1",
        surveyId: "survey1",
        answerId: "answer1",
      },
    ];

    const result = await surveyService.completedSurveyList(
      surveyArray,
      responseArray
    );

    expect(result.surveys.length).toEqual(1);
  });
});
