import { DocumentClient, GetItemOutput } from "aws-sdk/clients/dynamodb";
import IAdmin from "src/models/Admin";

class AdminService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  //Map DynamoDB table column names
  mapAttributes = (item: GetItemOutput): IAdmin => {
    return {
      email: item["email"],
      id: item["id"],
      firstName: item["firstName"],
      lastName: item["lastName"],
    };
  };

  async getAdminByEmail(email: string): Promise<IAdmin> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: {
          email,
        },
      })
      .promise();

    return result.Item ? this.mapAttributes(result.Item) : null;
  }
}

export default AdminService;
