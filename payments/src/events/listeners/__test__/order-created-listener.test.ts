import {
  OrderCreatedEvent,
  OrderStatus,
} from "@esmailelmoussel/microservices-common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order.model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const orderCreatedListenerInstance = new OrderCreatedListener(
    natsWrapper.client
  );

  const eventData: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    expiresAt: new Date().toISOString(),
    status: OrderStatus.Created,
    ticket: {
      id: new mongoose.Types.ObjectId().toString(),
      price: 100,
    },
    userId: new mongoose.Types.ObjectId().toString(),
    version: 0,
  };

  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  return { orderCreatedListenerInstance, eventData, eventMessage };
};

it("should create a new order", async () => {
  const { orderCreatedListenerInstance, eventData, eventMessage } =
    await setup();

  const ordersCount = await Order.count();

  expect(ordersCount).toBe(0);

  await orderCreatedListenerInstance.onMessage(eventData, eventMessage);

  const newOrdersCount = await Order.count();

  expect(newOrdersCount).toBe(1);
});

it("should add correct field to order collection", async () => {
  const { orderCreatedListenerInstance, eventData, eventMessage } =
    await setup();

  await orderCreatedListenerInstance.onMessage(eventData, eventMessage);

  const order = await Order.findById(eventData.id);

  expect(order!.id).toBe(eventData.id);
  expect(order!.status).toBe(eventData.status);
  expect(order!.price).toBe(eventData.ticket.price);
});

it("should acknowledge message", async () => {
  const { orderCreatedListenerInstance, eventData, eventMessage } =
    await setup();

  await orderCreatedListenerInstance.onMessage(eventData, eventMessage);

  expect(eventMessage.ack).toBeCalledTimes(1);
});
