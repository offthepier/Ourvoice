import Response from "src/models/Response";
import { NotFoundError } from "src/helpers/httpErrors/NotFoundError";
import { ERROR_MESSAGES } from "src/constants/ErrorMessages";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import userProfileService from "../UserProfile";

class ResponseService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  async respondRelavantQuestion(response: Response): Promise<string> {
    try {
      const user = await userProfileService.getUserProfile(response.userId);
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.INVALID_USER);
      }

      if (user.email != response.userId) {
        throw new NotFoundError(ERROR_MESSAGES.USER_DOESNOT_EXIST);
      }

      //iterate the request body and  store them in the db
      for (const question of response.questions) {
        for (const answer of question.answers) {
          console.log(answer);
          const params = {
            TableName: this.tableName,
            Item: {
              userID: response.userId,
              questionId: question.questionId,
              surveyId: response.surveyID,
              answerId: answer.answerId,
            },
          };
          await this.docClient.put(params).promise();
        }
      }
    } catch (error) {
      console.log(error);
    }

    return "Responsed successfully";
  }

  //get response count

  async getResponseCount(
    questionId: string,
    answerId: string
  ): Promise<number> {
    const surveys = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "CountIndex",
        KeyConditionExpression:
          "questionId = :questionId AND answerId = :answerId",
        ExpressionAttributeValues: {
          ":questionId": `${questionId}`,
          ":answerId": `${answerId}`,
        },
        ScanIndexForward: false,
        Select: "COUNT",
      })
      .promise();
    return surveys.Count;
  }

  async getRespondedCountforQuestion(questionId: string): Promise<number> {
    const responsdedCount = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "QuestionIndex",
        KeyConditionExpression: "questionId = :questionId",
        ExpressionAttributeValues: {
          ":questionId": `${questionId}`,
        },
        ScanIndexForward: false,
      })
      .promise();
    // A Set automatically removes duplicates, so it gives us the count of unique userIDs.
    const uniqueUserIDs = new Set(
      responsdedCount.Items.map((item) => item.userID)
    );
    return uniqueUserIDs.size;
  }

  //completed other user

  async getRespondedUser(surveyId: string): Promise<any> {
    const respondedSurvey = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "CompletedRespondedSurveyIndex",
        KeyConditionExpression: "surveyId = :surveyId",
        ExpressionAttributeValues: {
          ":surveyId": `${surveyId}`,
        },
        ScanIndexForward: false,
      })
      .promise();

    return respondedSurvey.Items;
  }

  async getCompletedSurveyByUser(userId: string): Promise<any> {
    const completedSurvey = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "CompletedSurveyIndex",
        KeyConditionExpression: "userID = :userId",
        ExpressionAttributeValues: {
          ":userId": `${userId}`,
        },
        ScanIndexForward: false,
      })
      .promise();

    return completedSurvey.Items;
  }

  async getCompletedSurveyList(userId: string, surveyId: string): Promise<any> {
    const completedSurvey = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "CompletedIndex",
        KeyConditionExpression: "userID = :userId AND surveyId = :surveyId",
        ExpressionAttributeValues: {
          ":userId": `${userId}`,
          ":surveyId": `${surveyId}`,
        },
        ScanIndexForward: false,
      })
      .promise();

    return completedSurvey.Items;
  }
}

export default ResponseService;
