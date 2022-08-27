import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  constructor() {
    super("Not found error!");
  }

  statusCode = 404;

  serializeErrors() {
    return [{ message: "Not Found!" }];
  }
}
