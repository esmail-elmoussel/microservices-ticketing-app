import { Router } from "express";

const router = Router();

router.post("/api/users/login", (req, res) => {
  return res.send("login!");
});

export { router as loginRouter };
