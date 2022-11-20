import mongoose from "mongoose";
import { app } from "./app";
import { configs } from "./configs";
import { natsWrapper } from "./nats-wrapper";

const startServer = async () => {
  try {
    await mongoose.connect(configs.MONGO_URI);

    console.info("Database connected successfully!");

    await natsWrapper.connect(
      configs.NATS_CLUSTER_ID,
      configs.NATS_CLIENT_ID,
      configs.NATS_URL
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
