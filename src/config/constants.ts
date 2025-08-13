export const DEFAULT_MODEL_NAME = "gpt-4o-mini";
export const DEFAULT_AGENT_NAME = "Agent";

export const EXIT_COMMANDS = ["exit", "quit", "q"] as const;
export type ExitCommand = typeof EXIT_COMMANDS[number];

export const WELCOME_MESSAGE = "Type 'exit' to quit...\n";
export const QUIT_HINT = "\n(press Ctrl+C again to exit)\n";
export const SPINNER_TEXT = "Thinking...";

export function getResumeSystemMessage(now: Date = new Date()): string {
  return `Session resumed. The user has re-opened the CLI at ${now.toISOString()}. Continue the conversation briefly and pick up where it left off.`;
} 