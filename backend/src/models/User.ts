import mongoose, { Schema } from "mongoose";

export type UserDoc = {
  name: string;
  email: string;
  phone?: string;
  pushToken?: string;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    pushToken: { type: String },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<UserDoc>("User", UserSchema);

