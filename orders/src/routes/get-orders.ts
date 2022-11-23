import { Router } from "express";
import { Ticket } from "../models/ticket.model";

const router = Router();

router.get("/api/orders", async (req, res) => {
  const tickets = await Ticket.find();

  return res.json(tickets);
});

export { router as getOrders };
