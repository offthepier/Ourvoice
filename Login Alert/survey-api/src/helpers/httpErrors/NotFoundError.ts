import { StatusCodes } from 'http-status-codes';
import {CustomError} from './CustomError';

export class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;

  constructor(public message: string) {
    super('Item not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): {message: string}[] {
    return [{message: this.message}];
  }
}