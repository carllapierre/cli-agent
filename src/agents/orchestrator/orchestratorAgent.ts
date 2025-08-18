import { ORCHESTRATOR_PROMPT } from "./prompt.js";
import { ORCHESTRATOR_OUTPUT_SCHEMA } from "@/agents/orchestrator/schemas/output.js";
import { ChatOpenAI } from "@langchain/openai";
import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { getLangfuseCallbacks } from "@/services/tracing.js";

// Define the orchestrator graph state with messages and answer
const OrchestratorState = Annotation.Root({
	messages: Annotation<BaseMessage[]>({
		reducer: (current: BaseMessage[], update: BaseMessage[]) => current.concat(update),
		default: () => [],
	}),
	answer: Annotation<string>,
});

type OrchestratorStateType = typeof OrchestratorState.State;

type RunOnceResult = {
	finalOutput: { answer: string } | string;
	history: BaseMessage[];
};

export class OrchestratorAgent {
	private readonly name: string;
	private readonly modelName: string;
	private readonly model: ChatOpenAI;
	private readonly graph: any;

	constructor(name: string, model: string) {
		this.name = name;
		this.modelName = model;
		this.model = new ChatOpenAI({ model: this.modelName, temperature: 0 });

		const respond = async (state: OrchestratorStateType) => {
			const response = await this.model.invoke([
				{ role: "system", content: ORCHESTRATOR_PROMPT },
				...state.messages,
			]);
			const content = (response as AIMessage).content as string;
			const parsed = ORCHESTRATOR_OUTPUT_SCHEMA.parse({ answer: content });
			return { messages: [new AIMessage(parsed.answer)], answer: parsed.answer } as Partial<OrchestratorStateType>;
		};

		const builder = new StateGraph(OrchestratorState)
			.addNode("respond", respond)
			.addEdge(START, "respond")
			.addEdge("respond", END);

		this.graph = builder.compile();
	}

	async runOnce(history: BaseMessage[]): Promise<RunOnceResult> {
		const result = await this.graph.invoke(
			{ messages: history },
			{ callbacks: getLangfuseCallbacks(), tags: ["orchestrator_graph"], runName: "orchestrator_graph" }
		);
		const answer = result.answer ?? (result.messages[result.messages.length - 1] as AIMessage)?.content ?? "";
		return {
			finalOutput: { answer: typeof answer === "string" ? answer : String(answer) },
			history: result.messages,
		};
	}
} 