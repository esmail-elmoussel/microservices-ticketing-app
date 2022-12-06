import Queue from "bull";
import { configs } from "../configs";
import { OrderExpiredPublisher } from "../events";
import { natsWrapper } from "../nats-wrapper";

interface OrderExpirationQueuePayload {
  orderId: string;
}

const orderExpirationQueue = new Queue<OrderExpirationQueuePayload>(
  "order-expiration-queue",
  {
    redis: {
      host: configs.REDIS_HOST,
    },
  }
);

orderExpirationQueue.process(async (job) => {
  console.log(
    "Processing order-expiration-queue with data: ",
    JSON.stringify(job.data)
  );

  await new OrderExpiredPublisher(natsWrapper.client).publish({
    id: job.data.orderId,
  });
});

export { orderExpirationQueue };
