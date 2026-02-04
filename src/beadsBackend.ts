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

	/**
	 * Map Smidja status to Beads status and labels
	 */
	private toBeadsStatusAndLabels(smidjaStatus: TaskStatus): { status: string; label?: string } {
		switch (smidjaStatus) {
			case 'ready':
				return { status: 'open' };
			case 'in_progress':
				return { status: 'in_progress' };
			case 'blocked':
				return { status: 'blocked' };
			case 'committed':
				return { status: 'closed', label: 'committed' };
			case 'reviewed':
				return { status: 'closed', label: 'reviewed' };
		}
	}

	/**
	 * Map Beads status to Smidja status (using labels to distinguish closed states)
	 */
	private fromBeadsStatus(beadsStatus: string, labels?: string[]): TaskStatus {
		if (beadsStatus === 'closed') {
			if (labels?.includes('reviewed')) {
				return 'reviewed';
			}
			if (labels?.includes('committed')) {
				return 'committed';
			}
			return 'committed';
		}
		if (beadsStatus === 'in_progress') {
			return 'in_progress';
		}
		if (beadsStatus === 'blocked') {
			return 'blocked';
		}
		// open, deferred map to ready
		return 'ready';
	}

	async createTask(title: string, description: string, status: TaskStatus = 'ready', branch?: string): Promise<Task> {
		try {
			// Create task with beads CLI using --silent to get just the ID
			const args = ['create', title, '--silent'];
			if (description) {
				args.push('-d', description);
			}
			
			// Store branch as a label with prefix 'branch:'
			if (branch) {
				args.push('-l', `branch:${branch}`);
			}

			const { stdout } = await execFileAsync('bd', args, {
				cwd: this.workspaceRoot,
				env: { ...process.env }
			});

			const id = stdout.trim();

			// Update status and add appropriate label
			const { status: beadsStatus, label } = this.toBeadsStatusAndLabels(status);
			if (beadsStatus !== 'open') {
				await execFileAsync('bd', ['update', id, '--status', beadsStatus], {
					cwd: this.workspaceRoot
				});
			}
			if (label) {
				await execFileAsync('bd', ['label', 'add', id, label], {
					cwd: this.workspaceRoot
				});
			}

			return {
				id,
				title,
				description,
				status,
				branch
			};
		} catch (error: any) {
			throw new Error(`Failed to create task with Beads: ${error.message}`);
		}
	}

	async updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task> {
		try {
			// Handle branch updates separately since we need to manage labels
			if (updates.branch !== undefined) {
				// First, get current task to find existing branch label
				const { stdout: currentData } = await execFileAsync('bd', ['--json', 'show', id], {
					cwd: this.workspaceRoot
				});
				const current = JSON.parse(currentData)[0]; // bd show returns an array
				const currentBranchLabel = current.labels?.find((l: string) => l.startsWith('branch:'));
				
				// Remove old branch label if exists
				if (currentBranchLabel) {
					await execFileAsync('bd', ['label', 'remove', id, currentBranchLabel], {
						cwd: this.workspaceRoot
					});
				}
				
				// Add new branch label if branch is not empty
				if (updates.branch) {
					await execFileAsync('bd', ['label', 'add', id, `branch:${updates.branch}`], {
						cwd: this.workspaceRoot
					});
				}
			}

			// Handle status updates with label management
			if (updates.status !== undefined) {
				// Get current task to manage labels
				const { stdout: currentData } = await execFileAsync('bd', ['--json', 'show', id], {
					cwd: this.workspaceRoot
				});
				const current = JSON.parse(currentData)[0]; // bd show returns an array

				// Remove old committed/reviewed labels
				for (const label of ['committed', 'reviewed']) {
					if (current.labels?.includes(label)) {
						await execFileAsync('bd', ['label', 'remove', id, label], {
							cwd: this.workspaceRoot
						});
					}
				}

				// Add new label and update status
				const { status: beadsStatus, label } = this.toBeadsStatusAndLabels(updates.status);
				if (current.status !== beadsStatus) {
					await execFileAsync('bd', ['update', id, '-s', beadsStatus], {
						cwd: this.workspaceRoot
					});
				}
				if (label) {
					await execFileAsync('bd', ['label', 'add', id, label], {
						cwd: this.workspaceRoot
					});
				}
			}

			const args = ['update', id];

			if (updates.title) {
				args.push('--title', updates.title);
			}
			if (updates.description) {
				args.push('-d', updates.description);
			}

			// Only run update if there are non-branch/non-status updates
			if (args.length > 2) {
				await execFileAsync('bd', args, {
					cwd: this.workspaceRoot
				});
			}

			// Fetch the updated task
			const { stdout } = await execFileAsync('bd', ['--json', 'show', id], {
				cwd: this.workspaceRoot
			});

			const taskDataArray = JSON.parse(stdout);
			const taskData = taskDataArray[0]; // bd show returns an array
			// Extract branch from labels
			const branchLabel = taskData.labels?.find((l: string) => l.startsWith('branch:'));
			const branch = branchLabel ? branchLabel.substring('branch:'.length) : undefined;
			// Extract dependency IDs from dependency objects
			const dependencies = taskData.dependencies?.map((dep: any) => dep.id);
			
			return {
				id: taskData.id,
				title: taskData.title,
				description: taskData.description,
				status: this.fromBeadsStatus(taskData.status, taskData.labels),
				branch,
				dependencies
			};
		} catch (error: any) {
			throw new Error(`Failed to update task ${id} with Beads: ${error.message}`);
		}
	}

	async listTasks(filters?: { status?: TaskStatus; branch?: string }): Promise<Task[]> {
		try {
			const args = ['--json', 'list'];

			if (filters?.status) {
				const { status: beadsStatus } = this.toBeadsStatusAndLabels(filters.status);
				args.push('-s', beadsStatus);
			}
			// Filter by branch label if specified
			if (filters?.branch) {
				args.push('-l', `branch:${filters.branch}`);
			}

			const { stdout } = await execFileAsync('bd', args, {
				cwd: this.workspaceRoot
			});

			// Handle empty output (no tasks)
			if (!stdout.trim()) {
				return [];
			}

			const tasks = JSON.parse(stdout);
			
			// If we have tasks and need to get dependencies, fetch each task individually
			// bd list doesn't include the full dependencies array, only dependency_count
			const tasksWithDetails = await Promise.all(tasks.map(async (t: any) => {
				// For tasks with dependencies, fetch full details
				if (t.dependency_count > 0) {
					const { stdout: detailStdout } = await execFileAsync('bd', ['--json', 'show', t.id], {
						cwd: this.workspaceRoot
					});
					const detailed = JSON.parse(detailStdout)[0];
					t.dependencies = detailed.dependencies;
				}
				
				// Extract branch from labels
				const branchLabel = t.labels?.find((l: string) => l.startsWith('branch:'));
				const branch = branchLabel ? branchLabel.substring('branch:'.length) : undefined;
				// Extract dependency IDs from dependency objects
				const dependencies = t.dependencies?.map((dep: any) => dep.id);
				
				return {
					id: t.id,
					title: t.title,
					description: t.description,
					status: this.fromBeadsStatus(t.status, t.labels),
					branch,
					dependencies
				};
			}));
			
			return tasksWithDetails;
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
