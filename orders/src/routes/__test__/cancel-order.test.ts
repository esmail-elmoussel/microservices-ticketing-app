import { OrderStatus } from "@esmailelmoussel/microservices-common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order.model";
import { Ticket } from "../../models/ticket.model";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as cancelled", async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.register();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .put(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.register();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .put(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
