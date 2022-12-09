import {
  BaseListener,
  OrderExpiredEvent,
  OrderStatus,
} from "@esmailelmoussel/microservices-common";
import { Message } from "node-nats-streaming";
import { configs } from "../../configs";
import { Order } from "../../models/order.model";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class OrderExpiredListener extends BaseListener<OrderExpiredEvent> {
  readonly subject = "order:expired";

  queueGroup = configs.QUEUE_GROUP_NAME;

  onMessage = async (data: OrderExpiredEvent["data"], msg: Message) => {
    const { id } = data;

    const order = await Order.findById(id).populate("ticket");

    if (!order) {
      throw new Error("Order not found!");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    msg.ack();
  };
}
