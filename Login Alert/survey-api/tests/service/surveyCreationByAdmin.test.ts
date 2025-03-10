import { DocumentClient } from "aws-sdk/clients/dynamodb";
import AdminService from "../../src/service/AdminService";
import SurveyService from "../../src/service/Survey/survey.service";
import Survey from "../../src/models/Survey";
import { NotFoundError } from "../../src/helpers/httpErrors/NotFoundError";
import { ERROR_MESSAGES } from "../../src/constants/ErrorMessages";
import COMMUNITY_TYPES from "../../src/constants/CommunityTypes";

jest.mock("../../src/service/AdminService");

const mockDocClient = {
  put: jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue({}) }),
};

const surveyService = new SurveyService(
  mockDocClient as unknown as DocumentClient,
  "testTableName"
);

describe("SurveyService", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("createSurveyByAdmin", () => {
    const validSurvey: Survey = {
      surveyID: "test-survey-id",
      surveyTitle: "Test Survey",
      surveyDesc: "Test survey description",
      community: "test-community",
      uniqueCommunity: "test-community#type",
      userId: "test-user-id",
      expireDate: new Date(new Date().getTime() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      status: "active",
      questions: [
        {
          questionId: "1",
          questionTitle: "Question 1",
          questionType: "multiple-choice",
          answers: [
            { answer: "Answer 1", answerId: "1", count: 0 },
            { answer: "Answer 2", answerId: "2" },
          ],
        },
      ],
    };

    it("should successfully create a survey", async () => {
      (AdminService.getAdminByEmail as jest.Mock).mockResolvedValue({
        electorateName: "test-community",
        electorateType: "type",
      });

      const result = await surveyService.createSurveyByAdmin(validSurvey);
      expect(result).toEqual(validSurvey);
      expect(AdminService.getAdminByEmail).toHaveBeenCalledWith(
        validSurvey.userId
      );
      expect(mockDocClient.put).toHaveBeenCalled();
    });

    it("should throw NotFoundError if the user is not a valid Admin", async () => {
      (AdminService.getAdminByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        surveyService.createSurveyByAdmin(validSurvey)
      ).rejects.toThrow(NotFoundError);
      expect(AdminService.getAdminByEmail).toHaveBeenCalledWith(
        validSurvey.userId
      );
      expect(mockDocClient.put).not.toHaveBeenCalled();
    });

    it("should throw Error if the expiration date is in the past", async () => {
      const surveyWithPastExpireDate = {
        ...validSurvey,
        expireDate: new Date(new Date().getTime() - 86400000).toISOString(),
      };

      await expect(
        surveyService.createSurveyByAdmin(surveyWithPastExpireDate)
      ).rejects.toThrow("Invalid MP Id");
      expect(AdminService.getAdminByEmail).toHaveBeenCalledWith(
        validSurvey.userId
      );
      expect(mockDocClient.put).not.toHaveBeenCalled();
    });
  });
});
