import { GetItemOutput } from "@aws-sdk/client-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";
import Challenge from "src/models/Challenge";
import followersService from "../FollowersService";

class ChallengeService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  //Map DynamoDB table column names
  mapAttributes = (item: GetItemOutput): Challenge => {
    return {
      challengeID: item?.["pk"],
      title: item?.["title"],
      community: item?.["community"],
    };
  };

  //Map DynamoDB table column names
  mapTopChallengesAttributes = async (
    item: GetItemOutput,
    userId: string
  ): Promise<Challenge> => {
    return {
      challengeID: item?.["pk"],
      title: item?.["title"],
      community: item?.["community"],
      followStatus: await followersService.getChallengeFollowStatus(
        userId,
        item?.["pk"]
      ),
    };
  };

  async createChallenge(challenge: Challenge): Promise<any> {
    const id = uuid();
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: {
          pk: id,
          title: challenge.title,
          community: challenge.community,
          postsCount: 0,
          challengeStatus: "ACTIVE",
        },
      })
      .promise();

    return challenge;
  }

  async getChallenges(): Promise<Challenge[]> {
    const posts = await this.docClient
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return posts.Items.map((e) => {
      return this.mapAttributes(e);
    });
  }

  async getTopChallenges(limit: number, userId: string): Promise<Challenge[]> {
    const data = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "PostCountIndex",
        Limit: limit,
        KeyConditionExpression: "challengeStatus = :pk",
        ExpressionAttributeValues: {
          ":pk": "ACTIVE",
        },
        ScanIndexForward: false,
      })
      .promise();
    const challenges = data.Items.map(async (e) => {
      return await this.mapTopChallengesAttributes(e, userId);
    });

    return await Promise.all(challenges);
  }

  async updatePostsCount(challengeID: string): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        pk: challengeID,
      },
      UpdateExpression: "ADD #MyVariable :y",
      ExpressionAttributeNames: {
        "#MyVariable": "postsCount",
      },
      ExpressionAttributeValues: {
        ":y": 1,
      },
    };

    const data = await this.docClient.update(params).promise();
    if (data) return "Posts Count updated in challenge";
    else return "Error updating posts count in challenge";
  }
}

export default ChallengeService;
