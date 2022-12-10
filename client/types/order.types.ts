import { OrderStatus } from "@esmailelmoussel/microservices-common";
import { Ticket } from "./ticket.types";

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: Ticket;
  version: number;
}
