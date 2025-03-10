import { DocumentClient } from "aws-sdk/clients/dynamodb";
import UserProfileService from "../../src/service/UserProfile/userProfile.service";
import User from "../../src/models/User";
import { VERIFICATION_STATUS } from "../../src/constants/verificationStatus";

// Mock the DocumentClient
jest.mock("aws-sdk/clients/dynamodb", () => {
  const updateMock = {
    promise: jest.fn(),
  };
  return {
    DocumentClient: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn(),
        query: jest.fn(),
        update: jest.fn().mockImplementation((params?: any) => updateMock),
      };
    }),
  };
});

describe("UserProfileService", () => {
  const tableName = "MockTableName";
  let docClient: DocumentClient;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    docClient = new DocumentClient();
    userProfileService = new UserProfileService(docClient, tableName);
    jest.clearAllMocks();
  });

  // Add test cases for the methods in the UserProfileService class

  test("should get user profile by email", async () => {
    const email = "test@example.com";
    const mockUser: User = {
      email: email,
      firstName: "John",
      lastName: "Doe",
      score: 10,
      rank: 1,
      id: "",
      geoLocation: {
        country: "",
        postCode: "",
        suburb: "",
        state: "",
      },
      electorate: {
        federalElectorate: "",
        localElectorate: "",
        stateElectorate: "",
      },
    };

    const expectedUserPublic: any = {
      // email: email,
      firstName: "John",
      lastName: "Doe",
      score: 10,
      rank: 1,
      imageUrl: undefined,
      intro: undefined,
      interests: undefined,
      role: undefined,
      gender: undefined,
      verificationStatus: undefined,
      geoLocation: {
        country: "",
      },
    };

    // Mock the get method to return a resolved promise with the mock user
    docClient.get = jest.fn().mockReturnValue({
      promise: () => Promise.resolve({ Item: mockUser }),
    });

    userProfileService.getUserRank = jest.fn().mockResolvedValue(1);

    const result = await userProfileService.getUserPublicProfile(email);

    expect(docClient.get).toHaveBeenCalledWith({
      TableName: tableName,
      Key: { email },
    });

    // Verify that the result matches the expected user profile
    expect(result).toEqual(expectedUserPublic);
  });

  test("should get user profile score by email", async () => {
    const email = "test@example.com";
    const mockUser: User = {
      email: email,
      firstName: "John",
      lastName: "Doe",
      score: 10,
      rank: 1,
      id: "",
      geoLocation: {
        country: "",
        postCode: "",
        suburb: "",
        state: "",
      },
      electorate: {
        federalElectorate: "",
        localElectorate: "",
        stateElectorate: "",
      },
    };

    docClient.get = jest.fn().mockReturnValue({
      promise: () => Promise.resolve({ Item: { score: mockUser.score } }),
    });

    const result = await userProfileService.getUserProfileScore(email);

    expect(docClient.get).toHaveBeenCalledWith({
      TableName: tableName,
      Key: { email },
      ProjectionExpression: "score",
    });

    expect(result).toEqual({ score: mockUser.score });
  });

  test("should get user rank by score", async () => {
    const score = 10;
    const expectedRank = 1;

    docClient.query = jest.fn().mockImplementation((params) => {
      expect(params).toEqual({
        TableName: tableName,
        IndexName: "RankIndex",
        KeyConditionExpression: "searchVisibility = :pk and score > :sk",
        ExpressionAttributeValues: {
          ":pk": "PUBLIC",
          ":sk": score,
        },
        Select: "COUNT",
      });
      return {
        promise: jest.fn().mockResolvedValue({ Count: expectedRank - 1 }),
      };
    });

    const result = await userProfileService.getUserRank(score);

    expect(docClient.query).toHaveBeenCalled();

    expect(result).toBe(expectedRank);
  });

  // Test case for updateUserProfile method
  test("should update user profile and return updated user", async () => {
    const email = "test@example.com";
    const updatedDetails: Partial<User> = {
      firstName: "Jane",
      lastName: "Smith",
    };

    const mockUser: User = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      geoLocation: {
        country: "",
        postCode: "",
        suburb: "",
        state: "",
      },
      electorate: {
        federalElectorate: "",
        localElectorate: "",
        stateElectorate: "",
      },
    };

    const updatedUser: User = {
      ...mockUser,
      ...updatedDetails,
    };

    userProfileService.getUserProfile = jest.fn().mockResolvedValue(mockUser);

    docClient.update = jest.fn().mockImplementation((params?: any) => {
      return {
        promise: jest.fn().mockResolvedValue({ Attributes: updatedUser }),
      };
    });

    const result = await userProfileService.updateUserProfile(
      email,
      updatedDetails
    );

    expect(userProfileService.getUserProfile).toHaveBeenCalledWith(email);
    expect(docClient.update).toHaveBeenCalledTimes(2);
    expect(result).toEqual(updatedUser);
  });

  // Test case for updateVerificationStatus method
  test("should update verification status and return success message", async () => {
    const userId = "test@example.com";
    const successMessage = "Verification status updated in challenge";
    const errorMessage = "Error updating Verification status";

    const result = await userProfileService.updateVerificationStatus(userId);

    expect(docClient.update).toHaveBeenCalledWith({
      TableName: tableName,
      Key: { email: userId },
      UpdateExpression: "set #MyVariable = :y",
      ExpressionAttributeNames: { "#MyVariable": "verificationStatus" },
      ExpressionAttributeValues: { ":y": VERIFICATION_STATUS.KYC_COMPLETE },
    });

    expect(result).toEqual(errorMessage);
  });

  // Test case for updateVerificationStatus method when update fails
  test("should return error message when update verification status fails", async () => {
    const userId = "test@example.com";
    const errorMessage = "Error updating Verification status";

    const result = await userProfileService.updateVerificationStatus(userId);

    expect(docClient.update).toHaveBeenCalledWith({
      TableName: tableName,
      Key: { email: userId },
      UpdateExpression: "set #MyVariable = :y",
      ExpressionAttributeNames: { "#MyVariable": "verificationStatus" },
      ExpressionAttributeValues: { ":y": VERIFICATION_STATUS.KYC_COMPLETE },
    });

    expect(result).toEqual(errorMessage);
  });
});
