import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export interface UserAttrs {
  email: string;
  password: string;
}

export interface UserModel extends mongoose.Model<UserDoc> {
  build: (attrs: UserAttrs) => UserDoc;
}

export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

export interface DecodedToken extends jwt.JwtPayload {
  id: string;
  email: string;
}
