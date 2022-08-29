import { Router } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { configs } from "../configs";
import { BadRequestError } from "../errors/bad-request-error";
import { requestValidationMiddleware } from "../middlewares/request-validation-middleware";
import { User } from "../models/user.model";

const router = Router();

router.post(
  "/api/users/register",
  body("email").isEmail().withMessage("invalid email!"),
  body("password").isString().isLength({ min: 3, max: 20 }),
  requestValidationMiddleware,
  async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already exists!");
    }

    const user = await User.build({ email, password });
    await user.save();

    const token = jwt.sign(
      { id: user.id, email: user.email },
      configs.JWT_SECRET
    );

    req.session = { token };

    return res.status(201).json(user);
  }
);

export { router as registerRouter };
