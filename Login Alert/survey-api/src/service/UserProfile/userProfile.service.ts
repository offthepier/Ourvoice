import { DocumentClient } from "aws-sdk/clients/dynamodb";
import User from "../../models/User";
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

  //electorate based users

  async getUsersByElectorate(
    capitalizedCommunity: string,
    communityType: string
  ): Promise<User[]> {
    const indexNameMapping = {
      FEDERAL: "FederalElectorateIndex",
      LOCAL: "LocalElectorateIndex",
      STATE: "StateElectorateIndex",
    };

    const indexName = indexNameMapping[communityType.toUpperCase()];
    const attributeKey = `${communityType.toLowerCase()}Electorate`;

    const params = {
      TableName: process.env.USER_TABLE || "User",
      IndexName: indexName,
      KeyConditionExpression: `#${attributeKey} = :community AND #role = :role`,
      ExpressionAttributeNames: {
        [`#${attributeKey}`]: attributeKey,
        "#role": "role",
      },
      ExpressionAttributeValues: {
        ":community": capitalizedCommunity,
        ":role": "CITIZEN",
      },
    };

    console.log(params);

    try {
      const result = await this.docClient.query(params).promise();
      return result.Items as User[];
    } catch (error) {
      console.error("Error fetching users by electorate:", error);
      throw error;
    }
  }

  //all the citizens
  async getAllCitizens(): Promise<User[]> {
    const params = {
      TableName: process.env.USER_TABLE || "User",
      IndexName: "RoleIndex",
      KeyConditionExpression: `#role = :role`,
      ExpressionAttributeNames: {
        "#role": "role",
      },
      ExpressionAttributeValues: {
        ":role": "CITIZEN",
      },
    };

    try {
      const result = await this.docClient.query(params).promise();
      return result.Items as User[];
    } catch (error) {
      console.error("Error fetching users by electorate:", error);
      throw error;
    }
  }
}

export default UserProfileService;
