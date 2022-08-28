import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";
import { loginRouter } from "./routes/login";
import { logoutRouter } from "./routes/logout";
import { registerRouter } from "./routes/register";
import { currentUserRouter } from "./routes/current-user";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import mongoose from "mongoose";

const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(loginRouter);
app.use(logoutRouter);
app.use(registerRouter);
app.use(currentUserRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017");
    console.log("Database connected successfully!");

    app.listen(3000, () => {
      console.log("Auth service listening on port 3000!");
    });
  } catch (err) {
    console.error("Error connecting to database! ", err);
  }
};

startServer();
