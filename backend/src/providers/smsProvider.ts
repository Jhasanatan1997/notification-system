import { env } from "../config/env.js";

export type SmsSendInput = {
  to: string;
  body: string;
};

export async function sendSms(input: SmsSendInput): Promise<{ provider: string; sid?: string }> {
  if (!env.twilioAccountSid || !env.twilioAuthToken || !env.twilioFromPhone) {
    return { provider: "mock-twilio", sid: `mock_${Date.now()}` };
  }

  const twilioImport = await import("twilio").catch(() => null);
  if (!twilioImport) {
    throw new Error("Twilio SDK not installed. Add twilio to backend dependencies.");
  }

  const client = twilioImport.default(env.twilioAccountSid, env.twilioAuthToken);
  const msg = await client.messages.create({
    from: env.twilioFromPhone,
    to: input.to,
    body: input.body,
  });

  return { provider: "twilio", sid: msg.sid };
}

