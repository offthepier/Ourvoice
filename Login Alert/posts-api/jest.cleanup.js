import { DocumentClient } from "aws-sdk/clients/dynamodb";
import createDynamoDBClient from "./src/config/db";

const { TestGeneralPostSample } = require("./tests/utils/SamplePost");

export const teardown = async () => {
  console.log("--- Cleaning Up Test Environment ---");

  const docClient = createDynamoDBClient();

  //Table names
  const postTableName = process.env.POSTS_TABLE || "Posts";
  const commentTableName = process.env.COMMENTS_TABLE || "Comments";
  const challengesTableName = process.env.CHALLENGES_TABLE || "Challenges";

  //Delete Test Post
  await docClient
    .delete({
      TableName: postTableName,
      Key: {
        pk: `USER#${TestGeneralPostSample.userId}`,
        sk: `POST#98fa966c-3bf4-4fc4-9ecd-39c5c0994f26d}`,
      },
    })
    .promise();

  //Delete Test comment
  await docClient
    .delete({
      TableName: commentTableName,
      Key: {
        postID: TestGeneralPostSample.userId,
        commentID: `98fa966c-3bf4-4fc4-9ecd-39c5c0994fc2`,
      },
    })
    .promise();

  //Delete Test Challenge
  await docClient
    .delete({
      TableName: challengesTableName,
      Key: {
        pk: TestGeneralPostSample.challengeID,
      },
    })
    .promise();
};

module.exports = teardown;
