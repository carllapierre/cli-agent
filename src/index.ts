import dotenv from "dotenv";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import ora from "ora";

import {
  Agent,
  user,
  run,
} from "@openai/agents";
import { setDefaultOpenAIKey } from "@openai/agents-openai";
import { formatLabel, printAssistantMessage, promptLabel } from "./utils/cli.js";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Missing OPENAI_API_KEY in .env");
  process.exit(1);
}

setDefaultOpenAIKey(apiKey);
const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
const agentName = process.env.AGENT_NAME || "Agent";

const agent = new Agent({
  name: agentName,
  instructions: "You are a concise, helpful assistant.",
  model: modelName,
});

const rl = readline.createInterface({ input, output, terminal: true });
rl.setPrompt(promptLabel(agentName));

let history: any[] = [];
let lastSigint = 0;

console.log("Type 'exit' to quit.\n");
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
  if (lower === "exit" || lower === "quit" || lower === "q") {
    rl.close();
    return;
  }

  history.push(user(text));
  const spinner = ora({ text: "Thinking...", discardStdin: false }).start();
  try {
    const result = await run(agent, history);
    spinner.stop();
    const outputText = (result.finalOutput as string | undefined) ?? "";
    printAssistantMessage(formatLabel("Agent", agentName), outputText);
    history = result.history;
  } catch (err) {
    spinner.stop();
    console.error("Error:", err);
  }
  input.resume();
  rl.prompt();
});

rl.on("SIGINT", () => {
  const now = Date.now();
  if (now - lastSigint < 1000) {
    rl.close();
  } else {
    console.log("\n(press Ctrl+C again to exit)\n");
    lastSigint = now;
    input.resume();
    rl.prompt();
  }
});

rl.on("close", () => {
  try { ora().stop(); } catch {}
  process.exit(0);
}); 