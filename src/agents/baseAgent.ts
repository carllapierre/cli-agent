import { Agent, run } from "@openai/agents";
import type { Tool } from "@openai/agents";

export class BaseAgent {
  protected readonly agent: Agent;

  constructor(name: string, model: string, instructions: string, responseFormat?: unknown) {
    this.agent = new Agent({
      name,
      instructions,
      model,
      ...(responseFormat ? { response_format: responseFormat } : {}),
    });
  }

  addTool(tool: Tool): void {
    this.agent.tools.push(tool);
  }

  get inner(): Agent {
    return this.agent;
  }

  async runOnce(history: any[]) {
    return await run(this.agent, history);
  }
} 