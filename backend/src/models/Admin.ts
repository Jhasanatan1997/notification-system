import mongoose, { Schema } from "mongoose";

export type AdminDoc = {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

const AdminSchema = new Schema<AdminDoc>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export const AdminModel = mongoose.model<AdminDoc>("Admin", AdminSchema);

