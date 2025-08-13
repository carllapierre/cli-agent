import chalk from "chalk";

export type Speaker = "You" | "Agent";

export function formatLabel(speaker: Speaker, agentName?: string): string {
	if (speaker === "You") return chalk.blueBright.bold("You:");
	const name = agentName?.trim() ? agentName : "Agent";
	return chalk.green.bold(`${name}: `);
}

export function printAssistantMessage(formattedLabel: string, text: string): void {
	console.log(`${formattedLabel}${text}`);
}

export function promptLabel(agentName?: string): string {
	return `${chalk.blueBright.bold("You:")} `;
} 