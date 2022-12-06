import { configs } from "./configs";
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

    console.info("Nats connected successfully!");
  } catch (err) {
    console.error(err);
  }
};

startServer();
