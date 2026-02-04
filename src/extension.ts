// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { BeadsBackend } from './beadsBackend';
import { registerTaskTools } from './taskTools';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Verify Beatrice extension is installed
	const beatriceExtension = vscode.extensions.getExtension('dshearer.beatrice');
	if (!beatriceExtension) {
		vscode.window.showErrorMessage(
			'Smidja requires the Beatrice extension. Please install it from the marketplace.',
			'Install Beatrice'
		).then(selection => {
			if (selection === 'Install Beatrice') {
				vscode.commands.executeCommand('workbench.extensions.search', 'dshearer.beatrice');
			}
		});
		return;
	}

	// Wait for Beatrice to activate if not already active
	if (!beatriceExtension.isActive) {
		beatriceExtension.activate().then(() => {
			console.log('Beatrice extension activated');
		}).catch(err => {
			vscode.window.showErrorMessage(`Failed to activate Beatrice: ${err.message}`);
		});
	}

	// Initialize task backend (default: Beads)
	const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (!workspaceRoot) {
		vscode.window.showWarningMessage('Smidja: No workspace folder open');
		return;
	}

	const taskBackend = new BeadsBackend(workspaceRoot);

	// Register task management tools
	registerTaskTools(context, taskBackend);

	console.log('Smidja extension activated');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('smidja.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Smidja!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
