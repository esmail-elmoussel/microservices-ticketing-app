import {
  BadRequestError,
  NotFoundError,
  requestValidationMiddleware,
} from "@esmailelmoussel/microservices-common";
import { Router } from "express";
import { param } from "express-validator";
import { isValidObjectId } from "mongoose";
import { Ticket } from "../models/ticket.model";

const router = Router();

router.get(
  "/api/orders/:id",
  param("id").isMongoId(),
  requestValidationMiddleware,
  async (req, res) => {
    const { params } = req;

    const ticket = await Ticket.findById(params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    return res.json(ticket);
  }
);

export { router as getOrder };
