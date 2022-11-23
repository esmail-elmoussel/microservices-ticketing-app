import { OrderStatus } from "@esmailelmoussel/microservices-common";
import mongoose, { ObjectId, PopulatedDoc } from "mongoose";
import { TicketDoc } from "./ticket.types";

export interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc | ObjectId;
}

export interface OrderModel extends mongoose.Model<OrderDoc> {
  build: (attrs: OrderAttrs) => OrderDoc;
}

export interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: PopulatedDoc<TicketDoc>;
}
