import { CustomError } from "src/helpers/httpErrors/CustomError";

const formatErrorResponse = (error): any => {
  if (error instanceof CustomError) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({ error: error.message }),
    };
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export default formatErrorResponse;
