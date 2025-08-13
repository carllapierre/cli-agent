import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import ora from "ora";

import { formatLabel, printAssistantMessage, promptLabel } from "@/utils/cli.js";
import { EXIT_COMMANDS, QUIT_HINT, SPINNER_TEXT, WELCOME_MESSAGE } from "@/config/constants.js";
import { MainWorkflow } from "@/workflow/mainWorkflow.js";
import { getRuntimeConfig } from "@/config/env.js";

export class IoService {
  private readonly workflow: MainWorkflow;
  private lastSigint = 0;

  constructor(workflow: MainWorkflow) {
    this.workflow = workflow;
  }

  async start(): Promise<void> {
    const { agentName } = getRuntimeConfig();

    await this.workflow.initialize();

    const rl = readline.createInterface({ input, output, terminal: true });
    rl.setPrompt(promptLabel(agentName));

    console.log(WELCOME_MESSAGE);

    input.resume();
    rl.prompt();

    rl.on("line", async (line) => {
      const text = (line ?? "").trim();
      if (!text) {
        input.resume();
        rl.prompt();
        return;
      }
      const lower = text.toLowerCase();
      if (EXIT_COMMANDS.includes(lower as any)) {
        rl.close();
        return;
      }

      const spinner = ora({ text: SPINNER_TEXT, discardStdin: false }).start();
      try {
        const outputText = await this.workflow.handleUserInput(text);
        spinner.stop();
        printAssistantMessage(formatLabel("Agent", agentName), outputText);
      } catch (err) {
        spinner.stop();
        console.error("Error:", err);
      }
      input.resume();
      rl.prompt();
    });

    rl.on("SIGINT", () => {
      const now = Date.now();
      if (now - this.lastSigint < 1000) {
        rl.close();
      } else {
        console.log(QUIT_HINT);
        this.lastSigint = now;
        input.resume();
        rl.prompt();
      }
    });

    rl.on("close", () => {
      try { ora().stop(); } catch {}
      process.exit(0);
    });
  }
} 