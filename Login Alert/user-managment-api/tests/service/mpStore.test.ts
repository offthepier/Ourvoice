import { DocumentClient } from "aws-sdk/clients/dynamodb";
import MPSaveUser from "../../src/service/MpService/mpStore.service";
import IMP from "../../src/models/InvitedMp";

// Mock the DocumentClient
jest.mock("aws-sdk/clients/dynamodb", () => {
  return {
    DocumentClient: jest.fn().mockImplementation(() => {
      return {
        put: jest.fn(),
        get: jest.fn(),
        batchWrite: jest.fn(),
      };
    }),
  };
});

describe("MPSaveUser", () => {
  const tableName = "inviteMp";
  let docClient: DocumentClient;
  let mpSaveUser: MPSaveUser;

  beforeEach(() => {
    docClient = new DocumentClient();
    mpSaveUser = new MPSaveUser(docClient, tableName);
    jest.clearAllMocks();
  });

  test("should create MP user and return the created MP object", async () => {
    const mp: IMP = {
      email: "test@example.com",
      id: "1",
      fullName: "Test MP",
      electorateType: "Federal",
      electorateName: "Test Electorate",
    };

    // Mock the put method to resolve
    docClient.put = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });

    const result = await mpSaveUser.createMPUser(mp);

    // Verify that the put method was called with the correct parameters
    expect(docClient.put).toHaveBeenCalledWith({
      TableName: tableName,
      Item: mp,
    });

    // Verify that the result matches the expected object
    expect(result).toEqual(mp);
  });

  test("should get MP invite by email and return the MP object", async () => {
    const mp: IMP = {
      email: "test@example.com",
      id: "1",
      fullName: "Test MP",
      electorateType: "Federal",
      electorateName: "Test Electorate",
    };

    // Mock the get method to resolve with the MP object
    docClient.get = jest.fn().mockReturnValue({
      promise: () => Promise.resolve({ Item: mp }),
    });

    const result = await mpSaveUser.getMPInviteByEmail("test@example.com");

    // Verify that the get method was called with the correct parameters
    expect(docClient.get).toHaveBeenCalledWith({
      TableName: tableName,
      Key: {
        email: "test@example.com",
      },
    });

    // Verify that the result matches the expected object
    expect(result).toEqual(mp);
  });

  test("should create MP users in bulk and return the success message", async () => {
    const mps: IMP[] = [
      {
        email: "test1@example.com",
        id: "1",
        fullName: "Test MP1",
        electorateType: "Federal",
        electorateName: "Test Electorate1",
      },
      {
        email: "test2@example.com",
        id: "2",
        fullName: "Test MP2",
        electorateType: "Federal",
        electorateName: "Test Electorate2",
      },
    ];

    // Mock the batchWrite method to resolve
    docClient.batchWrite = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });

    const result = await mpSaveUser.createMPUserBulk(mps);

    // Verify that the batchWrite method was called
    expect(docClient.batchWrite).toHaveBeenCalled();

    // Verify that the result matches the expected message
    expect(result).toEqual("MPS Created!");
  });
});
