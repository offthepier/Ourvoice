import { Handler } from "aws-lambda";
import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";

const middify = (handler: Handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(cors())
    .use(httpErrorHandler());
};

export default middify;
