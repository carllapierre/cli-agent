import { getRuntimeConfig } from "@/config/env.js";
import type { Callbacks } from "@langchain/core/callbacks/manager";
import { CallbackHandler, Langfuse } from "langfuse-langchain";

let cachedHandler: CallbackHandler | undefined;

export function getLangfuseCallbacks(): Callbacks | undefined {
	const cfg = getRuntimeConfig().langfuse;
	if (!cfg?.enabled || !cfg.publicKey || !cfg.secretKey) return undefined;
	if (cachedHandler) return [cachedHandler];

	const baseUrl = cfg.baseUrl;
	const traceId = process.env.LANGFUSE_TRACE_ID;

	if (traceId) {
		const langfuse = new Langfuse({ publicKey: cfg.publicKey, secretKey: cfg.secretKey, baseUrl });
		const root = langfuse.trace({ id: traceId });
		cachedHandler = new CallbackHandler({ publicKey: cfg.publicKey, secretKey: cfg.secretKey, baseUrl, root });
	} else {
		cachedHandler = new CallbackHandler({ publicKey: cfg.publicKey, secretKey: cfg.secretKey, baseUrl });
	}
	return [cachedHandler];
} 