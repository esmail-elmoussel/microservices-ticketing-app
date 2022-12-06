import { configs } from "./configs";
import { OrderCreatedListener } from "./events";
import { natsWrapper } from "./nats-wrapper";

const startServer = async () => {
  try {
    await natsWrapper.connect(
      configs.NATS_CLUSTER_ID,
      configs.NATS_CLIENT_ID,
      configs.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      process.exit();
    });

    new OrderCreatedListener(natsWrapper.client).listen();

    console.info("Nats connected successfully!");
  } catch (err) {
    console.error(err);
  }
};

startServer();
