import {
  BasePublisher,
  TicketUpdatedEvent,
} from "@esmailelmoussel/microservices-common";

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
  readonly subject = "ticket:updated";
}
