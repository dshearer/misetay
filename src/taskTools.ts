import * as vscode from 'vscode';
import { TaskBackend, Task, TaskStatus } from './taskBackend';

/**
 * Register task management tools for language models
 */
export function registerTaskTools(context: vscode.ExtensionContext, backend: TaskBackend) {
	// Register createTask tool
	const createTaskTool = vscode.lm.registerTool('smidja_createTask', {
		async invoke(options, token) {
			const { title, description, status } = options.input as { 
				title: string; 
				description: string; 
				status?: TaskStatus 
			};

			try {
				const task = await backend.createTask(title, description, status);
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(JSON.stringify(task, null, 2))
				]);
			} catch (error: any) {
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Error creating task: ${error.message}`)
				]);
			}
		},

		prepareInvocation(options, token) {
			const { title } = options.input as { title: string };
			return {
				invocationMessage: `Creating task: ${title}`
			};
		}
	});

	// Register updateTask tool
	const updateTaskTool = vscode.lm.registerTool('smidja_updateTask', {
		async invoke(options, token) {
			const { id, updates } = options.input as { 
				id: string; 
				updates: Partial<Omit<Task, 'id'>>
			};

			try {
				const task = await backend.updateTask(id, updates);
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(JSON.stringify(task, null, 2))
				]);
			} catch (error: any) {
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Error updating task: ${error.message}`)
				]);
			}
		},

		prepareInvocation(options, token) {
			const { id } = options.input as { id: string };
			return {
				invocationMessage: `Updating task: ${id}`
			};
		}
	});

	// Register listTasks tool
	const listTasksTool = vscode.lm.registerTool('smidja_listTasks', {
		async invoke(options, token) {
			const filters = options.input as { status?: TaskStatus; branch?: string } | undefined;

			try {
				const tasks = await backend.listTasks(filters);
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(JSON.stringify(tasks, null, 2))
				]);
			} catch (error: any) {
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Error listing tasks: ${error.message}`)
				]);
			}
		},

		prepareInvocation(options, token) {
			return {
				invocationMessage: 'Listing tasks'
			};
		}
	});

	// Register addDependency tool
	const addDependencyTool = vscode.lm.registerTool('smidja_addDependency', {
		async invoke(options, token) {
			const { childId, parentId } = options.input as { 
				childId: string; 
				parentId: string 
			};

			try {
				await backend.addDependency(childId, parentId);
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Added dependency: ${childId} depends on ${parentId}`)
				]);
			} catch (error: any) {
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Error adding dependency: ${error.message}`)
				]);
			}
		},

		prepareInvocation(options, token) {
			const { childId, parentId } = options.input as { childId: string; parentId: string };
			return {
				invocationMessage: `Adding dependency: ${childId} depends on ${parentId}`
			};
		}
	});

	context.subscriptions.push(createTaskTool, updateTaskTool, listTasksTool, addDependencyTool);
}
