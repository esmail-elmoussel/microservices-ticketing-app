import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket.model";
import { natsWrapper } from "../../nats-wrapper";

describe("Edit ticket", () => {
  it("Should hit the end point successfully", async () => {
    const response = await request(app).put("/api/tickets");

    expect(response.status).not.toEqual(404);
  });

  it("Should fail due to un-authorized user", async () => {
    await request(app).put("/api/tickets").expect(401);
  });

  it("Should pass authorization", async () => {
    const cookie = global.register();

    const response = await request(app)
      .put("/api/tickets")
      .set("Cookie", cookie);

    expect(response.status).not.toEqual(401);
  });

  describe("Title validation", () => {
    it("Should fail due to title validation error", async () => {
      const cookie = global.register();

      const response = await request(app)
        .put("/api/tickets")
        .send({ title: "", price: 5765, ticketId: "6369d2937246740ae7556478" })
        .set("Cookie", cookie);

      expect(response.body.errors[0].field).toEqual("title");
    });

    it("Should fail due to title validation error", async () => {
      const cookie = global.register();

      const response = await request(app)
        .put("/api/tickets")
        .send({
          title: 2376,
          price: 5765,
          ticketId: "6369d2937246740ae7556478",
        })
        .set("Cookie", cookie);

      expect(response.body.errors[0].field).toEqual("title");
    });
  });

  describe("Price validation", () => {
    it("Should fail due to price validation error", async () => {
      const cookie = global.register();

      const response = await request(app)
        .put("/api/tickets")
        .send({
          title: "JKAHSD",
          price: "",
          ticketId: "6369d2937246740ae7556478",
        })
        .set("Cookie", cookie);

      expect(response.body.errors[0].field).toEqual("price");
    });

    it("Should fail due to price validation error", async () => {
      const cookie = global.register();

      const response = await request(app)
        .put("/api/tickets")
        .send({
          title: "ASDASD",
          price: -10,
          ticketId: "6369d2937246740ae7556478",
        })
        .set("Cookie", cookie);

      expect(response.body.errors[0].field).toEqual("price");
    });
  });

  it("Should fail due to tickeId not provided", async () => {
    const cookie = global.register();

    const response = await request(app)
      .put("/api/tickets")
      .send({ title: "asdas" })
      .set("Cookie", cookie);

    expect(response.body.errors[0].field).toEqual("ticketId");
  });

  it("Should pass validation", async () => {
    const cookie = global.register();

    const response = await request(app)
      .put("/api/tickets")
      .send({ title: "asdas", ticketId: "6369d2937246740ae7556478" })
      .set("Cookie", cookie);

    expect(response.status).not.toEqual(400);
  });

  it("Should throw not found error", async () => {
    const cookie = global.register();

    const response = await request(app)
      .put("/api/tickets")
      .send({ title: "asdas", ticketId: "6369d2937246740ae7556478" })
      .set("Cookie", cookie);

    expect(response.status).toEqual(404);
  });

  it("Should fail due to wrong user", async () => {
    const createTicketResponse = await request(app)
      .post("/api/tickets/")
      .set("Cookie", global.register())
      .send({
        title: "Some Ticket",
        price: 100,
      });

    expect(createTicketResponse.status).toBe(201);

    const updateTicketResponse = await request(app)
      .put("/api/tickets")
      .send({
        ticketId: createTicketResponse.body.id,
        title: "Asdas",
      })
      .set("Cookie", global.register());

    expect(updateTicketResponse.status).toEqual(401);
  });

  it("Should update title and price", async () => {
    const cookie = global.register();
    const ticket = {
      title: "Some Ticket",
      price: 100,
    };

    const createTicketResponse = await request(app)
      .post("/api/tickets/")
      .set("Cookie", cookie)
      .send(ticket);

    expect(createTicketResponse.status).toBe(201);
    expect(createTicketResponse.body.title).toBe(ticket.title);
    expect(createTicketResponse.body.price).toBe(ticket.price);

    const updatedTitle = "UPDATED TITLE";
    const updatedPrice = 200;

    const updateTicketResponse = await request(app)
      .put("/api/tickets")
      .send({
        ticketId: createTicketResponse.body.id,
        title: updatedTitle,
        price: updatedPrice,
      })
      .set("Cookie", cookie);

    expect(updateTicketResponse.status).toEqual(200);
    expect(updateTicketResponse.body.title).toEqual(updatedTitle);
    expect(updateTicketResponse.body.price).toEqual(updatedPrice);
  });

  it("Should publish an event successfully", async () => {
    const cookie = global.register();
    const ticket = {
      title: "Some Ticket",
      price: 100,
    };

    const createTicketResponse = await request(app)
      .post("/api/tickets/")
      .set("Cookie", cookie)
      .send(ticket);

    const updatedTitle = "UPDATED TITLE";
    const updatedPrice = 200;

    await request(app)
      .put("/api/tickets")
      .send({
        ticketId: createTicketResponse.body.id,
        title: updatedTitle,
        price: updatedPrice,
      })
      .set("Cookie", cookie);

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
  });

  it("Should throw error due to ticket is reserved", async () => {
    const cookie = global.register();

    const price = 100;
    const createTicketResponse = await request(app)
      .post("/api/tickets/")
      .set("Cookie", cookie)
      .send({
        title: "Some Ticket",
        price,
      });

    const ticket = await Ticket.findById(createTicketResponse.body.id);

    ticket?.set({ orderId: new mongoose.Types.ObjectId().toString() });

    await ticket?.save();

    const updatedPrice = 200;

    const response = await request(app)
      .put("/api/tickets")
      .send({
        ticketId: createTicketResponse.body.id,
        price: updatedPrice,
      })
      .set("Cookie", cookie)
      .expect(400);

    const refetchedTicket = await Ticket.findById(createTicketResponse.body.id);

    expect(refetchedTicket?.price).toBe(price);
    expect(refetchedTicket?.price).not.toBe(updatedPrice);
  });
});
