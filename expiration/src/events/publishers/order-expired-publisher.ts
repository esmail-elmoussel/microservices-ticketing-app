import {
  BasePublisher,
  OrderExpiredEvent,
} from "@esmailelmoussel/microservices-common";

export class OrderExpiredPublisher extends BasePublisher<OrderExpiredEvent> {
  readonly subject = "order:expired";
}
