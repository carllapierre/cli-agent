import { user, system } from "@openai/agents";
import { OrchestratorAgent } from "@/agents/orchestrator/orchestratorAgent.js";
import { appendConversationEntry, ensureContextDir, getContextDir, loadConversation } from "@/services/contextStore.js";
import { getResumeSystemMessage } from "@/config/constants.js";
import { getRuntimeConfig } from "@/config/env.js";

export class MainWorkflow {
  private readonly orchestrator: OrchestratorAgent;
  private contextDir: string = "";
  private history: any[] = [];

  constructor() {
    const { agentName, modelName } = getRuntimeConfig();
    this.orchestrator = new OrchestratorAgent(agentName, modelName);
  }

  async initialize(): Promise<void> {
    const contextDir = getContextDir();
    await ensureContextDir(contextDir);
    this.contextDir = contextDir;

    try {
      const persisted = await loadConversation(contextDir);
      if (persisted.length > 0) {
        for (const entry of persisted) {
          if (entry.role === "user") this.history.push(user(entry.message));
        }
        this.history.push(system(getResumeSystemMessage()));
      }
    } catch {}
  }

  async handleUserInput(text: string): Promise<string> {
    this.history.push(user(text));
    await appendConversationEntry(this.contextDir, { role: "user", message: text });

    const result = await this.orchestrator.runOnce(this.history);
    let outputText = "";
    const fo = result.finalOutput as any;
    if (fo && typeof fo === "object" && typeof fo.answer === "string") {
      outputText = fo.answer;
    } else if (typeof fo === "string") {
      outputText = fo;
    }

    this.history = result.history;
    await appendConversationEntry(this.contextDir, { role: "assistant", message: outputText });

    return outputText;
  }
}
