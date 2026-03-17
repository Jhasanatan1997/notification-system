import mongoose, { Schema } from "mongoose";

export type TemplateDoc = {
  type: string;
  channel: "email" | "sms" | "push" | "inapp";
  templateBody: string;
  createdAt: Date;
  updatedAt: Date;
};

const TemplateSchema = new Schema<TemplateDoc>(
  {
    type: { type: String, required: true, index: true },
    channel: { type: String, required: true, enum: ["email", "sms", "push", "inapp"], index: true },
    templateBody: { type: String, required: true },
  },
  { timestamps: true }
);

TemplateSchema.index({ type: 1, channel: 1 }, { unique: true });

export const TemplateModel = mongoose.model<TemplateDoc>("Template", TemplateSchema);

