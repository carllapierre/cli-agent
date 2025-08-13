#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

async function main() {
  const dir = process.env.CONTEXT_DIR && process.env.CONTEXT_DIR.trim().length > 0
    ? process.env.CONTEXT_DIR
    : path.resolve(process.cwd(), "context");
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {}
  await fs.mkdir(dir, { recursive: true });
  process.stdout.write(`Reset context at: ${dir}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}); 