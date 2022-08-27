import mongoose from "mongoose";
import { UserAttrs, UserDoc, UserModel } from "../types/user.types";
import { Password } from "../utils/password.util";

mongoose.set("debug", true);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hash = await Password.hash(this.get("password"));

    this.set("password", hash);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
