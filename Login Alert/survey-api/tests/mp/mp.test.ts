import { DocumentClient } from "aws-sdk/clients/dynamodb";
import MPServcice from "../../src/service/MpService/mpStore.service";
import InvitedMp from "../../src/models/InvitedMp";

describe("MPservice", () => {
  const mockDocClient = new DocumentClient();
  const tableName = "admin";

  const mpService = new MPServcice(mockDocClient, tableName);

  const mockAdmin: InvitedMp = {
    email: "test@example.com",
    id: "123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMPByEmail", () => {
    it("should return an mp when a valid email is provided", async () => {
      // Mock the DocumentClient's get method to return the mockAdmin object
      mockDocClient.get = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: mockAdmin }),
      });

      const result = await mpService.getMPInviteByEmail(mockAdmin.email);

      expect(mockDocClient.get).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          email: mockAdmin.email,
        },
      });

      expect(result).toEqual(mockAdmin);
    });

    it("should return null when an invalid email is provided", async () => {
      // Mock the DocumentClient's get method to return null
      mockDocClient.get = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: null }),
      });

      const result = await mpService.getMPInviteByEmail(
        "invalid-email@example.com"
      );

      expect(mockDocClient.get).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          email: "invalid-email@example.com",
        },
      });

      expect(result).toBeNull();
    });
  });
  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
