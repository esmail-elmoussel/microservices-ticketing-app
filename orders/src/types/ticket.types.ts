import mongoose from "mongoose";

export interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketModel extends mongoose.Model<TicketDoc> {
  build: (attrs: TicketAttrs) => TicketDoc;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved: () => Promise<boolean>;
}
