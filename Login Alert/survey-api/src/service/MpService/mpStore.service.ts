import { DocumentClient, GetItemOutput } from "aws-sdk/clients/dynamodb";
import IMP from "../../models/InvitedMp";
class MPSaveUser {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  //Map DynamoDB table column names
  mapAttributes = (item: GetItemOutput): IMP => {
    return {
      email: item["email"],
      id: item["id"],
      fullName: item["fullName"],
      electorateType: item["electorateType"],
      electorateName: item["electorateName"],
    };
  };

  async getMPInviteByEmail(email: string): Promise<IMP> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: {
          email,
        },
      })
      .promise();

    console.log(result.Item, "here");

    return result.Item ? this.mapAttributes(result.Item) : null;
  }
}

export default MPSaveUser;
