import { z } from "zod";
import { NotificationModel } from "../models/Notification.js";
import { UserModel } from "../models/User.js";
import { ValidationError } from "../utils/errors.js";
import { stableHash } from "../utils/idempotency.js";
import { getChannelPreferences } from "./preferenceService.js";
import { enforceUserRateLimit } from "./rateLimitService.js";
import { enqueueNotificationJob } from "../queues/notificationQueue.js";

export const CreateNotificationSchema = z.object({
  userId: z.string().min(1),
  type: z.string().min(1),
  channels: z.array(z.enum(["email", "sms", "push", "inapp"])).min(1),
  data: z.record(z.any()).default({}),
  scheduledAt: z.string().datetime().optional(),
  idempotencyKey: z.string().min(1).optional(),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;

function filterChannelsByPrefs(
  requested: Array<"email" | "sms" | "push" | "inapp">,
  prefs: { email: boolean; sms: boolean; push: boolean; inapp: boolean }
) {
  return requested.filter((c) => (c === "email" ? prefs.email : c === "sms" ? prefs.sms : c === "push" ? prefs.push : prefs.inapp));
}

export async function createNotification(input: CreateNotificationInput) {
  const user = await UserModel.findById(input.userId).lean();
  if (!user) throw new ValidationError("Unknown userId");

  await enforceUserRateLimit(input.userId);

  const prefs = await getChannelPreferences(input.userId, input.type);
  const finalChannels = filterChannelsByPrefs(input.channels, prefs);
  if (finalChannels.length === 0) {
    throw new ValidationError("All requested channels are disabled by user preferences");
  }

  const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : undefined;
  const idempotencyKey =
    input.idempotencyKey ??
    stableHash({
      userId: input.userId,
      type: input.type,
      channels: finalChannels,
      data: input.data,
      scheduledAt: scheduledAt?.toISOString(),
    });

  const created = await NotificationModel.findOneAndUpdate(
    { idempotencyKey },
    {
      $setOnInsert: {
        userId: input.userId,
        type: input.type,
        channels: finalChannels,
        payload: input.data,
        status: "PENDING",
        scheduledAt,
        idempotencyKey,
      },
    },
    { new: true, upsert: true }
  );

  if (created.status === "PENDING") {
    created.status = "QUEUED";
    await created.save();
    await enqueueNotificationJob({ notificationId: created._id.toString(), scheduledAt });
  }

  return created.toObject();
}

export async function createBatchNotifications(inputs: CreateNotificationInput[]) {
  const results = [];
  for (const i of inputs) {
    results.push(await createNotification(i));
  }
  return results;
}

