import { DocumentClient } from "aws-sdk/clients/dynamodb";
import User from "../../models/User";
import userProfileService from "../UserProfile";
class ImageSaveService {
  constructor(
    private readonly docClient: DocumentClient,
    private readonly tableName: string
  ) {}

  async updateUserProfile(
    userEmail: string,
    imageUrl: string,
    imageFullUrl: string
  ): Promise<User> {
    const { email } = await userProfileService.getUserProfile(userEmail);

    let exp = {
      UpdateExpression: "set imageUrl = :r, imageFullUrl = :imgFull",
      ExpressionAttributeValues: { ":r": imageUrl, ":imgFull": imageFullUrl },
    };

    const updatedImage = await this.docClient
      .update({
        TableName: this.tableName,
        Key: { email },
        UpdateExpression: exp.UpdateExpression,
        ExpressionAttributeValues: exp.ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return updatedImage.Attributes as User;
  }

  async getUserProfilePic(email: string): Promise<User> {
    const result = await this.docClient
      .get({
        TableName: this.tableName,
        Key: { email },
        ProjectionExpression: "firstName,lastName,imageUrl,imageFullUrl",
      })
      .promise();

    return result.Item as User;
  }
}

export default ImageSaveService;
