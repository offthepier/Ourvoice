import { DocumentClient } from "aws-sdk/clients/dynamodb";
import AdminService from "../../src/service/AdminService/admin.service";
import { v4 as uuidv4 } from "uuid";

const tableName = "Admins";
const docClient = new DocumentClient();
const adminService = new AdminService(docClient, tableName);

const email = "test@example.com";
const firstName = "John";
const lastName = "Doe";
const adminId = uuidv4();

// Mock the put and get methods of the DocumentClient
// Mock the put and get methods of the DocumentClient
jest.spyOn(docClient, "put").mockImplementation((params, callback) => {
  return {
    promise: () => Promise.resolve(),
    abort: jest.fn(),
    createReadStream: jest.fn(),
    eachPage: jest.fn(),
    isPageable: jest.fn(),
    send: jest.fn(),
    on: jest.fn(),
  } as any;
});

jest.spyOn(docClient, "get").mockImplementation((params, callback) => {
  return {
    promise: () =>
      Promise.resolve({
        Item: {
          email: email,
          id: adminId,
          firstName: firstName,
          lastName: lastName,
        },
      }),
    abort: jest.fn(),
    createReadStream: jest.fn(),
    eachPage: jest.fn(),
    isPageable: jest.fn(),
    send: jest.fn(),
    on: jest.fn(),
  } as any;
});

describe("AdminService", () => {
  it("should create an admin", async () => {
    const admin = {
      id: adminId,
      email: email,
      firstName: firstName,
      lastName: lastName,
    };

    const createdAdmin = await adminService.createAdmin(admin);

    expect(createdAdmin).toEqual(admin);
  });

  it("should get an admin by email", async () => {
    const admin = await adminService.getAdminByEmail(email);

    expect(admin).toEqual({
      id: adminId,
      email: email,
      firstName: "",
      lastName: "",
    });
  });
});
