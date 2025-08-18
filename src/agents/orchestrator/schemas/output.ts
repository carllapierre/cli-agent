import { z } from "zod";

export const ORCHESTRATOR_OUTPUT_SCHEMA = z.object({
	answer: z.string().describe("Final answer to respond to the user."),
});

export type OrchestratorOutput = z.infer<typeof ORCHESTRATOR_OUTPUT_SCHEMA>; 