import mongoose, { Schema, Types } from "mongoose";

export type NotificationStatus = "PENDING" | "QUEUED" | "PROCESSING" | "SENT" | "FAILED";

export type NotificationDoc = {
  userId: Types.ObjectId;
  type: string;
  channels: Array<"email" | "sms" | "push" | "inapp">;
  payload: Record<string, unknown>;
  status: NotificationStatus;
  scheduledAt?: Date;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
};

const NotificationSchema = new Schema<NotificationDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true, index: true },
    channels: {
      type: [String],
      required: true,
      enum: ["email", "sms", "push", "inapp"],
      validate: [(v: unknown[]) => Array.isArray(v) && v.length > 0, "channels must be non-empty"],
    },
    payload: { type: Schema.Types.Mixed, required: true },
    status: { type: String, required: true, enum: ["PENDING", "QUEUED", "PROCESSING", "SENT", "FAILED"], index: true },
    scheduledAt: { type: Date },
    idempotencyKey: { type: String, required: true, index: true, unique: true },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<NotificationDoc>("Notification", NotificationSchema);

