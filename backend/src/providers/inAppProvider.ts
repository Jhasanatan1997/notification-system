import { NotificationLogModel } from "../models/NotificationLog.js";

export async function deliverInApp(params: {
  notificationId: string;
  body: string;
  retryCount: number;
}) {
  // For in-app, "delivery" means the notification is available in DB.
  // We still log it for audit/history purposes.
  const log = await NotificationLogModel.create({
    notificationId: params.notificationId,
    channel: "inapp",
    status: "SENT",
    retryCount: params.retryCount,
    providerResponse: { stored: true, length: params.body.length },
  });
  return log.toObject();
}

