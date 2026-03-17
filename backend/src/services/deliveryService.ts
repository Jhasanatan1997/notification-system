import { NotificationLogModel } from "../models/NotificationLog.js";
import { UserModel } from "../models/User.js";
import { getTemplate, renderTemplate } from "./templateService.js";
import { sendEmail } from "../providers/emailProvider.js";
import { sendSms } from "../providers/smsProvider.js";
import { sendPush } from "../providers/pushProvider.js";
import { deliverInApp } from "../providers/inAppProvider.js";

type Channel = "email" | "sms" | "push" | "inapp";

export async function deliverNotificationChannels(params: {
  notificationId: string;
  userId: string;
  type: string;
  channels: Channel[];
  payload: Record<string, unknown>;
  attempt: number; // 1-based
}) {
  const user = await UserModel.findById(params.userId).lean();
  if (!user) throw new Error("User not found for delivery");

  const results: Array<{ channel: Channel; ok: boolean; providerResponse?: any; error?: string }> = [];

  for (const channel of params.channels) {
    try {
      const tpl = await getTemplate(params.type, channel);
      const rendered = renderTemplate(tpl.templateBody, { ...params.payload, name: user.name, email: user.email });

      if (channel === "email") {
        const resp = await sendEmail({
          to: user.email,
          subject: params.type.replace(/_/g, " "),
          body: rendered,
        });
        await NotificationLogModel.create({
          notificationId: params.notificationId,
          channel,
          status: "SENT",
          retryCount: params.attempt - 1,
          providerResponse: resp,
        });
        results.push({ channel, ok: true, providerResponse: resp });
      } else if (channel === "sms") {
        if (!user.phone) throw new Error("User has no phone");
        const resp = await sendSms({ to: user.phone, body: rendered });
        await NotificationLogModel.create({
          notificationId: params.notificationId,
          channel,
          status: "SENT",
          retryCount: params.attempt - 1,
          providerResponse: resp,
        });
        results.push({ channel, ok: true, providerResponse: resp });
      } else if (channel === "push") {
        if (!user.pushToken) throw new Error("User has no push token");
        const resp = await sendPush({
          token: user.pushToken,
          title: "Notification",
          body: rendered,
          data: Object.fromEntries(Object.entries(params.payload).map(([k, v]) => [k, String(v)])),
        });
        await NotificationLogModel.create({
          notificationId: params.notificationId,
          channel,
          status: "SENT",
          retryCount: params.attempt - 1,
          providerResponse: resp,
        });
        results.push({ channel, ok: true, providerResponse: resp });
      } else if (channel === "inapp") {
        const resp = await deliverInApp({
          notificationId: params.notificationId,
          body: rendered,
          retryCount: params.attempt - 1,
        });
        results.push({ channel, ok: true, providerResponse: resp });
      }
    } catch (e: any) {
      await NotificationLogModel.create({
        notificationId: params.notificationId,
        channel,
        status: "FAILED",
        retryCount: params.attempt - 1,
        errorMessage: e?.message ?? "Unknown error",
      });
      results.push({ channel, ok: false, error: e?.message ?? "Unknown error" });
      // Fail fast so BullMQ retries with exponential backoff
      throw e;
    }
  }

  return results;
}

