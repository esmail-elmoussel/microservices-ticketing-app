import { TicketCreatedEvent } from "@esmailelmoussel/microservices-common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

it("should process message successfully", async () => {
  const ticketCreatedListenerInstance = new TicketCreatedListener(
    natsWrapper.client
  );

  const eventData: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    title: "New Ticket",
    price: 10,
    userId: new mongoose.Types.ObjectId().toString(),
    version: 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  await ticketCreatedListenerInstance.onMessage(eventData, msg);

  const ticketsCount = await Ticket.count();
  expect(ticketsCount).toBe(1);

  const ticket = await Ticket.findById(eventData.id);
  expect(ticket).toBeDefined();
  expect(ticket?.id).toBe(eventData.id);
  expect(ticket?.version).toBe(0);

  expect(msg.ack).toBeCalledTimes(1);
});
