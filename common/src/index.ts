export const authorName: string = "Esmail Elmoussel";

export * from "./errors";
export * from "./middlewares";
export * from "./events";
import {
  DecodedToken,
  Event,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from "./types";

export { DecodedToken, Event, TicketCreatedEvent, TicketUpdatedEvent };
