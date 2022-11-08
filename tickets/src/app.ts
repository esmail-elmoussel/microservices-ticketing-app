import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";

import {
  errorHandlerMiddleware,
  NotFoundError,
} from "@esmailelmoussel/microservices-common";
import { getTickets } from "./routes/get-tickets";
import { createTicket } from "./routes/create-ticket";

const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: configs.NODE_ENV !== "test",
    secure: false, // handle http requests
  })
);

app.use(getTickets);
app.use(createTicket);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandlerMiddleware);

export { app };
