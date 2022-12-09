import mongoose from "mongoose";

export interface TransactionAttrs {
  orderId: string;
  stripeId: string;
}

export interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build: (attrs: TransactionAttrs) => TransactionDoc;
}

export interface TransactionDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}
