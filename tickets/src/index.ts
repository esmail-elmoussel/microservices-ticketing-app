import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { app } from "./app";
import { configs } from "./configs";
import { natsWrapper } from "./nats-wrapper";

const startServer = async () => {
  try {
    await mongoose.connect(configs.MONGO_URI);

    console.info("Database connected successfully!");

    await natsWrapper.connect(
      "ticketing",
      randomBytes(4).toString("hex"),
      "http://nats-srv:4222"
    );

    natsWrapper.client.on("close", () => {
      process.exit();
    });

    console.info("Nats connected successfully!");

    app.listen(3000, () => {
      console.info("Tickets service listening on port 3000!");
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();
