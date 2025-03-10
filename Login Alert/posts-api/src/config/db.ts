import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { AWS_REGION } from "./common";

const createDynamoDBClient = (): DocumentClient => {
  return new AWS.DynamoDB.DocumentClient({ region: AWS_REGION });
};

export default createDynamoDBClient;
