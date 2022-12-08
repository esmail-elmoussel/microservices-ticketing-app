import { OrderStatus } from "@esmailelmoussel/microservices-common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderAttrs, OrderDoc, OrderModel } from "../types/order.types";

const orderSchema = new mongoose.Schema<OrderAttrs>(
  {
    userId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
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

orderSchema.set("versionKey", "version");

orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = ({ id, ...rest }: OrderAttrs) => {
  return new Order({ _id: id, ...rest });
};

export const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
