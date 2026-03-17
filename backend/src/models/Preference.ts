import mongoose, { Schema, Types } from "mongoose";

export type PreferenceDoc = {
  userId: Types.ObjectId;
  notificationType: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const PreferenceSchema = new Schema<PreferenceDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    notificationType: { type: String, required: true, index: true },
    emailEnabled: { type: Boolean, required: true, default: true },
    smsEnabled: { type: Boolean, required: true, default: false },
    pushEnabled: { type: Boolean, required: true, default: true },
    inAppEnabled: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

PreferenceSchema.index({ userId: 1, notificationType: 1 }, { unique: true });

export const PreferenceModel = mongoose.model<PreferenceDoc>("Preference", PreferenceSchema);

