export const ORCHESTRATOR_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    answer: { type: "string", description: "Final answer to respond to the user." },
  },
  required: ["answer"],
  additionalProperties: false,
} as const; 