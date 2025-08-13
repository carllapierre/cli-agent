import dotenv from "dotenv";
import { setDefaultOpenAIKey } from "@openai/agents-openai";

import { getRuntimeConfig } from "@/config/env.js";
import { IoService } from "@/services/ioService.js";
import { MainWorkflow } from "@/workflow/mainWorkflow.js";

dotenv.config();

const { apiKey } = getRuntimeConfig();
if (!apiKey) {
  console.error("Missing OPENAI_API_KEY in .env");
  process.exit(1);
}

setDefaultOpenAIKey(apiKey);

const workflow = new MainWorkflow();
const io = new IoService(workflow);
await io.start(); 