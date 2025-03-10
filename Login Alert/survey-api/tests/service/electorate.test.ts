import { DocumentClient } from "aws-sdk/clients/dynamodb";
import SurveyService from "../../src/service/Survey/survey.service";

describe("SurveyService", () => {
  const docClient = new DocumentClient();
  const tableName = "Survey";
  const surveyService = new SurveyService(docClient, tableName);

  it("should return a combined list of surveys for all electorates", async () => {
    const localElectorate = "localElectorate";
    const stateElectorate = "stateElectorate";
    const federalElectorate = "federalElectorate";
    const limit = 3;

    const localSurveys = {
      surveys: [{ surveyID: "local1", createdAt: "2023-01-02T00:00:00Z" }],
    };
    const stateSurveys = {
      surveys: [{ surveyID: "state1", createdAt: "2023-01-01T00:00:00Z" }],
    };
    const federalSurveys = {
      surveys: [{ surveyID: "federal1", createdAt: "2023-01-03T00:00:00Z" }],
    };

    surveyService.getMPSurveyByElectorate = jest
      .fn()
      .mockImplementation(async (electorate, limit) => {
        if (electorate.startsWith(localElectorate.toLowerCase())) {
          return localSurveys;
        } else if (electorate.startsWith(stateElectorate.toLowerCase())) {
          return stateSurveys;
        } else if (electorate.startsWith(federalElectorate.toLowerCase())) {
          return federalSurveys;
        }
      });

    const result = await surveyService.getMPSurveysByAllElectorates(
      localElectorate,
      stateElectorate,
      federalElectorate,
      limit
    );

    expect(result.surveys.length).toEqual(3);
    expect(result.count).toEqual(3);
    expect(result.surveys[0].surveyID).toEqual("federal1");
    expect(result.surveys[1].surveyID).toEqual("local1");
    expect(result.surveys[2].surveyID).toEqual("state1");
  });
});
