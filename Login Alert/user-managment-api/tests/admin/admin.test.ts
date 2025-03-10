import { handler } from "../../src/functions/admin/createAdminController";
import { StatusCodes } from "http-status-codes";
import { generateEvent } from "../../tests/utils/eventGenerator";
import { v4 as uuidv4 } from "uuid";
import adminService from "../../src/service/AdminService";

jest.setTimeout(30000);

const email = "test@example.com";
const firstName = "John";
const lastName = "Doe";
const adminId = uuidv4();

const createAdminMock = jest.fn();

beforeEach(() => {
  createAdminMock.mockClear();
  jest.spyOn(adminService, "createAdmin").mockImplementation(createAdminMock);
});

describe("Create admin", function () {
  it("Verifies successful response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const newAdmin = {
      id: adminId,
      email: email,
      firstName: firstName,
      lastName: lastName,
    };

    createAdminMock.mockResolvedValue(newAdmin);

    const adminBody = {
      email: email,
      firstName: firstName,
      lastName: lastName,
    };

    const reqBody = await handler(
      generateEvent({
        body: adminBody,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.CREATED);
  });

  it("adminService throws an error", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const adminBody = {
      email: email,
      firstName: firstName,
      lastName: lastName,
    };

    createAdminMock.mockImplementation(() => {
      throw new Error("Error creating admin");
    });

    const reqBody = await handler(
      generateEvent({
        body: adminBody,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 500)); // avoid jest open handle error
  });
});
