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
  };
}

export interface TicketUpdatedEvent {
  subject: "ticket:updated";
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
