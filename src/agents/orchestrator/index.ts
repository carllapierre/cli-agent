import { Agent, run } from "@openai/agents";
import type { Tool } from "@openai/agents";
import { ORCHESTRATOR_PROMPT } from "./prompt.js";

export class OrchestratorAgent {
	private readonly agent: Agent;

	constructor(name: string, model: string) {
		this.agent = new Agent({
			name,
			instructions: ORCHESTRATOR_PROMPT,
			model,
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