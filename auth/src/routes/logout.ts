import { Router } from "express";

const router = Router();

router.post("/api/users/logout", (req, res) => {
  req.session = null;

  return res.end();
});

export { router as logoutRouter };
