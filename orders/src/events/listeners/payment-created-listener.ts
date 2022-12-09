import {
  BaseListener,
  OrderStatus,
  PaymentCreatedEvent,
} from "@esmailelmoussel/microservices-common";
import { Message } from "node-nats-streaming";
import { configs } from "../../configs";
import { Order } from "../../models/order.model";

export class PaymentCreatedListener extends BaseListener<PaymentCreatedEvent> {
  readonly subject = "payment:created";

  queueGroup = configs.QUEUE_GROUP_NAME;

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
