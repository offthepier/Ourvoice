import { handler } from "../src/functions/imageUploadController";
import { generateEvent } from "./utils/eventGenerator";
import createDynamoDBClient from "../src/config/db";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import profilePicService from "../src/service/ImageSaveService";
import * as AWS from "aws-sdk";

jest.mock("aws-sdk");

const adminUpdateUserAttributesMock = jest.fn();

(AWS.CognitoIdentityServiceProvider as unknown as jest.Mock) = jest.fn(() => ({
  adminUpdateUserAttributes: adminUpdateUserAttributesMock,
}));

jest.mock("../src/service/ImageSaveService"); // Mock the module

jest.setTimeout(30000);

describe("Test Image endpoint Endpoint", function () {
  let imageUrl =
    "https://ourvoice-assets-dev.s3.ap-southeast-2.amazonaws.com/8f26bf51-5e23-43aa-9f1d-a7824f7299cc0b4e6abc-6ab4-40a4-8802-4d38b58ef827e428407e-20da-4de4-8d4d-2af3512b615aFacetune_26-02-2023-19-25-18.WEBP";

  it("Verifies successful response", async () => {
    (profilePicService.updateUserProfile as jest.Mock).mockResolvedValue({
      id: "12345",
      email: "zekonolu@tutuapp.bid",
      imageUrl,
    });

    adminUpdateUserAttributesMock.mockResolvedValue({});

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          sub: "12345",
          email: "zekonolu@tutuapp.bid",
        },
        body: {
          imageUrl: imageUrl,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(404);
    expect(JSON.parse(result.body)).toEqual({});
  });

  it("Verifies NOT_FOUND response when userProfile is not found", async () => {
    (profilePicService.updateUserProfile as jest.Mock).mockResolvedValue(null);
    adminUpdateUserAttributesMock.mockResolvedValue({});

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          sub: "12345",
          email: "zekonolu@tutuapp.bid",
        },
        body: {
          imageUrl: imageUrl,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(404);
    expect(JSON.parse(result.body)).toEqual({});
  });

  it("Verifies NOT_FOUND response when there is an error", async () => {
    (profilePicService.updateUserProfile as jest.Mock).mockRejectedValue(
      new Error("Error updating user profile")
    );
    adminUpdateUserAttributesMock.mockResolvedValue({});

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          sub: "12345",
          email: "zekonolu@tutuapp.bid",
        },
        body: {
          imageUrl: imageUrl,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(404);
    expect(JSON.parse(result.body)).toEqual({});
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
