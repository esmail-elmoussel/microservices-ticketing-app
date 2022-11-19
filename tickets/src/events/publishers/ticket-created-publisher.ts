import {
  BasePublisher,
  TicketCreatedEvent,
} from "@esmailelmoussel/microservices-common";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  readonly subject = "ticket:created";
}
