import { ORCHESTRATOR_PROMPT } from "./prompt.js";
import { BaseAgent } from "@/agents/index.js";

export class OrchestratorAgent extends BaseAgent {
  constructor(name: string, model: string) {
    super(name, model, ORCHESTRATOR_PROMPT);
  }
} 