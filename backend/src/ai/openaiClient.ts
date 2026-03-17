import OpenAI from "openai";
import { env } from "../config/env.js";

export const openai = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

