import { OrderStatus } from "@esmailelmoussel/microservices-common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order.model";
import { stripe } from "../../stripe";

const createOrder = async () => {
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toString(),
    price: 1,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toString(),
    version: 0,
  });

  await order.save();

  return order;
};

describe("Purchase Order", () => {
  it("should throw authentication error", async () => {
    await request(app).post("/api/payments").expect(401);
  });

  it("should validate request body", async () => {
    await request(app)
      .post("/api/payments")
      .set("Cookie", global.register())
      .send({})
      .expect(400);
  });

  it("should validate order id to be mongo id", async () => {
    await request(app)
      .post("/api/payments")
      .set("Cookie", global.register())
      .send({ orderId: "inValidObjectId", cardToken: "someText" })
      .expect(400);
  });

  it("should validate that order exists", async () => {
    const response = await request(app)
      .post("/api/payments")
      .set("Cookie", global.register())
      .send({ orderId: new mongoose.Types.ObjectId(), cardToken: "someText" })
      .expect(400);

    expect(response.body.errors[0].message).toBe("Order not found!");
  });

  it("should validate that user owns the order", async () => {
    const order = await createOrder();

    const response = await request(app)
      .post("/api/payments")
      .set("Cookie", global.register())
      .send({ orderId: order.id, cardToken: "someText" })
      .expect(401);

    expect(response.body.errors[0].message).toBe(
      "Can not purchase others orders!"
    );
  });

  it("should validate order status", async () => {
    const order = await createOrder();

    const updatedOrder = await Order.findById(order.id);

    updatedOrder!.status = OrderStatus.Cancelled;

    await updatedOrder?.save();

    const response = await request(app)
      .post("/api/payments")
      .set("Cookie", global.register(order.userId))
      .send({ orderId: order.id, cardToken: "someText" })
      .expect(400);

    expect(response.body.errors[0].message).toBe("Order cancelled!");
  });

  it("should call stripe api and return transaction record", async () => {
    const order = await createOrder();

    const response = await request(app)
      .post("/api/payments")
      .set("Cookie", global.register(order.userId))
      .send({ orderId: order.id, cardToken: "tok_visa" })
      .expect(200);

    expect(stripe.charges.create).toBeCalledTimes(1);

    const stripePayload = (stripe.charges.create as jest.Mock).mock.lastCall[0];

    expect(stripePayload.amount).toBe(order.price * 100);
    expect(stripePayload.source).toBe("tok_visa");

    expect(response.body.id).toBeDefined();
    expect(response.body.stripeId).toBeDefined();
    expect(response.body.orderId).toBeDefined();
  });
});
