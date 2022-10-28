import { RequestValidationError } from "@esmailelmoussel/microservices-common";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const requestValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
