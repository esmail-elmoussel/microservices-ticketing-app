import {
  AuthenticationError,
  authenticationMiddleware,
  NotFoundError,
  OrderStatus,
} from "@esmailelmoussel/microservices-common";
import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events";
import { Order } from "../models/order.model";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/orders/:orderId",
  authenticationMiddleware,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new AuthenticationError("Not Authorized!");
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    res.status(204).send(order);
  }
);

export { router as cancelOrder };
