import { OrderCancelledEvent } from "@esmailelmoussel/microservices-common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const orderCancelledListenerInstance = new OrderCancelledListener(
    natsWrapper.client
  );

  const ticket = Ticket.build({
    price: 10,
    title: "Ticket",
    userId: new mongoose.Types.ObjectId().toString(),
  });

  await ticket.save();

  const orderId = new mongoose.Types.ObjectId().toString();

  ticket.set({ orderId });
  await ticket.save();

  const eventData: OrderCancelledEvent["data"] = {
    id: orderId,
    ticket: {
      id: ticket.id,
    },
    version: 1,
  };

  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  return { orderCancelledListenerInstance, eventData, eventMessage, ticket };
};

it("should throw error due to ticket not found", async () => {
  const { orderCancelledListenerInstance, eventData, eventMessage } =
    await setup();

  eventData.ticket.id = new mongoose.Types.ObjectId().toString();

  let error;
  try {
    await orderCancelledListenerInstance.onMessage(eventData, eventMessage);
  } catch (err) {
    error = err as unknown as Error;
  }

  expect(error?.message).toBe("Ticket not found!");
});

it("should remove orderId from ticket", async () => {
  const { orderCancelledListenerInstance, eventData, eventMessage } =
    await setup();

  const ticket = await Ticket.findById(eventData.ticket.id);

  expect(ticket?.orderId).toBe(eventData.id);

  await orderCancelledListenerInstance.onMessage(eventData, eventMessage);

  const updatedTicket = await Ticket.findById(eventData.ticket.id);

  expect(updatedTicket?.orderId).not.toBeDefined();
});

it("should acknowledge message", async () => {
  const { orderCancelledListenerInstance, eventData, eventMessage } =
    await setup();

  await orderCancelledListenerInstance.onMessage(eventData, eventMessage);

  expect(eventMessage.ack).toBeCalledTimes(1);
});

it("should publish ticket updated event", async () => {
  const { orderCancelledListenerInstance, eventData, eventMessage } =
    await setup();

  await orderCancelledListenerInstance.onMessage(eventData, eventMessage);

  expect(natsWrapper.client.publish).toBeCalledTimes(1);

  const ticketUpdatedEventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.lastCall[1]
  );

  expect(ticketUpdatedEventData.id).toBe(eventData.ticket.id);
  expect(ticketUpdatedEventData.orderId).not.toBeDefined();
  expect(ticketUpdatedEventData.version).toBe(2);
});

it("should should throw error due to concurrency issue", async () => {
  const { orderCancelledListenerInstance, eventData, eventMessage } =
    await setup();

  const ticket = await Ticket.findById(eventData.ticket.id);

  ticket?.set({ orderId: undefined });

  await ticket?.save();

  let error;
  try {
    await orderCancelledListenerInstance.onMessage(eventData, eventMessage);
  } catch (err) {
    error = err as Error;
  }

  expect(natsWrapper.client.publish).not.toBeCalled();
  expect(eventMessage.ack).not.toBeCalled();

  expect(error?.message).toBe("order id is not associated with ticket");
});
