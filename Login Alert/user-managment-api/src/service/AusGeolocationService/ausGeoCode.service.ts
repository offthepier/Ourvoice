import { GetItemOutput } from "@aws-sdk/client-dynamodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import AusGeoCode from "../../models/AusGeoCode";

class AusGeoCodeService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  //Map DynamoDB table column names
  mapAttributes = (item: GetItemOutput): AusGeoCode => {
    return {
      postcode: item["Postcode"],
      suburb: item["Suburb"],
      federalElectorate: item?.["Federal Electorate"],
      stateElectorate: item?.["State Electorate"],
      localElectorate: item?.["Local Government Area (Council)"],
    };
  };

  //Get AusGeoCode by keys
  async getByKeys(data: AusGeoCode): Promise<AusGeoCode> {
    console.log("Service called : " + data.suburb);
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: {
          Suburb: data.suburb.toUpperCase(),
          Postcode: data.postcode,
        },
      })
      .promise();

    console.log(result.Item);

    return result.Item ? this.mapAttributes(result.Item) : null;
  }
}

export default AusGeoCodeService;
