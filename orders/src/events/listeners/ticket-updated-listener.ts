import {
  BaseListener,
  TicketUpdatedEvent,
} from "@esmailelmoussel/microservices-common";
import { Message } from "node-nats-streaming";
import { configs } from "../../configs";
import { Ticket } from "../../models/ticket.model";

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
  readonly subject = "ticket:updated";

  queueGroup = configs.QUEUE_GROUP_NAME;

  onMessage = async (data: TicketUpdatedEvent["data"], msg: Message) => {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error("Ticket not found!");
    }

    if (version !== ticket.version + 1) {
      throw new Error("Concurrency issue! wrong ticket version.");
    }

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  };
}
