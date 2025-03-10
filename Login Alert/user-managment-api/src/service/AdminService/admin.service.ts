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
      firstName: "",
      lastName: "",
    };
  };

  async createAdmin(admin: IAdmin): Promise<IAdmin> {
    const { email } = admin;
    const trimmedEmail = email.trim();

    const newAdmin = {
      ...admin,
      email: trimmedEmail, // use the trimmed email value
    };

    await this.docClient
      .put({
        TableName: this.tableName,
        Item: newAdmin,
      })
      .promise();

    return admin;
  }

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
