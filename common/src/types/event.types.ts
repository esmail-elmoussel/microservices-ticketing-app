import { OrderStatus } from "./order.types";

export interface Event {
  subject: string;
  data: any;
}

export interface TicketCreatedEvent {
  subject: "ticket:created";
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
  };
}

export interface TicketUpdatedEvent {
  subject: "ticket:updated";
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
  };
}

export interface OrderCreatedEvent {
  subject: "order:created";
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
    version: number;
  };
}

export interface OrderCancelledEvent {
  subject: "order:cancelled";
  data: {
    id: string;
    ticket: {
      id: string;
    };
    version: number;
  };
}

export interface OrderExpiredEvent {
  subject: "order:expired";
  data: {
    id: string;
  };
}
