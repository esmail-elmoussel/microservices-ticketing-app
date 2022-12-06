import {
  OrderCreatedEvent,
  OrderStatus,
} from "@esmailelmoussel/microservices-common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const orderCreatedListenerInstance = new OrderCreatedListener(
    natsWrapper.client
  );

  const ticket = Ticket.build({
    price: 10,
    title: "Ticket",
    userId: new mongoose.Types.ObjectId().toString(),
  });

  await ticket.save();

  const eventData: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    expiresAt: new Date().toISOString(),
    status: OrderStatus.Created,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    userId: new mongoose.Types.ObjectId().toString(),
    version: 0,
  };

  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  return { orderCreatedListenerInstance, eventData, eventMessage, ticket };
};

it("should throw error due to ticket not found", async () => {
  const { orderCreatedListenerInstance, eventData, eventMessage, ticket } =
    await setup();

  eventData.ticket.id = new mongoose.Types.ObjectId().toString();

  let error;
  try {
    await orderCreatedListenerInstance.onMessage(eventData, eventMessage);
  } catch (err) {
    error = err as unknown as Error;
  }

  expect(error?.message).toBe("Ticket not found!");
});

it("should add orderId to ticket", async () => {
  const { orderCreatedListenerInstance, eventData, eventMessage } =
    await setup();

  const ticket = await Ticket.findById(eventData.ticket.id);

  expect(ticket?.orderId).not.toBeDefined();

  await orderCreatedListenerInstance.onMessage(eventData, eventMessage);

  const updatedTicket = await Ticket.findById(eventData.ticket.id);

  expect(updatedTicket?.orderId).toBe(eventData.id);
});

it("should acknowledge message", async () => {
  const { orderCreatedListenerInstance, eventData, eventMessage } =
    await setup();

  await orderCreatedListenerInstance.onMessage(eventData, eventMessage);

  expect(eventMessage.ack).toBeCalledTimes(1);
});

it("should publish ticket updated event", async () => {
  const { orderCreatedListenerInstance, eventData, eventMessage } =
    await setup();

  await orderCreatedListenerInstance.onMessage(eventData, eventMessage);

  expect(natsWrapper.client.publish).toBeCalledTimes(1);

  const ticketUpdatedEventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.lastCall[1]
  );

  expect(ticketUpdatedEventData.id).toBe(eventData.ticket.id);
  expect(ticketUpdatedEventData.orderId).toBe(eventData.id);
  expect(ticketUpdatedEventData.version).toBe(1);
});
