import { promises as fs } from "node:fs";
import path from "node:path";

export type ConversationEntry = {
  role: "user" | "assistant";
  message: string;
  timestamp?: string;
};

export function getContextDir(): string {
  const dir = process.env.CONTEXT_DIR && process.env.CONTEXT_DIR.trim().length > 0
    ? process.env.CONTEXT_DIR
    : path.resolve(process.cwd(), "context");
  return dir;
}

export function getHistoryFilePath(contextDir: string): string {
  return path.join(contextDir, "conversation-history.json");
}

export async function ensureContextDir(contextDir: string): Promise<void> {
  try {
    await fs.mkdir(contextDir, { recursive: true });
  } catch {}
}

export async function loadConversation(contextDir: string): Promise<ConversationEntry[]> {
  const file = getHistoryFilePath(contextDir);
  try {
    const buf = await fs.readFile(file, "utf8");
    const data = JSON.parse(buf);
    if (Array.isArray(data)) {
      return data.filter((e) => e && (e.role === "user" || e.role === "assistant") && typeof e.message === "string");
    }
  } catch {}
  return [];
}

export async function appendConversationEntry(contextDir: string, entry: ConversationEntry): Promise<void> {
  await ensureContextDir(contextDir);
  const file = getHistoryFilePath(contextDir);
  let entries: ConversationEntry[] = [];
  try {
    const buf = await fs.readFile(file, "utf8");
    const data = JSON.parse(buf);
    if (Array.isArray(data)) entries = data as ConversationEntry[];
  } catch {}
  const withTime: ConversationEntry = { ...entry, timestamp: new Date().toISOString() };
  entries.push(withTime);
  await fs.writeFile(file, JSON.stringify(entries, null, 2), "utf8");
} 