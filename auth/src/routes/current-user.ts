import { Router } from "express";
// import { User } from "../models/user.model";

const router = Router();

router.get("/api/users/current-user", async (req, res) => {
  // const users = await User.find({});

  return res.json({ user: "esmail", password: "kaka" });
});

export { router as currentUserRouter };
