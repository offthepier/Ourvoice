import formatError from "../src/core/formatErrorResponse";
import { NotFoundError } from "../src/helpers/httpErrors/NotFoundError";

describe("FormatErrorResponse", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("custom error", async () => {
    const result = formatError(new Error("custom error"));
    const resultCustom = formatError(new NotFoundError("custom error"));

    expect(result).toBeDefined();
    expect(resultCustom).toBeDefined();
  });
});
