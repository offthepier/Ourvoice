import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { StatusCodes } from "http-status-codes";
import { POINTS, SCORE_TYPES } from "src/constants/scoreTypes";
import formatJSONResponse from "src/core/formatJsonResponse";
import ISCORETYPE from "src/models/Reptition";
import User from "src/models/User";
class RepetitionScoreService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  async getUserProfile(email: string): Promise<User> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { email },
      })
      .promise();

    return result.Item as User;
  }

  async getUserProfileScore(email: string): Promise<ISCORETYPE> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { email },
        ProjectionExpression: "score",
      })
      .promise();

    return result.Item as ISCORETYPE;
  }

  async getUpdatedScore({
    userEmail,
    type,
  }: {
    userEmail: string;
    type: ISCORETYPE;
  }): Promise<ISCORETYPE> {
    const { email } = await this.getUserProfile(userEmail);
    if (!email) {
      return formatJSONResponse(StatusCodes.NOT_FOUND, "");
    }
    const result = await this.getUserProfile(userEmail);
    let newScore: number = result.score;
    newScore = this.scoreCal(type, newScore);
    let exp = {
      UpdateExpression: `set score =:num`,
      ExpressionAttributeValues: {
        ":num": newScore,
      },
    };
    const score = await this.docClient
      .update({
        TableName: this.tableName,
        Key: { email },
        UpdateExpression: exp.UpdateExpression,
        ExpressionAttributeValues: exp.ExpressionAttributeValues,
        ReturnValues: "UPDATED_NEW",
      })
      .promise();

    if (!score) {
      return formatJSONResponse(StatusCodes.NOT_FOUND, "Unable to find");
    }
    console.log(score.Attributes, "Camehere");
    return score.Attributes as ISCORETYPE;
  }

  private scoreCal(type: ISCORETYPE, newScore: number) {
    if (type.scoreType === SCORE_TYPES.liked) {
      newScore += POINTS.postLike;
    } else if (type.scoreType === SCORE_TYPES.proposalCreator) {
      newScore += POINTS.proposalCreator;
    } else if (type.scoreType === SCORE_TYPES.proposalVoter) {
      newScore += POINTS.propsalVoter;
    } else if (type.scoreType === SCORE_TYPES.commentLike) {
      newScore += POINTS.commentsLike;
    } else if (type.scoreType === SCORE_TYPES.ownCommentLike) {
      newScore += 0;
    } else if (type.scoreType === SCORE_TYPES.ownPostLike) {
      newScore += 0;
    } else if (type.scoreType === SCORE_TYPES.unliked) {
      newScore -= POINTS.postLike;
      newScore = newScore < 0 ? 0 : newScore;
    }
    return newScore;
  }
}

export default RepetitionScoreService;
