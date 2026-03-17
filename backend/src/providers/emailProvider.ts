import { env } from "../config/env.js";

export type EmailSendInput = {
  to: string;
  subject: string;
  body: string;
};

export async function sendEmail(input: EmailSendInput): Promise<{ provider: string; id?: string }> {
  if (!env.sendgridApiKey) {
    return { provider: "mock-sendgrid", id: `mock_${Date.now()}` };
  }

  // Lazy import so local dev works without config
  const sg = await import("@sendgrid/mail").catch(() => null);
  if (!sg) {
    throw new Error("SendGrid SDK not installed. Add @sendgrid/mail to backend dependencies.");
  }

  sg.default.setApiKey(env.sendgridApiKey);
  const resp = await sg.default.send({
    to: input.to,
    from: env.sendgridFromEmail,
    subject: input.subject,
    text: input.body,
  });

  return { provider: "sendgrid", id: (resp as any)?.[0]?.headers?.["x-message-id"] };
}

