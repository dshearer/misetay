import * as vscode from 'vscode';
import { TaskBackend, Task, TaskStatus, BackendInfo } from './taskBackend';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const execFileAsync = promisify(execFile);

/**
 * Resolve the bd binary path: prefer the bundled @beads/bd package, fall back to system PATH.
 */
function resolveBdPath(): string {
	try {
		const bdJsPath = require.resolve('@beads/bd/bin/bd.js');
		const binaryName = os.platform() === 'win32' ? 'bd.exe' : 'bd';
		const bundledPath = path.join(path.dirname(bdJsPath), binaryName);
		if (fs.existsSync(bundledPath)) {
			return bundledPath;
		}
	} catch {
		// @beads/bd not installed, fall through
	}
	return 'bd'; // fall back to system PATH
}

const bdPath = resolveBdPath();

/**
 * Backend adapter for Beads CLI
 */
export class BeadsBackend implements TaskBackend {
	private workspaceRoot: string;

	constructor(workspaceRoot: string) {
		this.workspaceRoot = workspaceRoot;
	}

	backendInfo(): BackendInfo {
		return { name: 'beads', persistsToFiles: true };
	}

	/**
	 * Map Misatay status to Beads status and labels
	 */
	private toBeadsStatusAndLabels(misatayStatus: TaskStatus): { status: string; label?: string } {
		switch (misatayStatus) {
			case 'ready':
				return { status: 'open' };
			case 'in_progress':
				return { status: 'in_progress' };

			case 'committed':
				return { status: 'closed', label: 'committed' };
			case 'reviewed':
				return { status: 'closed', label: 'reviewed' };
			case 'needs_help':
				return { status: 'open', label: 'needs_help' };
		}
	}

	/**
	 * Map Beads status to Misatay status (using labels to distinguish closed states)
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
		// open with needs_help label
		if (labels?.includes('needs_help')) {
			return 'needs_help';
		}
		// open, deferred, blocked map to ready
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

			const { stdout } = await execFileAsync(bdPath, args, {
				cwd: this.workspaceRoot,
				env: { ...process.env }
			});

			const id = stdout.trim();

			// Update status and add appropriate label
			const { status: beadsStatus, label } = this.toBeadsStatusAndLabels(status);
			if (beadsStatus !== 'open') {
				await execFileAsync(bdPath, ['update', id, '--status', beadsStatus], {
					cwd: this.workspaceRoot
				});
			}
			if (label) {
				await execFileAsync(bdPath, ['label', 'add', id, label], {
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
			// Handle status updates with label management
			if (updates.status !== undefined) {
				// Get current task to manage labels
				const { stdout: currentData } = await execFileAsync(bdPath, ['--json', 'show', id], {
					cwd: this.workspaceRoot
				});
				const current = JSON.parse(currentData)[0]; // bd show returns an array

				// Remove old status labels
				for (const label of ['committed', 'reviewed', 'needs_help']) {
					if (current.labels?.includes(label)) {
						await execFileAsync(bdPath, ['label', 'remove', id, label], {
							cwd: this.workspaceRoot
						});
					}
				}

				// Add new label and update status
				const { status: beadsStatus, label } = this.toBeadsStatusAndLabels(updates.status);
				if (current.status !== beadsStatus) {
					await execFileAsync(bdPath, ['update', id, '-s', beadsStatus], {
						cwd: this.workspaceRoot
					});
				}
				if (label) {
					await execFileAsync(bdPath, ['label', 'add', id, label], {
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
				await execFileAsync(bdPath, args, {
					cwd: this.workspaceRoot
				});
			}

			// Fetch the updated task
			const { stdout } = await execFileAsync(bdPath, ['--json', 'show', id], {
				cwd: this.workspaceRoot
			});

			const taskDataArray = JSON.parse(stdout);
			const taskData = taskDataArray[0]; // bd show returns an array
			// Extract dependency IDs from dependency objects
			const dependencies = taskData.dependencies?.map((dep: any) => dep.id);
			
			return {
				id: taskData.id,
				title: taskData.title,
				description: taskData.description,
				status: this.fromBeadsStatus(taskData.status, taskData.labels),
				dependencies
			};
		} catch (error: any) {
			throw new Error(`Failed to update task ${id} with Beads: ${error.message}`);
		}
	}

	async listTasks(filters?: { status?: TaskStatus }): Promise<Task[]> {
		try {
			const args: string[] = ['--json', 'list'];

			// By default, include all tasks (open and closed)
			args.push('--all');

			const labels: string[] = [];

			if (filters?.status) {
				const { status: beadsStatus, label: label } = this.toBeadsStatusAndLabels(filters.status);
				args.push('-s', beadsStatus);
				if (label !== undefined) {
					labels.push(label);
				}
			}

			if (labels.length > 0) {
				for (const label of labels) {
					args.push('-l');
					args.push(labels.join(','));
				}
			}

			const { stdout } = await execFileAsync(bdPath, args, {
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
					const { stdout: detailStdout } = await execFileAsync(bdPath, ['--json', 'show', t.id], {
						cwd: this.workspaceRoot
					});
					const detailed = JSON.parse(detailStdout)[0];
					t.dependencies = detailed.dependencies;
				}
				
				// Extract dependency IDs from dependency objects
				const dependencies = t.dependencies?.map((dep: any) => dep.id);
				
				return {
					id: t.id,
					title: t.title,
					description: t.description,
					status: this.fromBeadsStatus(t.status, t.labels),
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
			await execFileAsync(bdPath, ['dep', 'add', childId, parentId], {
				cwd: this.workspaceRoot
			});
		} catch (error: any) {
			throw new Error(`Failed to add dependency with Beads: ${error.message}`);
		}
	}
}
