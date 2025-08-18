import { DEFAULT_AGENT_NAME, DEFAULT_MODEL_NAME } from "@/config/constants.js";

export type RuntimeConfig = {
  apiKey: string | undefined;
  modelName: string;
  agentName: string;
  langfuse?: {
    secretKey: string | undefined;
    publicKey: string | undefined;
    baseUrl: string;
    enabled: boolean;
  };
};

export function getRuntimeConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  return {
    apiKey: env.OPENAI_API_KEY,
    modelName: env.OPENAI_MODEL || DEFAULT_MODEL_NAME,
    agentName: env.AGENT_NAME || DEFAULT_AGENT_NAME,
    langfuse: {
      secretKey: env.LANGFUSE_SECRET_KEY,
      publicKey: env.LANGFUSE_PUBLIC_KEY,
      baseUrl: env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com',
      enabled: !!(env.LANGFUSE_SECRET_KEY && env.LANGFUSE_PUBLIC_KEY),
    },
  };
} 