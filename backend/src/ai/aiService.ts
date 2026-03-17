import { env } from "../config/env.js";
import { openai } from "./openaiClient.js";

export async function generateMessage(params: { input: string; channel: "email" | "sms" | "push" | "inapp" }) {
  if (!openai) {
    return { message: params.input, model: "mock", notes: "OPENAI_API_KEY not configured" };
  }

  const resp = await openai.responses.create({
    model: env.openaiModel,
    input: [
      {
        role: "system",
        content:
          "You write short, friendly, non-spammy notification copy. Keep it concise. Do not include emojis unless the user input implies it.",
      },
      { role: "user", content: `Channel: ${params.channel}\nIntent: ${params.input}\nReturn ONLY the message.` },
    ],
  });

  const text = resp.output_text?.trim() || params.input;
  return { message: text, model: env.openaiModel };
}

export async function predictBestSendTime(params: { userLocalHourHistogram: number[] }) {
  // Histogram: 24 values, higher => more engagement at that hour.
  const maxIdx = params.userLocalHourHistogram.reduce((best, v, i, arr) => (v > arr[best] ? i : best), 0);
  const recommendedHour = (maxIdx + 23) % 24; // nudge 1 hour earlier
  return { recommendedHour, confidence: Math.min(0.95, 0.5 + params.userLocalHourHistogram[maxIdx] / 100) };
}

export async function detectSpam(params: { message: string; recentPerMinute: number }) {
  const heuristic = params.recentPerMinute > 10 || params.message.length > 240;
  if (!openai) {
    return { isSpam: heuristic, reason: heuristic ? "Heuristic spam rule triggered" : "OK" };
  }

  const resp = await openai.responses.create({
    model: env.openaiModel,
    input: [
      {
        role: "system",
        content:
          "You are a strict notification spam detector. Output JSON only: {\"isSpam\": boolean, \"reason\": string}.",
      },
      {
        role: "user",
        content: `Message: ${params.message}\nRecentPerMinute: ${params.recentPerMinute}\n`,
      },
    ],
  });

  const text = resp.output_text?.trim() || "";
  try {
    const parsed = JSON.parse(text);
    return { isSpam: !!parsed.isSpam, reason: String(parsed.reason ?? "n/a") };
  } catch {
    return { isSpam: heuristic, reason: "AI returned non-JSON; used heuristic" };
  }
}

export async function predictEngagement(params: { message: string; channel: string; userSegment?: string }) {
  const base = Math.max(5, Math.min(95, 40 + (params.channel === "push" ? 10 : 0) - Math.floor(params.message.length / 30)));
  if (!openai) return { score: base, model: "mock" };

  const resp = await openai.responses.create({
    model: env.openaiModel,
    input: [
      {
        role: "system",
        content:
          "Predict engagement probability (0-100). Output JSON only: {\"score\": number}. Use only the inputs provided.",
      },
      {
        role: "user",
        content: `Channel: ${params.channel}\nUserSegment: ${params.userSegment ?? "unknown"}\nMessage: ${params.message}\n`,
      },
    ],
  });

  const text = resp.output_text?.trim() || "";
  try {
    const parsed = JSON.parse(text);
    const score = Number(parsed.score);
    return { score: Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : base, model: env.openaiModel };
  } catch {
    return { score: base, model: env.openaiModel };
  }
}

