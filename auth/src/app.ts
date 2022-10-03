import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";
import { loginRouter } from "./routes/login";
import { logoutRouter } from "./routes/logout";
import { registerRouter } from "./routes/register";
import { currentUserRouter } from "./routes/current-user";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandlerMiddleware } from "./middlewares/error-handler-middleware";
import { configs } from "./configs";

const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: configs.NODE_ENV !== "test",
  })
);

app.use(loginRouter);
app.use(logoutRouter);
app.use(registerRouter);
app.use(currentUserRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandlerMiddleware);

export { app };
