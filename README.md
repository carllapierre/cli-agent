### CLI Agent (TypeScript) using OpenAI Agents SDK

- Requires Node 18+

#### Setup (Windows PowerShell)

```powershell
# From repo root
npm install
Copy-Item .env.example .env  # ensure file exists
# Edit .env and set OPENAI_API_KEY (and optionally OPENAI_MODEL, AGENT_NAME)

npm start
```

- Default model: `gpt-4o-mini`
- Default agent name: `Agent` (override with `AGENT_NAME` in `.env`)
- Type `exit` to quit; Ctrl+C twice also exits.
- Spinner shows while processing.
- Output shows colorized role labels only (You: cyan, Agent: green). 