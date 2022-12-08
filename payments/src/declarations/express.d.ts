import { DecodedToken } from "../types/user.types";

declare global {
  namespace Express {
    interface Request {
      currentUser?: DecodedToken;
    }
  }
}
