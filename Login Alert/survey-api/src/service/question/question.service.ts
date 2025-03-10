import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Survey from "src/models/Survey";
import { StatusCodes } from "http-status-codes";
import formatJSONResponse from "src/core/formatJsonResponse";

export interface IQuestion {
  surveyID: string;
  userID: string;
  questionIndex: number;
}

class QuestionService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  // remove particular question from survey
  async removeQuestion(question: IQuestion): Promise<Survey> {
    const deleteQuestion = await this.docClient
      .update({
        TableName: this.tableName,
        Key: {
          userID: question.userID,
          surveyID: question.surveyID,
        },
        UpdateExpression: `REMOVE question[${question.questionIndex}]`,
        ReturnValues: "ALL_NEW",
      })
      .promise();

    if (!deleteQuestion) {
      return formatJSONResponse(StatusCodes.NOT_FOUND, "Unable to find");
    }

    return deleteQuestion.Attributes as Survey;
  }
}

export default QuestionService;
