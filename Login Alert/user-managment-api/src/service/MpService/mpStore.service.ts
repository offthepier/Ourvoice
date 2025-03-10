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

  async createMPUser(mp: IMP): Promise<IMP> {
    const { email, electorateName } = mp;
    const trimmedEmail = email.trim();

    const newMp = {
      ...mp,
      email: trimmedEmail, // use the trimmed email value
      electorateName: electorateName,
    };
    await this.docClient
      .put({
        TableName: this.tableName,
        Item: newMp,
      })
      .promise();

    return mp;
  }
  async getMPInviteByEmail(email: string): Promise<IMP> {
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

  async createMPUserBulk(mps: IMP[]): Promise<string> {
    let batches = [];
    let current_batch = [];
    let item_count = 0;
    for (const mp of mps) {
      // Add the item to the current batch
      item_count++;
      current_batch.push({
        PutRequest: {
          Item: mp,
        },
      });

      // If we've added 25 items, add the current batch to the batches array
      // and reset it
      if (item_count % 25 == 0) {
        batches.push(current_batch);
        current_batch = [];
      }
    }

    // Add the last batch if it has records and is not equal to 25
    if (current_batch.length > 0 && current_batch.length != 25)
      batches.push(current_batch);

    // Handler for the database operations
    let completed_requests = 0;
    let errors = false;
    function handler(request) {
      return function (err) {
        // Increment the completed requests
        completed_requests++;

        // Set the errors flag
        errors = errors ? true : err;

        // Log the error if we got one
        if (err) {
          console.error(JSON.stringify(err, null, 2));
          console.error("Request that caused database error:");
          console.error(JSON.stringify(request, null, 2));
        }

        // Make the callback if we've completed all the requests
        if (completed_requests == batches.length) {
          console.log("Write Complete!");
        }
      };
    }

    //Write batches to db
    for (const batch of batches) {
      // Items go in params.RequestItems.id array
      // Format for the items is {PutRequest: {Item: ITEM_OBJECT}}
      const params = {
        RequestItems: {
          [this.tableName]: batch,
        },
      };

      // Perform the batchWrite operation
      await this.docClient.batchWrite(params, handler(params)).promise();

      // send Email -- Temp Can be changed later for a bulk sending option
    }

    return "MPS Created!";
  }
}

export default MPSaveUser;
