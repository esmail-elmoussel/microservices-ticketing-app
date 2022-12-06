import { TicketUpdatedEvent } from "@esmailelmoussel/microservices-common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const createTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    price: 1,
    title: "Ticket",
  });

  await ticket.save();

  return ticket;
};

const setup = async () => {
  const ticketUpdatedListenerInstance = new TicketUpdatedListener(
    natsWrapper.client
  );

  // @ts-ignore
  const messageMock: Message = {
    ack: jest.fn(),
  };

  const createdTicket = await createTicket();

  const eventData: TicketUpdatedEvent["data"] = {
    id: createdTicket.id,
    title: "New Ticket",
    price: 10,
    userId: new mongoose.Types.ObjectId().toString(),
    version: 1,
  };

  return {
    ticketUpdatedListenerInstance,
    messageMock,
    eventData,
    createdTicket,
  };
};

it("should throw error due to ticket not found", async () => {
  const { ticketUpdatedListenerInstance, messageMock, eventData } =
    await setup();

  eventData.id = new mongoose.Types.ObjectId().toString();

  let error;
  try {
    await ticketUpdatedListenerInstance.onMessage(eventData, messageMock);
  } catch (err) {
    error = err as unknown as Error;
  }

  expect(error).toBeDefined();
  expect(error?.message).toBe("Ticket not found!");
});

it("should process message successfully", async () => {
  const { ticketUpdatedListenerInstance, messageMock, eventData } =
    await setup();

  await ticketUpdatedListenerInstance.onMessage(eventData, messageMock);

  const ticketsCount = await Ticket.count();
  expect(ticketsCount).toBe(1);

  const ticket = await Ticket.findById(eventData.id);
  expect(ticket).toBeDefined();
  expect(ticket?.version).toBe(1);
  expect(ticket?.price).toBe(eventData.price);

  expect(messageMock.ack).toBeCalledTimes(1);
});

it("should reject event due to concurrency issue", async () => {
  const {
    ticketUpdatedListenerInstance,
    messageMock,
    eventData,
    createdTicket,
  } = await setup();

  eventData.version = 10;

  let error;
  try {
    await ticketUpdatedListenerInstance.onMessage(eventData, messageMock);
  } catch (err) {
    error = err as unknown as Error;
  }

  expect(error).toBeDefined();
  expect(error?.message).toBe("Concurrency issue! wrong ticket version.");

  const ticket = await Ticket.findById(eventData.id);
  expect(ticket?.version).toBe(0);
  expect(ticket?.price).toBe(createdTicket.price);

  expect(messageMock.ack).not.toBeCalled();
});
