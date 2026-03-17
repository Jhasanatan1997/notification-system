import crypto from "crypto";

export function stableHash(input: unknown): string {
  const raw = typeof input === "string" ? input : JSON.stringify(input);
  return crypto.createHash("sha256").update(raw).digest("hex");
}

