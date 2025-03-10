import { StatusCodes } from "http-status-codes";
import { BaseSchema } from "yup";

export const requestValidator = (schema: {
  body?: BaseSchema;
  queryStringParameters?: BaseSchema;
}) => {
  const before = async (request) => {
    try {
      const { body, queryStringParameters } = request.event;

      if (schema.body) {
        schema.body.validateSync(body);
      }

      if (schema.queryStringParameters) {
        schema.queryStringParameters.validateSync(queryStringParameters ?? {});
      }

      return Promise.resolve();
    } catch (e) {
      return {
        statusCode: StatusCodes.BAD_GATEWAY,
        body: JSON.stringify({
          errors: e.errors,
          message: "Validation Error",
        }),
      };
    }
  };

  return {
    before,
  };
};
