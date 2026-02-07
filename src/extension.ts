// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TaskBackend } from './taskBackend';
import { BeadsBackend } from './beadsBackend';
import { InMemoryBackend } from './inMemoryBackend';
import { registerTaskTools } from './taskTools';
import { TaskStatusView } from './taskStatusView';
import { registerNavigationTools } from './navigationTools';

/**
 * Recursively copy directory contents
 */
function copyDirectoryRecursive(source: string, target: string): void {
	// Create target directory if it doesn't exist
	if (!fs.existsSync(target)) {
		fs.mkdirSync(target, { recursive: true });
	}

	// Read all items in source directory
	const items = fs.readdirSync(source, { withFileTypes: true });

	for (const item of items) {
		const sourcePath = path.join(source, item.name);
		const targetPath = path.join(target, item.name);

		if (item.isDirectory()) {
			// Recursively copy subdirectory
			copyDirectoryRecursive(sourcePath, targetPath);
		} else if (item.isFile()) {
			// Copy file
			fs.copyFileSync(sourcePath, targetPath);
		}
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Initialize task backend based on setting
	const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (!workspaceRoot) {
		vscode.window.showWarningMessage('Misatay: No workspace folder open');
		return;
	}

	const inMemoryBackend = new InMemoryBackend();

	function createBackend(setting: string): TaskBackend {
		if (setting === 'inMemory') {
			return inMemoryBackend;
		}
		return new BeadsBackend(workspaceRoot!);
	}

	let taskBackend = createBackend(
		vscode.workspace.getConfiguration('misatay').get<string>('taskBackend', 'beads')
	);

	if (taskBackend.backendInfo().name === 'inMemory') {
		vscode.window.showInformationMessage(
			'Misatay is using in-memory task storage. Tasks will be lost when VS Code restarts. Install Beads CLI for persistent task tracking.'
		);
	}

	// Initialize task status view and show it automatically
	const taskStatusView = new TaskStatusView(context, () => taskBackend);
	context.subscriptions.push({
		dispose: () => taskStatusView.dispose()
	});
	taskStatusView.show();

	// Register task management tools
	registerTaskTools(context, () => taskBackend);

	// Hot-swap backend when setting changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('misatay.taskBackend')) {
				const newSetting = vscode.workspace.getConfiguration('misatay').get<string>('taskBackend', 'beads');
				taskBackend = createBackend(newSetting);
				const info = taskBackend.backendInfo();
				vscode.window.showInformationMessage(
					`Misatay: Switched to ${info.name} backend.${info.persistsToFiles ? '' : ' Tasks will not persist across sessions.'}`
				);
				taskStatusView.refresh();
			}
		})
	);

	// Register navigation tools
	registerNavigationTools(context);

	// Register Show Task Status command
	const showTaskStatusCommand = vscode.commands.registerCommand('misatay.showTaskStatus', async () => {
		await taskStatusView.show();
	});

	// Register Install Agent command
	const installAgentCommand = vscode.commands.registerCommand('misatay.installAgent', async () => {
		if (!workspaceRoot) {
			vscode.window.showErrorMessage('No workspace folder is open. Please open a folder first.');
			return;
		}

		// Create .github/agents/ directory if it doesn't exist
		const githubAgentsDir = path.join(workspaceRoot, '.github', 'agents');
		if (!fs.existsSync(githubAgentsDir)) {
			fs.mkdirSync(githubAgentsDir, { recursive: true });
		}

		// Copy agents/Misatay.agent.md to .github/agents/Misatay.agent.md
		const sourceAgentFile = path.join(context.extensionPath, 'agents', 'Misatay.agent.md');
		const targetAgentFile = path.join(githubAgentsDir, 'Misatay.agent.md');
		
		if (!fs.existsSync(sourceAgentFile)) {
			vscode.window.showErrorMessage('Agent file not found in extension. Please reinstall Misatay.');
			return;
		}

		fs.copyFileSync(sourceAgentFile, targetAgentFile);

		// Copy skills directory to .github/skills/
		const sourceSkillsDir = path.join(context.extensionPath, 'skills');
		const targetSkillsDir = path.join(workspaceRoot, '.github', 'skills');

		if (fs.existsSync(sourceSkillsDir)) {
			// Create .github/skills/ directory if it doesn't exist
			if (!fs.existsSync(targetSkillsDir)) {
				fs.mkdirSync(targetSkillsDir, { recursive: true });
			}

			// Recursively copy all skill files
			copyDirectoryRecursive(sourceSkillsDir, targetSkillsDir);
		}

		vscode.window.showInformationMessage(
			'Misatay agent and skills installed successfully! Reload VS Code to use the @misatay agent in GitHub Copilot chat.',
			'Reload Window'
		).then(selection => {
			if (selection === 'Reload Window') {
				vscode.commands.executeCommand('workbench.action.reloadWindow');
			}
		});
	});

	context.subscriptions.push(showTaskStatusCommand, installAgentCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
