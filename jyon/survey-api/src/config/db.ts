import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { AWS_REGION, AWS_DB_ENDPOINT } from "./common";

const createDynamoDBClient = (): DocumentClient => {
  return new AWS.DynamoDB.DocumentClient({ region: AWS_REGION, endpoint: AWS_DB_ENDPOINT });
};

export default createDynamoDBClient;
