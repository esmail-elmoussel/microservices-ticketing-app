import mongoose from "mongoose";
import { Ticket } from "../ticket.model";

const createNewTicket = async () => {
  const ticket = Ticket.build({
    title: "New Ticket",
    price: 10,
    userId: new mongoose.Types.ObjectId().toString(),
  });

  await ticket.save();

  return ticket;
};

describe("Optimistic concurrency control", () => {
  it("should have initial version as 0", async () => {
    const ticket = await createNewTicket();

    expect(ticket.version).toBe(0);
  });

  it("should update version number", async () => {
    const ticket = await createNewTicket();

    expect(ticket.version).toBe(0);

    ticket.set({ price: 20 });
    await ticket.save();

    expect(ticket.version).toBe(1);

    ticket.set({ price: 20 });
    await ticket.save();

    expect(ticket.version).toBe(2);
  });
});
