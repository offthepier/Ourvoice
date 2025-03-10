import AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import ImageSaveService from "../../src/service/ImageSaveService/imageSave.service";
import User from "../../src/models/User";
import userProfileService from "../../src/service/UserProfile";

const mockUpdate = jest.fn();

jest.mock("aws-sdk", () => {
  const originalDynamoDB = jest.requireActual("aws-sdk/clients/dynamodb");

  return {
    DynamoDB: {
      DocumentClient: jest.fn((options) => {
        return new originalDynamoDB.DocumentClient({ ...options });
      }),
    },
    config: {
      update: jest.fn(),
      region: "ap-southeast-2",
    },
  };
});

jest.mock("../../src/service/UserProfile");

const mockGetUserProfile = jest.fn();
(userProfileService.getUserProfile as jest.Mock).mockImplementation(
  mockGetUserProfile
);

const docClient = new DocumentClient({ region: "ap-southeast-2" });
const docClientUpdateSpy = jest.spyOn(docClient, "update");

describe("ImageSaveService", () => {
  const tableName = "User";
  const userEmail = "zekonolu@tutuapp.bid";
  const imageUrl = "https://randomuser.me/api/portraits/men/30.jpg";
  const imageFullUrl = "https://randomuser.me/api/portraits/men/30.jpg";

  beforeEach(() => {
    AWS.config.update({ region: AWS.config.region });
    jest.clearAllMocks();
  });
  it("should update the user profile image URL", async () => {
    const imageSaveService = new ImageSaveService(docClient, tableName);

    const mockUser: User = {
      id: "467ad15b-5381-47e9-a469-9932f657fa98",
      firstName: "jenny",
      email: userEmail,
      geoLocation: {
        country: "Australia",
        postCode: "0850",
        suburb: "COSSACK",
      },
      electorate: {
        federalElectorate: "Lingiari",
        localElectorate: "Katherine",
        stateElectorate: "Katherine",
      },
      imageUrl: imageUrl,
      imageFullUrl: imageUrl,
      gender: "",
      searchVisibility: "PUBLIC",
      searchableName: "jenny anderson",
      verificationStatus: "INCOMPLETE",
      role: "CITIZEN",
      score: 2,
      intro: "",
      lastName: "anderson",
      dob: "",
      street: "",
      phoneNumber: "",
      interests: [],
    };

    mockGetUserProfile.mockResolvedValueOnce({ email: userEmail });
    mockUpdate.mockResolvedValueOnce({ Attributes: mockUser });

    const updatedUser = await imageSaveService.updateUserProfile(
      userEmail,
      imageUrl,
      imageFullUrl
    );

    expect(userProfileService.getUserProfile).toHaveBeenCalledWith(userEmail);
    expect(docClientUpdateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: tableName,
        Key: { email: userEmail },
        UpdateExpression: "set imageUrl = :r, imageFullUrl = :imgFull",
        ExpressionAttributeValues: {
          ":r": imageUrl,
          ":imgFull": imageFullUrl,
        },
        ReturnValues: "ALL_NEW",
      })
    );
    expect(updatedUser).toEqual(mockUser);
  });
});
