import {
  OrderCancelledEvent,
  OrderStatus,
} from "@esmailelmoussel/microservices-common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order.model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const orderCancelledListenerInstance = new OrderCancelledListener(
    natsWrapper.client
  );

  const orderId = new mongoose.Types.ObjectId().toString();

  const order = Order.build({
    id: orderId,
    status: OrderStatus.Created,
    version: 0,
    price: 10,
    userId: new mongoose.Types.ObjectId().toString(),
  });

  await order.save();

  const eventData: OrderCancelledEvent["data"] = {
    id: orderId,
    ticket: {
      id: new mongoose.Types.ObjectId().toString(),
    },
    version: 1,
  };

  // @ts-ignore
  const eventMessage: Message = {
    ack: jest.fn(),
  };

  return { orderCancelledListenerInstance, eventData, eventMessage, order };
};

it("should throw error due to order not found", async () => {
  const { orderCancelledListenerInstance, eventData, eventMessage } =
    await setup();

  eventData.id = new mongoose.Types.ObjectId().toString();

  let error;
  try {
    await orderCancelledListenerInstance.onMessage(eventData, eventMessage);
  } catch (err) {
    error = err as unknown as Error;
  }

  expect(error?.message).toBe("Order not found!");
});

it("should update order status to cancelled", async () => {
  const { orderCancelledListenerInstance, eventData, eventMessage } =
    await setup();

  const order = await Order.findById(eventData.id);

  expect(order?.status).toBe(OrderStatus.Created);

  await orderCancelledListenerInstance.onMessage(eventData, eventMessage);

  const updatedOrder = await Order.findById(eventData.id);

  expect(updatedOrder?.status).toBe(OrderStatus.Cancelled);
});

it("should acknowledge message", async () => {
  const { orderCancelledListenerInstance, eventData, eventMessage } =
    await setup();

  await orderCancelledListenerInstance.onMessage(eventData, eventMessage);

  expect(eventMessage.ack).toBeCalledTimes(1);
});

it("should reject event due to concurrency issue", async () => {
  const { orderCancelledListenerInstance, eventData, eventMessage, order } =
    await setup();

  eventData.version = 10;

  let error;
  try {
    await orderCancelledListenerInstance.onMessage(eventData, eventMessage);
  } catch (err) {
    error = err as unknown as Error;
  }

  expect(error).toBeDefined();
  expect(error?.message).toBe("Concurrency issue! wrong ticket version.");

  const updatedOrder = await Order.findById(eventData.id);
  expect(updatedOrder?.version).toBe(order.version);
  expect(updatedOrder?.status).toBe(order.status);

  expect(eventMessage.ack).not.toBeCalled();
});
