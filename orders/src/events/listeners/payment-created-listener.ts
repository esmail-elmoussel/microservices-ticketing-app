import {
  BaseListener,
  OrderStatus,
  PaymentCreatedEvent,
} from "@esmailelmoussel/microservices-common";
import { Message } from "node-nats-streaming";
import { constants } from "../../constants";
import { Order } from "../../models/order.model";

export class PaymentCreatedListener extends BaseListener<PaymentCreatedEvent> {
  readonly subject = "payment:created";

  queueGroup = constants.QUEUE_GROUP_NAME;

  onMessage = async (data: PaymentCreatedEvent["data"], msg: Message) => {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found!");
    }

    order.status = OrderStatus.Complete;

    await order.save();

    msg.ack();
  };
}
