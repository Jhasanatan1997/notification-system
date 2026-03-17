import { env } from "../config/env.js";

export type PushSendInput = {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
};

export async function sendPush(input: PushSendInput): Promise<{ provider: string; messageId?: string }> {
  if (!env.fcmProjectId || !env.fcmClientEmail || !env.fcmPrivateKey) {
    return { provider: "mock-fcm", messageId: `mock_${Date.now()}` };
  }

  const adminImport = await import("firebase-admin").catch(() => null);
  if (!adminImport) {
    throw new Error("firebase-admin not installed. Add firebase-admin to backend dependencies.");
  }

  if (adminImport.default.apps.length === 0) {
    adminImport.default.initializeApp({
      credential: adminImport.default.credential.cert({
        projectId: env.fcmProjectId,
        clientEmail: env.fcmClientEmail,
        privateKey: env.fcmPrivateKey,
      }),
    });
  }

  const messageId = await adminImport.default.messaging().send({
    token: input.token,
    notification: { title: input.title, body: input.body },
    data: input.data,
  });

  return { provider: "fcm", messageId };
}

