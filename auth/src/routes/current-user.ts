import { Router } from "express";
import jwt from "jsonwebtoken";
import { configs } from "../configs";
import { User } from "../models/user.model";

const router = Router();

router.get("/api/users/current-user", async (req, res) => {
  const { token } = req.session as { token: string };

  const decodedToken = jwt.verify(token, configs.JWT_SECRET) as {
    id: string;
    email: string;
  };

  const user = await User.findById(decodedToken.id);

  return res.json(user);
});

export { router as currentUserRouter };
