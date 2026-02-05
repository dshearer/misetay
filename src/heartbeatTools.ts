import * as vscode from 'vscode';
import { TaskStatusView } from './taskStatusView';

/**
 * Register heartbeat tools for tracking active work on tasks
 */
export function registerHeartbeatTools(context: vscode.ExtensionContext, taskStatusView: TaskStatusView) {
	
	// Register startingTask tool
	const startingTaskTool = vscode.lm.registerTool('smidja_startingTask', {
		async invoke(options, token) {
			const { taskId } = options.input as { taskId: string };

			try {
				taskStatusView.startingTask(taskId);
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Started tracking work on task: ${taskId}`)
				]);
			} catch (error: any) {
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Error starting task tracking: ${error.message}`)
				]);
			}
		},

		prepareInvocation(options, token) {
			const { taskId } = options.input as { taskId: string };
			return {
				invocationMessage: `Starting work on task: ${taskId}`
			};
		}
	});

	// Register workingOnTask tool
	const workingOnTaskTool = vscode.lm.registerTool('smidja_workingOnTask', {
		async invoke(options, token) {
			const { taskId } = options.input as { taskId: string };

			try {
				taskStatusView.workingOnTask(taskId);
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Heartbeat updated for task: ${taskId}`)
				]);
			} catch (error: any) {
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Error updating heartbeat: ${error.message}`)
				]);
			}
		},

		prepareInvocation(options, token) {
			const { taskId } = options.input as { taskId: string };
			return {
				invocationMessage: `Continuing work on task: ${taskId}`
			};
		}
	});

	// Register stoppingTask tool
	const stoppingTaskTool = vscode.lm.registerTool('smidja_stoppingTask', {
		async invoke(options, token) {
			const { taskId } = options.input as { taskId: string };

			try {
				taskStatusView.stoppingTask(taskId);
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Stopped tracking work on task: ${taskId}`)
				]);
			} catch (error: any) {
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Error stopping task tracking: ${error.message}`)
				]);
			}
		},

		prepareInvocation(options, token) {
			const { taskId } = options.input as { taskId: string };
			return {
				invocationMessage: `Stopping work on task: ${taskId}`
			};
		}
	});

	context.subscriptions.push(startingTaskTool, workingOnTaskTool, stoppingTaskTool);
	console.log('Smidja: Registered 3 heartbeat tools');
}
