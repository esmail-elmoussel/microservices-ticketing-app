import {
  BaseListener,
  OrderCreatedEvent,
} from "@esmailelmoussel/microservices-common";
import { Message } from "node-nats-streaming";
import { constants } from "../../constants";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = "order:created";

  queueGroup = constants.QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    console.log(data);
  }
}
