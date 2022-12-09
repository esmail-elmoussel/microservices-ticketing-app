import {
  BasePublisher,
  PaymentCreatedEvent,
} from "@esmailelmoussel/microservices-common";

export class PaymentCreatedPublisher extends BasePublisher<PaymentCreatedEvent> {
  readonly subject = "payment:created";
}
