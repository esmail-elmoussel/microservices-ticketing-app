import {
  authenticationMiddleware,
  DecodedToken,
  requestValidationMiddleware,
  AuthenticationError,
  BadRequestError,
  OrderStatus,
} from "@esmailelmoussel/microservices-common";

import { Router } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events";
import { Order } from "../models/order.model";
import { Transaction } from "../models/transaction.model";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe";

const router = Router();

router.post(
  "/api/payments",
  authenticationMiddleware,
  body("cardToken").isString(),
  body("orderId").isMongoId(),
  requestValidationMiddleware,
  async (req, res) => {
    const { cardToken, orderId } = req.body;
    const { currentUser } = req as { currentUser: DecodedToken };

    const order = await Order.findById(orderId);

    if (!order) {
      throw new BadRequestError("Order not found!");
    }

    if (order.userId !== currentUser.id) {
      throw new AuthenticationError("Can not purchase others orders!");
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order cancelled!");
    }

    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError("Order completed!");
    }

    const stripeResponse = await stripe.charges.create({
      amount: order.price * 100,
      currency: "usd",
      source: cardToken,
      description: "Charge for purchasing a ticket",
    });

    order.status = OrderStatus.Complete;

    await order.save();

    const transaction = Transaction.build({
      orderId: order.id,
      stripeId: stripeResponse.id,
    });

    await transaction.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      transactionId: transaction.id,
      orderId: transaction.orderId,
      stripeId: transaction.stripeId,
    });

    return res.send(transaction);
  }
);

export { router as purchaseOrder };

// TODO: to be deleted from this file and adding it to declaration folder!
declare global {
  namespace Express {
    interface Request {
      currentUser?: DecodedToken;
    }
  }
}
