import { DocumentClient } from "aws-sdk/clients/dynamodb";
import User from "src/models/User";

class PostSignupSaveUser {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  async createUser(user: User): Promise<User> {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: user,
      })
      .promise();

    return user;
  }
}

export default PostSignupSaveUser;
