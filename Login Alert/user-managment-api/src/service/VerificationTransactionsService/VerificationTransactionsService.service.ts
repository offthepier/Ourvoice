import { DocumentClient, GetItemOutput } from "aws-sdk/clients/dynamodb";
import UserVerification from "src/models/UserVerfication";
class VerificationTransactionsService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  //Map DynamoDB table column names
  mapAttributes = (item: GetItemOutput): UserVerification => {
    return {
      email: item["email"],
      transactionId: item["transactionId"],
    };
  };

  async createVerificationTransaction(
    uv: UserVerification
  ): Promise<UserVerification> {
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: uv,
      })
      .promise();

    return uv;
  }

  async getVerificationTransactionByEmail(
    email: string
  ): Promise<UserVerification> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: {
          email,
        },
      })
      .promise();

    console.log(result.Item);

    return result.Item ? this.mapAttributes(result.Item) : null;
  }
}

export default VerificationTransactionsService;
