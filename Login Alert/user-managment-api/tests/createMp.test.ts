import { handler } from "../src/functions/postMpController";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { StatusCodes } from "http-status-codes";
import { generateEvent } from "../tests/utils/eventGenerator";
import { v4 as uuidv4 } from "uuid";
import adminMPService from "../src/service/MpService";
import adminService from "../src/service/AdminService";
import { runEmailJob } from "../src/service/EmailService/Email.service";
import IMP from "../src/models/InvitedMp";

const createMpMock = jest.fn();

beforeEach(() => {
  createMpMock.mockClear();
  jest.spyOn(adminMPService, "createMPUser").mockImplementation(createMpMock);
});

jest.setTimeout(30000);

const mpId = uuidv4();
const email = "test@example.com";
const fullName = "John";
const electorateType = "FEDERAL";
const electorateName = "Melbourne";

describe("Create MP", function () {
  let mpBody = {
    email: email,
    fullName: fullName,
    electorateName: electorateName,
    electorateType: electorateType,
  };

  let newMp: IMP = {
    id: mpId,
    email: email,
    fullName: fullName,
    electorateName: electorateName,
    electorateType: electorateType,
  };
  it("Returns a bad request when admin not found", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    // Mock the getAdminByEmail function to return null (admin not found)
    jest.spyOn(adminService, "getAdminByEmail").mockResolvedValue(null);

    const reqBody = await handler(
      generateEvent({
        claims: {
          sub: "12345",
          email: "nonexistentadmin@example.com",
        },
        body: mpBody,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  it("Returns conflict when the user already exists", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    // Mock the getAdminByEmail function to return an admin
    jest.spyOn(adminService, "getAdminByEmail").mockResolvedValue({});

    // Mock the getMPInviteByEmail function to return a user (user exists)
    jest
      .spyOn(adminMPService, "getMPInviteByEmail")
      .mockResolvedValue(Promise.resolve(null) as unknown as Promise<IMP>);
    const reqBody = await handler(
      generateEvent({
        claims: {
          sub: "12345",
          email: "existinguser@example.com",
        },
        body: mpBody,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.CREATED);
  });

  it("Verifies successful response", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    // Mock the getAdminByEmail function to return an admin
    jest.spyOn(adminService, "getAdminByEmail").mockResolvedValue({});

    // Mock the getMPInviteByEmail function to return null (user not found)
    jest
      .spyOn(adminMPService, "getMPInviteByEmail")
      .mockResolvedValue(Promise.resolve(null) as unknown as Promise<IMP>);

    // Mock the createMPUser function to return the newly created user
    createMpMock.mockResolvedValue(mpBody);

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "test@example.com",
        },
        body: {
          email: "rk@gmail.com",
          fullName: fullName,
          electorateName: electorateName,
          electorateType: electorateType,
        },
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
