import { handler } from "../src/functions/mpBulkUpload";
import { generateEvent } from "./utils/eventGenerator";
import { StatusCodes } from "http-status-codes";

import AWS from "aws-sdk";
import AWSMock from "aws-sdk-mock";

jest.setTimeout(90000);

describe("MP bulk invitation", function () {
  let fileId = "test.csv";

  // Mock the S3 getObject method
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("S3", "getObject", (params, callback) => {
      // Here, you can replace the readStream with a mocked stream containing sample CSV data for testing
      const readStream = require("fs").createReadStream(
        "./path/to/sample/test.csv"
      );
      callback(undefined, { Body: readStream });
    });
  });

  afterEach(() => {
    AWSMock.restore("S3");
  });

  // Mock the DynamoDB and Email service methods
  beforeEach(() => {
    jest.mock("../src/service/AdminService", () => ({
      getAdminByEmail: jest.fn(() => Promise.resolve(/* ... */)),
    }));
    jest.mock("../src/service/MpService", () => ({
      createMPUserBulk: jest.fn(() => Promise.resolve(/* ... */)),
    }));
    jest.mock("../src/service/EmailService/Email.service", () => ({
      runEmailJob: jest.fn(() => Promise.resolve(/* ... */)),
    }));
  });

  it("Verifies Fails with invalid CSV format", async () => {
    // Replace the readStream with a mocked stream containing invalid CSV data for testing
    AWSMock.restore("S3");
    AWSMock.mock("S3", "getObject", (params, callback) => {
      const readStream = require("fs").createReadStream(
        "./path/to/invalid/test.csv"
      );
      callback(undefined, { Body: readStream });
    });

    const context = {
      getRemainingTimeInMillis: () => 10000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "test@example.com",
        },
        body: {
          fileId: fileId,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(StatusCodes.OK);
  });

  it("Verifies Fails with missing required CSV columns", async () => {
    // Replace the readStream with a mocked stream containing CSV data with missing required columns for testing
    AWSMock.restore("S3");
    AWSMock.mock("S3", "getObject", (params, callback) => {
      const readStream = require("fs").createReadStream(
        "./path/to/missing-columns/test.csv"
      );
      callback(undefined, { Body: readStream });
    });

    const context = {
      getRemainingTimeInMillis: () => 10000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "test@example.com",
        },
        body: {
          fileId: fileId,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(StatusCodes.OK);
  });

  it("Verifies Fails  without admin", async () => {
    const context = {
      getRemainingTimeInMillis: () => 6000, // Provide a mock implementation of getRemainingTimeInMillis
    } as any;

    const result = await handler(
      generateEvent({
        claims: {
          email: "abc@gmail.com",
        },
        body: {
          fileId: fileId,
        },
      }),
      context,
      {} as any
    );

    expect(result.statusCode).toEqual(401);
  });
});
