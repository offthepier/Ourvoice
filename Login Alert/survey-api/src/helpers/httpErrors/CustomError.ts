export abstract class CustomError extends Error {
  abstract statusCode: number;

  // taking message just to pass it to the Error constructor
  // because these messages would still be printed inside our error Logs
  constructor(message: string) {
    super(message);

    // because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
