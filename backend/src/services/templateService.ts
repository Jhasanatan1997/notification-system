import { TemplateModel } from "../models/Template.js";
import { NotFoundError } from "../utils/errors.js";

export async function getTemplate(type: string, channel: "email" | "sms" | "push" | "inapp") {
  const tpl = await TemplateModel.findOne({ type, channel }).lean();
  if (!tpl) throw new NotFoundError(`Template not found for type=${type} channel=${channel}`);
  return tpl;
}

export function renderTemplate(templateBody: string, vars: Record<string, unknown>): string {
  return templateBody.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_m, key) => {
    const v = (vars as any)[key];
    if (v === null || v === undefined) return "";
    return String(v);
  });
}

