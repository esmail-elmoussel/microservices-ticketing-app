import mongoose from "mongoose";
import {
  TransactionAttrs,
  TransactionDoc,
  TransactionModel,
} from "../types/transaction.types";

const transactionSchema = new mongoose.Schema<TransactionAttrs>(
  {
    orderId: {
      type: String,
      required: true,
    },

    stripeId: {
      type: String,
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

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
};

export const Transaction = mongoose.model<TransactionDoc, TransactionModel>(
  "Transaction",
  transactionSchema
);
