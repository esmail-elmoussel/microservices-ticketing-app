import { Router } from "express";

const router = Router();

router.get("/api/tickets", async (req, res) => {
  return res.send("tickets");
});

export { router as getTickets };
