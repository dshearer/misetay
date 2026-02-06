import * as vscode from 'vscode';
import { TaskBackend, Task, TaskStatus } from './taskBackend';

/**
 * Register task management tools for language models
 */
export function registerTaskTools(context: vscode.ExtensionContext, getBackend: () => TaskBackend) {
	// Register createTask tool
	const createTaskTool = vscode.lm.registerTool('misetay_createTask', {
		async invoke(options, token) {
			const { title, description, status } = options.input as { 
				title: string; 
				description: string; 
				status?: TaskStatus 
			};

			try {
				const task = await getBackend().createTask(title, description, status);
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
	const updateTaskTool = vscode.lm.registerTool('misetay_updateTask', {
		async invoke(options, token) {
			const { id, updates } = options.input as { 
				id: string; 
				updates: Partial<Omit<Task, 'id'>>
			};

			try {
				const task = await getBackend().updateTask(id, updates);
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
	const listTasksTool = vscode.lm.registerTool('misetay_listTasks', {
		async invoke(options, token) {
			const filters = options.input as { status?: TaskStatus } | undefined;

			try {
				const tasks = await getBackend().listTasks(filters);
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
	const addDependencyTool = vscode.lm.registerTool('misetay_addDependency', {
		async invoke(options, token) {
			const { childId, parentId } = options.input as { 
				childId: string; 
				parentId: string 
			};

			try {
				await getBackend().addDependency(childId, parentId);
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

	// Register backendInfo tool
	const backendInfoTool = vscode.lm.registerTool('misetay_backendInfo', {
		async invoke(options, token) {
			const info = getBackend().backendInfo();
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(JSON.stringify(info, null, 2))
			]);
		},

		prepareInvocation(options, token) {
			return {
				invocationMessage: 'Getting backend info'
			};
		}
	});

	context.subscriptions.push(createTaskTool, updateTaskTool, listTasksTool, addDependencyTool, backendInfoTool);
	console.log('Misetay: Registered 5 task management tools');
	
	// List all available tools to verify registration
	setTimeout(() => {
		const toolNames = vscode.lm.tools.map(t => t.name);
		console.log('All available LM tools:', toolNames);
		console.log('Misetay tools found:', toolNames.filter(n => n.startsWith('misetay_')));
	}, 1000);
}
