import chalk from "chalk";

export type Speaker = "You" | "Agent";

export const DEFAULT_USER_DISPLAY_NAME = "You";
export const DEFAULT_AGENT_DISPLAY_NAME = "Agent";

function getDisplayName(speaker: Speaker, agentName?: string): string {
	if (speaker === "You") return DEFAULT_USER_DISPLAY_NAME;
	const name = agentName?.trim() ? agentName : DEFAULT_AGENT_DISPLAY_NAME;
	return name;
}

function getSpeakerStyle(speaker: Speaker): (text: string) => string {
	return speaker === "You" ? chalk.blueBright.bold : chalk.green.bold;
}

export function formatLabel(speaker: Speaker, agentName?: string): string {
	const label = `${getDisplayName(speaker, agentName)}: `;
	return getSpeakerStyle(speaker)(label);
}

export function printAssistantMessage(formattedLabel: string, text: string): void {
	console.log(`${formattedLabel}${text}`);
}

export function promptLabel(agentName?: string): string {
	return formatLabel("You");
} 