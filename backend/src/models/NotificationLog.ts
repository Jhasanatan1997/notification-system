import mongoose, { Schema, Types } from "mongoose";

export type NotificationLogStatus = "SENT" | "FAILED" | "RETRYING";

export type NotificationLogDoc = {
  notificationId: Types.ObjectId;
  channel: "email" | "sms" | "push" | "inapp";
  status: NotificationLogStatus;
  retryCount: number;
  providerResponse?: Record<string, unknown>;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
};

const NotificationLogSchema = new Schema<NotificationLogDoc>(
  {
    notificationId: { type: Schema.Types.ObjectId, ref: "Notification", required: true, index: true },
    channel: { type: String, required: true, enum: ["email", "sms", "push", "inapp"], index: true },
    status: { type: String, required: true, enum: ["SENT", "FAILED", "RETRYING"], index: true },
    retryCount: { type: Number, required: true, default: 0 },
    providerResponse: { type: Schema.Types.Mixed },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

NotificationLogSchema.index({ notificationId: 1, channel: 1, createdAt: -1 });

export const NotificationLogModel = mongoose.model<NotificationLogDoc>("NotificationLog", NotificationLogSchema);

