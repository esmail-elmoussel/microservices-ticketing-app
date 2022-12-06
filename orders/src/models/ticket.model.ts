import { OrderStatus } from "@esmailelmoussel/microservices-common";
import mongoose from "mongoose";
import { TicketAttrs, TicketDoc, TicketModel } from "../types/ticket.types";
import { Order } from "./order.model";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = ({ id, ...rest }: TicketAttrs) => {
  return new Ticket({ _id: id, ...rest });
};

ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return Boolean(existingOrder);
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  "Ticket",
  ticketSchema
);
