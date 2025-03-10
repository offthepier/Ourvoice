import { DocumentClient } from "aws-sdk/clients/dynamodb";
import AdminService from "../../src/service/AdminService/admin.service";
import IAdmin from "../../src/models/Admin";

describe("AdminService", () => {
  const mockDocClient = new DocumentClient();
  const tableName = "admin";

  const adminService = new AdminService(mockDocClient, tableName);

  const mockAdmin: IAdmin = {
    email: "test@example.com",
    id: "123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAdminByEmail", () => {
    it("should return an admin when a valid email is provided", async () => {
      // Mock the DocumentClient's get method to return the mockAdmin object
      mockDocClient.get = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: mockAdmin }),
      });

      const result = await adminService.getAdminByEmail(mockAdmin.email);

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

      const result = await adminService.getAdminByEmail(
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
