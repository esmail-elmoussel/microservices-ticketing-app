import {
  BadRequestError,
  requestValidationMiddleware,
} from "@esmailelmoussel/microservices-common";
import { Router } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { configs } from "../configs";
import { User } from "../models/user.model";
import { Password } from "../utils/password.util";

const router = Router();

router.post(
  "/api/users/login",
  body("email").isEmail().withMessage("invalid email!"),
  body("password").isString().notEmpty(),
  requestValidationMiddleware,
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("user does not exist!");
    }

    const isCorrectPassword = await Password.compare(password, user.password);

    if (!isCorrectPassword) {
      throw new BadRequestError("wrong password!");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      configs.JWT_SECRET
    );

    req.session = { token };

    return res.send(user);
  }
);

export { router as loginRouter };
