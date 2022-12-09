import {
  BaseListener,
  OrderCancelledEvent,
  OrderStatus,
} from "@esmailelmoussel/microservices-common";
import { Message } from "node-nats-streaming";
import { configs } from "../../configs";
import { Order } from "../../models/order.model";

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  readonly subject = "order:cancelled";

  queueGroup = configs.QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findById(data.id);

    if (!order) {
      throw new Error("Order not found!");
    }

    if (data.version !== order.version + 1) {
      throw new Error("Concurrency issue! wrong ticket version.");
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    msg.ack();
  }
}
