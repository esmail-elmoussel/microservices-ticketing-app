import {
  AuthenticationError,
  authenticationMiddleware,
  BadRequestError,
  NotFoundError,
  requestValidationMiddleware,
} from "@esmailelmoussel/microservices-common";
import { Router } from "express";
import { body } from "express-validator";
import { ObjectId } from "mongoose";
import { TicketUpdatedPublisher } from "../events";
import { Ticket } from "../models/ticket.model";
import { natsWrapper } from "../nats-wrapper";

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

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== currentUser!.id) {
      throw new AuthenticationError("Can not edit others tickets");
    }

    if (ticket.orderId) {
      throw new BadRequestError("Can not edit reserved ticket");
    }

    ticket.set({
      ...(title && { title }),
      ...(price && { price }),
    });

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    });

    return res.status(200).json(ticket);
  }
);

export { router as editTicket };
