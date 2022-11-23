import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket.model";
import { natsWrapper } from "../../nats-wrapper";

describe("Create ticket", () => {
  it("Should hit the end point successfully", async () => {
    const response = await request(app).post("/api/orders");

    expect(response.status).not.toEqual(404);
  });

  it("Should fail due to un-authorized user", async () => {
    await request(app).post("/api/orders").expect(401);
  });

  it("Should pass authorization", async () => {
    const cookie = global.register();

    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie);

    expect(response.status).not.toEqual(401);
  });

  describe("Title validation", () => {
    it("Should fail due to title not provided", async () => {
      const cookie = global.register();

      await request(app).post("/api/orders").set("Cookie", cookie).expect(400);
    });

    it("Should fail due to title validation error", async () => {
      const cookie = global.register();

      await request(app)
        .post("/api/orders")
        .send({ title: 5765 })
        .set("Cookie", cookie)
        .expect(400);
    });
  });

  describe("Price validation", () => {
    it("Should fail due to price not provided", async () => {
      const cookie = global.register();

      await request(app)
        .post("/api/orders")
        .send({ title: "Some Title" })
        .set("Cookie", cookie)
        .expect(400);
    });

    it("Should fail due to negative number for price", async () => {
      const cookie = global.register();

      await request(app)
        .post("/api/orders")
        .send({ title: "Some Title", price: -10 })
        .set("Cookie", cookie)
        .expect(400);
    });

    it("Should fail due to price validation error", async () => {
      const cookie = global.register();

      await request(app)
        .post("/api/orders")
        .send({ title: "Some Title", price: "wrong type!" })
        .set("Cookie", cookie)
        .expect(400);
    });
  });

  it("Should pass validation", async () => {
    const cookie = global.register();

    const response = await request(app)
      .post("/api/orders")
      .send({ title: "Some Title", price: 200 })
      .set("Cookie", cookie);

    expect(response.status).not.toEqual(400);
  });

  it("Should create ticket", async () => {
    const prevTicketsCount = await Ticket.countDocuments();

    const cookie = global.register();

    const response = await request(app)
      .post("/api/orders")
      .send({ title: "Some Title", price: 200 })
      .set("Cookie", cookie);

    expect(response.status).toEqual(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.userId).toBeDefined();

    const newTicketsCount = await Ticket.countDocuments();
    expect(newTicketsCount).toBe(prevTicketsCount + 1);
  });

  it("Should publish an event successfully", async () => {
    const cookie = global.register();

    await request(app)
      .post("/api/orders")
      .send({ title: "Some Title", price: 200 })
      .set("Cookie", cookie);

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  });
});
