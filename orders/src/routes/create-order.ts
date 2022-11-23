import {
  authenticationMiddleware,
  requestValidationMiddleware,
} from "@esmailelmoussel/microservices-common";
import { DecodedToken } from "@esmailelmoussel/microservices-common/build/types/user.types";

import { Router } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket.model";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post(
  "/api/orders",
  authenticationMiddleware,
  body("title").isString(),
  body("price").isFloat({ gt: 0 }),
  requestValidationMiddleware,
  async (req, res) => {
    const { title, price } = req.body as { title: string; price: number };

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });

    await ticket.save();

    return res.status(201).json(ticket);
  }
);

export { router as createOrder };

// TODO: to be deleted from this file and adding it to declaration folder!
declare global {
  namespace Express {
    interface Request {
      currentUser?: DecodedToken;
    }
  }
}
