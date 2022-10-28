import { CustomError } from "@esmailelmoussel/microservices-common";
import { NextFunction, Request, Response } from "express";

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  console.error("Unhandled Error! ", err);

  return res.status(500).send({
    errors: [{ message: "Something went wrong" }],
  });
};
