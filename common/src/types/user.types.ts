import jwt from "jsonwebtoken";

export interface DecodedToken extends jwt.JwtPayload {
  id: string;
  email: string;
}
