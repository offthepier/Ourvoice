import { StatusCodes } from "http-status-codes";
import { CustomError } from "./CustomError";

export class ValidationError extends CustomError {
  statusCode = StatusCodes.UNPROCESSABLE_ENTITY;

  constructor(public message: string) {
    super("Item not found");

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors(): { message: string }[] {
    return [{ message: this.message }];
  }
}
