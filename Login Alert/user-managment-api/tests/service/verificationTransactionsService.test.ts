import { DocumentClient } from "aws-sdk/clients/dynamodb";
import VerificationTransactionsService from "../../src/service/VerificationTransactionsService/VerificationTransactionsService.service";
import UserVerification from "../../src/models/UserVerfication";

// Mock the DocumentClient
const mockGet = jest.fn();

jest.mock("aws-sdk/clients/dynamodb", () => {
  return {
    DocumentClient: jest.fn().mockImplementation(() => {
      return {
        put: jest.fn(),
        get: jest.fn(),
      };
    }),
  };
});

describe("VerificationTransactionsService", () => {
  const tableName = "VerificationRequests";
  let docClient: DocumentClient;
  let verificationTransactionsService: VerificationTransactionsService;

  beforeEach(() => {
    docClient = new DocumentClient();
    verificationTransactionsService = new VerificationTransactionsService(
      docClient,
      tableName
    );
    jest.clearAllMocks();
  });

  test("should create a verification transaction and return the created transaction object", async () => {
    const uv: UserVerification = {
      email: "test@example.com",
      transactionId: "1234567890",
    };

    // Mock the put method to resolve
    docClient.put = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });

    const result =
      await verificationTransactionsService.createVerificationTransaction(uv);

    // Verify that the put method was called with the correct parameters
    expect(docClient.put).toHaveBeenCalledWith({
      TableName: tableName,
      Item: uv,
    });

    // Verify that the result matches the expected object
    expect(result).toEqual(uv);
  });

  it("should return null when no matching email is found", async () => {
    const email = "nonexistent@example.com";

    // Create a mock implementation of DocumentClient
    const mockDocClient = {
      get: jest.fn().mockImplementation(() => ({
        promise: jest.fn().mockResolvedValue({}),
      })),
    } as unknown as DocumentClient;

    // Initialize verificationTransactionsService with the mocked DocumentClient
    const verificationTransactionsService = new VerificationTransactionsService(
      mockDocClient,
      "dummy-table"
    );

    const result =
      await verificationTransactionsService.getVerificationTransactionByEmail(
        email
      );

    expect(result).toBeNull();
    expect(mockDocClient.get).toHaveBeenCalledTimes(1);
  });
});
