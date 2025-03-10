import { ValidationError } from "../../src/helpers/httpErrors/ValidationError";
import { CustomError } from "../../src/helpers/httpErrors/CustomError";
import { StatusCodes } from "http-status-codes";

describe("ValidationError", () => {
  it("should extend CustomError", () => {
    const validationError = new ValidationError("Test error message");
    expect(validationError).toBeInstanceOf(CustomError);
  });

  it("should have the correct status code", () => {
    const validationError = new ValidationError("Test error message");
    expect(validationError.statusCode).toEqual(
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  });

  it("should properly set and serialize the error message", () => {
    const testErrorMessage = "Test error message";
    const validationError = new ValidationError(testErrorMessage);

    const serializedErrors = validationError.serializeErrors();
    expect(serializedErrors).toEqual([{ message: testErrorMessage }]);
  });
});
