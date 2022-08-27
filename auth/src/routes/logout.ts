import { Router } from "express";

const router = Router();

router.post("/api/users/logout", (req, res) => {
  return res.send("logout!");
});

export { router as logoutRouter };
