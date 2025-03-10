import formatErrorResponse from "../../src/core/formatErrorResponse";
import { CustomError } from "../../src/helpers/httpErrors/CustomError";

// Create a new class that extends CustomError
class TestError extends CustomError {
  statusCode: number;
  serializeErrors(): { message: string; field?: string | undefined }[] {
    throw new Error("Method not implemented.");
  }
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode; // Set the statusCode property
  }
}

describe("formatErrorResponse", () => {
  test("should return the correct response for CustomErrors", () => {
    // Use the TestError class to create an instance
    const error = new TestError("Test error message", 400);
    const expectedResponse = {
      statusCode: 400,
      body: JSON.stringify({ error: "Test error message" }),
    };

    expect(formatErrorResponse(error)).toEqual(expectedResponse);
  });

  test("should return a 500 error response for non-CustomErrors", () => {
    const error = new Error("Test error message");
    const expectedResponse = {
      statusCode: 500,
      body: JSON.stringify({}), // Match the format used in formatErrorResponse
    };

    expect(formatErrorResponse(error)).toEqual(expectedResponse);
  });

});
