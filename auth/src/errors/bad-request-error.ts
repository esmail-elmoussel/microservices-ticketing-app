import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(private errMessage: string) {
    super("Bad request error!");
  }

  serializeErrors() {
    return [{ message: this.errMessage }];
  }
}
