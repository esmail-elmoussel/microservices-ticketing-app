import {
  BasePublisher,
  OrderCancelledEvent,
} from "@esmailelmoussel/microservices-common";

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
  readonly subject = "order:cancelled";
}
