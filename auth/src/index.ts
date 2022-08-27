import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import { loginRouter } from "./routes/login";
import { logoutRouter } from "./routes/logout";
import { registerRouter } from "./routes/register";
import { currentUserRouter } from "./routes/current-user";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";

const app = express();

app.use(json());
app.use(loginRouter);
app.use(logoutRouter);
app.use(registerRouter);
app.use(currentUserRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Auth service listening on port 3000!");
});
