export interface Event {
  subject: string;
  data: any;
}

export interface PostCreatedEvent {
  subject: "post:created";
  data: {
    id: string;
    title: string;
    userId: string;
  };
}
