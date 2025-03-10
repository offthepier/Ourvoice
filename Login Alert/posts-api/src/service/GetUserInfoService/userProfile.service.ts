import { DocumentClient } from "aws-sdk/clients/dynamodb";
import User from "../../models/User";
import { encrypt } from "src/utils/encrypt";
class UserProfileService {
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

  async searchUser(searchParams: string): Promise<User[]> {
    const result = await this.docClient
      .query({
        TableName: this.tableName,
        IndexName: "SearchIndex",
        KeyConditionExpression:
          "searchVisibility = :pk AND begins_with(searchableName, :sk)",
        ExpressionAttributeValues: {
          ":pk": "PUBLIC",
          ":sk": searchParams.toLowerCase(),
        },
        Limit: 5,
      })
      .promise();

    return result.Items.map((e: User) => {
      return {
        firstName: e.firstName,
        lastName: e.lastName,
        id: encodeURIComponent(encrypt(e.email)),
        role: e.role,
        imageUrl: e.imageUrl,
      };
    });
  }

  async getAllUsers(
    lastEvaluatedKey: any
  ): Promise<{ users: User[]; lastEvaluatedKey: any }> {
    const users = await this.docClient
      .scan({
        TableName: this.tableName,
        ExclusiveStartKey: lastEvaluatedKey,
        Limit: 2,
      })
      .promise();
    return {
      users: users.Items as User[],
      lastEvaluatedKey: users.LastEvaluatedKey,
    };
  }
}

export default UserProfileService;
