import {
  BasePublisher,
  OrderCreatedEvent,
} from "@esmailelmoussel/microservices-common";

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
  readonly subject = "order:created";
}
