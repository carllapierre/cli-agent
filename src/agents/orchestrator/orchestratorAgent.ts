import { ORCHESTRATOR_PROMPT } from "./prompt.js";
import { BaseAgent } from "@/agents/index.js";
import { ORCHESTRATOR_OUTPUT_SCHEMA } from "@/agents/orchestrator/schemas/output.js";

export class OrchestratorAgent extends BaseAgent {
  constructor(name: string, model: string) {
    super(
      name,
      model,
      ORCHESTRATOR_PROMPT,
      {
        type: "json_schema",
        json_schema: {
          name: "orchestrator_output",
          schema: ORCHESTRATOR_OUTPUT_SCHEMA,
          strict: true,
        },
      }
    );
  }
} 