import {
  BaseListener,
  OrderCreatedEvent,
} from "@esmailelmoussel/microservices-common";
import { Message } from "node-nats-streaming";
import { configs } from "../../configs";
import { Order } from "../../models/order.model";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = "order:created";

  queueGroup = configs.QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}
