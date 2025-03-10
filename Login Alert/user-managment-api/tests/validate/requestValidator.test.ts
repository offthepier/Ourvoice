import { requestValidator } from "../../src/helpers/RequestValidator";
import * as yup from "yup";

describe("requestValidator", () => {
  const bodySchema = yup.object().shape({
    name: yup.string().required(),
    age: yup.number().required().positive().integer(),
  });

  const queryStringSchema = yup.object().shape({
    page: yup.number().required().positive().integer(),
  });

  const eventWithValidBody = {
    body: { name: "John Doe", age: 30 },
  };

  const eventWithInvalidBody = {
    body: { name: "John Doe", age: -30 },
  };

  const eventWithValidQueryString = {
    queryStringParameters: { page: 1 },
  };

  const eventWithInvalidQueryString = {
    queryStringParameters: { page: -1 },
  };

  const eventWithValidBodyAndQueryString = {
    body: { name: "John Doe", age: 30 },
    queryStringParameters: { page: 1 },
  };

  it("should validate an event with valid body and query string parameters", async () => {
    const validator = requestValidator({
      body: bodySchema,
      queryStringParameters: queryStringSchema,
    });

    await expect(
      validator.before({ event: eventWithValidBodyAndQueryString })
    ).resolves.toBeUndefined();
  });

  it("should throw an error for an event with invalid body or query string parameters", async () => {
    const validator = requestValidator({
      body: bodySchema,
      queryStringParameters: queryStringSchema,
    });

    const invalidBodyResult = await validator.before({
      event: eventWithInvalidBody,
    });
    expect(invalidBodyResult).toBeTruthy();
    expect(invalidBodyResult?.statusCode).toBe(502);

    const invalidQueryStringResult = await validator.before({
      event: eventWithInvalidQueryString,
    });
    expect(invalidQueryStringResult).toBeTruthy();
    expect(invalidQueryStringResult?.statusCode).toBe(502);
  });
});
