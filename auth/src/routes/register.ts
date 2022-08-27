import { Router } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user.model";

const router = Router();

router.post(
  "/api/users/register",
  body("email").isEmail().withMessage("invalid email!"),
  body("password").isString().isLength({ min: 3, max: 20 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already exists!");
    }

    const user = await User.build({ email, password });
    await user.save();

    return res.status(201).json(user);
  }
);

export { router as registerRouter };
