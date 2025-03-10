import { handler } from "../src/functions/verifyUser";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { StatusCodes } from "http-status-codes";
import { generateEvent } from "./utils/eventGenerator";
import userProfileService from "../src/service/UserProfile";
import verificationTransactionsService from "../src/service/VerificationTransactionsService";
import axios from "axios";
import { CognitoIdentityServiceProvider } from "aws-sdk"; // Change this line
import IUser from "../src/models/User";

jest.mock("../src/service/UserProfile", () => ({
  getUserProfile: jest.fn(),
  updateVerificationStatus: jest.fn(),
  // other functions
}));

jest.setTimeout(30000);

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("aws-sdk", () => {
  return {
    CognitoIdentityServiceProvider: jest.fn(() => ({
      adminUpdateUserAttributes: jest.fn(),
    })),
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        // Add the methods you use in your service here, for example:
        get: jest.fn(),
        put: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        query: jest.fn(),
      })),
    },
  };
});
const mockedCognito = new CognitoIdentityServiceProvider();

function generateIdToken(payload: Record<string, unknown>): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = "fake_signature"; // This can be hardcoded for test purposes
  return `${header}.${body}.${signature}`;
}

describe("Create Response", function () {
  const verify = {
    grantToken: "123",
    transactionID: "456",
  };

  const notVerify = {
    transactionID: "456",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // User doesn't have a dob
  it("User doesn't have dob", async () => {
    jest.spyOn(userProfileService, "getUserProfile").mockResolvedValue({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "example@example.com",
      dob: undefined,
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
    });

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "example@example.com",
        },
        body: verify,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  // Axios post request failure
  it("Axios post request failure", async () => {
    jest.spyOn(userProfileService, "getUserProfile").mockResolvedValue({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "example@example.com",
      dob: undefined,
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
    });

    mockedAxios.post.mockRejectedValue(new Error("Request failed"));

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "example@example.com",
        },
        body: verify,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  // adminUpdateUserAttributes failure
  it("adminUpdateUserAttributes failure", async () => {
    jest.spyOn(userProfileService, "getUserProfile").mockResolvedValue({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "example@example.com",
      dob: undefined,
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
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        id_token: "fake_id_token",
      },
    });

    (
      mockedCognito.adminUpdateUserAttributes as jest.Mock
    ).mockRejectedValueOnce(new Error("Failed to update user attributes"));

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "example@example.com",
        },
        body: verify,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(400);
  });

  // User's last name does not match the ID token
  it("User's last name does not match ID token", async () => {
    jest.spyOn(userProfileService, "getUserProfile").mockResolvedValue({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "example@example.com",
      dob: "1990-01-01",
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
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        id_token: "fake_id_token",
      },
    });

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "example@example.com",
        },
        body: { grantToken: "123", transactionID: "456" },
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  // User's date of birth does not match the ID token
  it("User's date of birth does not match ID token", async () => {
    jest.spyOn(userProfileService, "getUserProfile").mockResolvedValue({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "example@example.com",
      dob: "1990-01-01",
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
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        id_token: "fake_id_token",
      },
    });

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "example@example.com",
        },
        body: { grantToken: "123", transactionID: "456" },
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  // The getUserProfile function throws an error
  it("getUserProfile function throws an error", async () => {
    const mockGetUserProfile = jest.fn<Promise<IUser>, [string]>();
    (mockGetUserProfile as any).mockRejectedValue(new Error("Error"));

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "example@example.com",
        },
        body: { grantToken: "123", transactionID: "456" },
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });
  // The request context does not contain the necessary authorization claims
  it("Request context does not contain necessary authorization claims", async () => {
    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const reqBody = await handler(
      generateEvent({
        body: { grantToken: "123", transactionID: "456" },
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  it("Successful verification", async () => {
    jest.spyOn(userProfileService, "getUserProfile").mockResolvedValue({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "example@example.com",
      dob: "1990-01-01",
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
    });

    const id_token = generateIdToken({
      family_name: "Doe",
      birthdate: "1990-01-01",
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        id_token,
      },
    });

    (mockedCognito.adminUpdateUserAttributes as jest.Mock).mockResolvedValue(
      {}
    );
    jest
      .spyOn(userProfileService, "updateVerificationStatus")
      .mockResolvedValue("dummyValue");
    jest
      .spyOn(verificationTransactionsService, "createVerificationTransaction")
      .mockResolvedValue("dummyValue");

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "example@example.com",
        },
        body: verify,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(404);
  });

  // Mismatch in the last name
  it("Mismatch in the last name", async () => {
    jest.spyOn(userProfileService, "getUserProfile").mockResolvedValue({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "example@example.com",
      dob: "1990-01-01",
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
    });

    const id_token = generateIdToken({
      family_name: "Smith",
      birthdate: "1990-01-01",
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        id_token,
      },
    });

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "example@example.com",
        },
        body: verify,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  // Mismatch in the date of birth
  it("Mismatch in the date of birth", async () => {
    jest.spyOn(userProfileService, "getUserProfile").mockResolvedValue({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "example@example.com",
      dob: "1990-01-01",
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
    });

    const id_token = generateIdToken({
      family_name: "Doe",
      birthdate: "1991-01-01",
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        id_token,
      },
    });

    const context = {
      getRemainingTimeInMillis: () => 5000,
    } as any;

    const reqBody = await handler(
      generateEvent({
        claims: {
          email: "example@example.com",
        },
        body: verify,
      }),
      context,
      {} as any
    );

    expect(reqBody.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  });

  afterAll(async () => {
    await new Promise((res) => setTimeout(res, 5000)); // avoid jest open handle error
  });
});
