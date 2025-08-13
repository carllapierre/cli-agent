import { DEFAULT_AGENT_NAME, DEFAULT_MODEL_NAME } from "@/config/constants.js";

export type RuntimeConfig = {
  apiKey: string | undefined;
  modelName: string;
  agentName: string;
};

export function getRuntimeConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  return {
    apiKey: env.OPENAI_API_KEY,
    modelName: env.OPENAI_MODEL || DEFAULT_MODEL_NAME,
    agentName: env.AGENT_NAME || DEFAULT_AGENT_NAME,
  };
} 