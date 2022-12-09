import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "express-async-errors";

import {
  errorHandlerMiddleware,
  NotFoundError,
} from "@esmailelmoussel/microservices-common";
import { purchaseOrder } from "./routes/purchase-order";

const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, // handle http requests
  })
);

app.use(purchaseOrder);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandlerMiddleware);

export { app };
