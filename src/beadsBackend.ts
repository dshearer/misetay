import * as vscode from 'vscode';
import { TaskBackend, Task, TaskStatus } from './taskBackend';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

/**
 * Backend adapter for Beads CLI
 */
export class BeadsBackend implements TaskBackend {
	private workspaceRoot: string;

	constructor(workspaceRoot: string) {
		this.workspaceRoot = workspaceRoot;
	}

	async createTask(title: string, description: string, status: TaskStatus = 'ready'): Promise<Task> {
		try {
			// Create task with beads CLI
			const { stdout } = await execFileAsync('bd', ['create', title], {
				cwd: this.workspaceRoot,
				env: { ...process.env }
			});

			// Extract task ID from output (format: "Created task bd-abc1")
			const match = stdout.match(/Created task (bd-[a-z0-9]+)/);
			if (!match) {
				throw new Error('Failed to parse task ID from beads output');
			}

			const id = match[1];

			// Update the task description and status
			await execFileAsync('bd', ['edit', id, '--description', description], {
				cwd: this.workspaceRoot
			});

			if (status !== 'ready') {
				await execFileAsync('bd', ['edit', id, '--status', status], {
					cwd: this.workspaceRoot
				});
			}

			return {
				id,
				title,
				description,
				status
			};
		} catch (error: any) {
			throw new Error(`Failed to create task with Beads: ${error.message}`);
		}
	}

	async updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task> {
		try {
			const args = ['edit', id];

			if (updates.title) {
				args.push('--title', updates.title);
			}
			if (updates.description) {
				args.push('--description', updates.description);
			}
			if (updates.status) {
				args.push('--status', updates.status);
			}
			if (updates.branch) {
				args.push('--branch', updates.branch);
			}

			await execFileAsync('bd', args, {
				cwd: this.workspaceRoot
			});

			// Fetch the updated task
			const { stdout } = await execFileAsync('bd', ['show', id, '--format', 'json'], {
				cwd: this.workspaceRoot
			});

			const taskData = JSON.parse(stdout);
			return {
				id: taskData.id,
				title: taskData.title,
				description: taskData.description,
				status: taskData.status,
				branch: taskData.branch,
				dependencies: taskData.dependencies
			};
		} catch (error: any) {
			throw new Error(`Failed to update task ${id} with Beads: ${error.message}`);
		}
	}

	async listTasks(filters?: { status?: TaskStatus; branch?: string }): Promise<Task[]> {
		try {
			const args = ['list', '--format', 'json'];

			if (filters?.status) {
				args.push('--status', filters.status);
			}
			if (filters?.branch) {
				args.push('--branch', filters.branch);
			}

			const { stdout } = await execFileAsync('bd', args, {
				cwd: this.workspaceRoot
			});

			const tasks = JSON.parse(stdout);
			return tasks.map((t: any) => ({
				id: t.id,
				title: t.title,
				description: t.description,
				status: t.status,
				branch: t.branch,
				dependencies: t.dependencies
			}));
		} catch (error: any) {
			throw new Error(`Failed to list tasks with Beads: ${error.message}`);
		}
	}

	async addDependency(childId: string, parentId: string): Promise<void> {
		try {
			await execFileAsync('bd', ['dep', 'add', childId, parentId], {
				cwd: this.workspaceRoot
			});
		} catch (error: any) {
			throw new Error(`Failed to add dependency with Beads: ${error.message}`);
		}
	}
}
