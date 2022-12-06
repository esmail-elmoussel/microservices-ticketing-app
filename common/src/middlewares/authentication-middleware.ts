import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { configs } from "../configs";
import { AuthenticationError } from "../errors/authentication-error";
import { DecodedToken } from "../types/user.types";

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.session as { token?: string };

  if (!configs.JWT_SECRET) {
    throw new Error('Missing env variable "JWT_SECRET"');
  }

  if (!token) {
    throw new AuthenticationError("token must be provided!");
  }

  jwt.verify(token, configs.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      throw new AuthenticationError(err.message);
    }

    req.currentUser = decodedToken as DecodedToken;
    next();
  });
};
