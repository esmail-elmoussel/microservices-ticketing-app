import { Router } from "express";
import { User } from "../models/user.model";

const router = Router();

router.get("/api/users/current-user", async (req, res) => {
  const users = await User.find({});

  return res.json(users);
});

export { router as currentUserRouter };
