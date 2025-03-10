import { validateEmail } from "../../src/utils/emailValidate";

describe("Email validator", () => {
  it("should return true for a valid email address", () => {
    const validEmail = "test@example.com";
    expect(validateEmail(validEmail)).toBe(true);
  });

  it("should return false for an email address without a top-level domain", () => {
    const invalidEmail = "test@example";
    expect(validateEmail(invalidEmail)).toBe(true);
  });

  it("should return false for an email address with an invalid character", () => {
    const invalidEmail = "test@example.com<>";
    expect(validateEmail(invalidEmail)).toBe(false);
  });

  it("should return false for an email address with a missing @ symbol", () => {
    const invalidEmail = "testexample.com";
    expect(validateEmail(invalidEmail)).toBe(false);
  });
});
