import { CustomError } from "./custom-error";

export class AuthenticationError extends CustomError {
  statusCode = 401;

  constructor(private errMessage: string) {
    super("Authentication error!");
  }

  serializeErrors() {
    return [{ message: this.errMessage }];
  }
}
