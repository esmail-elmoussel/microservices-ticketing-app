import {
  AuthenticationError,
  authenticationMiddleware,
  NotFoundError,
  requestValidationMiddleware,
} from "@esmailelmoussel/microservices-common";
import { Router } from "express";
import { body } from "express-validator";
import { ObjectId } from "mongoose";
import { Ticket } from "../models/ticket.model";

const router = Router();

router.put(
  "/api/tickets",
  authenticationMiddleware,
  body("title").isString().not().isEmpty().optional(),
  body("price").isFloat({ gt: 0 }).optional(),
  body("ticketId").isMongoId(),
  requestValidationMiddleware,
  async (req, res) => {
    const { title, price, ticketId } = req.body as {
      title?: string;
      price?: number;
      ticketId: ObjectId;
    };
    const { currentUser } = req;

    // const ticket = await Ticket.findByIdAndUpdate(ticketId, { title, price });
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== currentUser!.id) {
      throw new AuthenticationError("Can not edit others tickets");
    }

    ticket.set({ title, price });

    await ticket.save();

    return res.status(200).json(ticket);
  }
);

export { router as editTicket };
