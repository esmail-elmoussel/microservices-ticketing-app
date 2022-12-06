import {
  BaseListener,
  OrderCancelledEvent,
} from "@esmailelmoussel/microservices-common";
import { Message } from "node-nats-streaming";
import { constants } from "../../constants";
import { Ticket } from "../../models/ticket.model";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  readonly subject = "order:cancelled";

  queueGroup = constants.QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found!");
    }

    if (ticket.orderId !== data.id) {
      throw new Error("order id is not associated with ticket");
    }

    ticket.set({ orderId: undefined });

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
