import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../../src/helpers/httpErrors/NotFoundError";

describe("NotFoundError", () => {
  it("should create a NotFoundError with a message and correct statusCode", () => {
    const errorMessage = "Item not found";
    const notFoundError = new NotFoundError(errorMessage);

    expect(notFoundError.message).toBe(errorMessage);
    expect(notFoundError.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  it("should serialize the error correctly", () => {
    const errorMessage = "Item not found";
    const notFoundError = new NotFoundError(errorMessage);
    const serializedErrors = notFoundError.serializeErrors();

    expect(serializedErrors).toEqual([{ message: errorMessage }]);
  });
});
