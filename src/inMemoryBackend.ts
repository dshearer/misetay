import { TaskBackend, Task, TaskStatus, BackendInfo } from './taskBackend';

/**
 * In-memory task backend that requires no external dependencies.
 * Tasks are lost when VS Code restarts.
 */
export class InMemoryBackend implements TaskBackend {
	private tasks = new Map<string, Task>();
	private nextId = 1;

	backendInfo(): BackendInfo {
		return { name: 'inMemory', persistsToFiles: false };
	}

	async init(): Promise<string> {
		return 'In-memory backend is ready (no initialization needed).';
	}

	async createTask(title: string, description: string, status: TaskStatus = 'ready'): Promise<Task> {
		const id = `mem-${this.nextId++}`;
		const task: Task = { id, title, description, status };
		this.tasks.set(id, task);
		return { ...task };
	}

	async updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task> {
		const task = this.tasks.get(id);
		if (!task) {
			throw new Error(`Task not found: ${id}`);
		}

		// Guard: reject blocked → in_progress
		if (updates.status === 'in_progress' && task.status === 'blocked') {
			throw new Error(`Cannot start task ${id}: task is blocked by incomplete dependencies`);
		}

		Object.assign(task, updates);

		// Auto-unblock: when a task becomes committed or reviewed, check dependents
		if (updates.status === 'committed' || updates.status === 'reviewed') {
			this.unblockDependents(id);
		}

		return { ...task };
	}

	private unblockDependents(completedTaskId: string): void {
		for (const task of this.tasks.values()) {
			if (task.status !== 'blocked' || !task.dependencies?.includes(completedTaskId)) {
				continue;
			}
			const allMet = task.dependencies.every(depId => {
				const dep = this.tasks.get(depId);
				return dep && (dep.status === 'committed' || dep.status === 'reviewed');
			});
			if (allMet) {
				task.status = 'ready';
			}
		}
	}

	async listTasks(filters?: { status?: TaskStatus }): Promise<Task[]> {
		let tasks = Array.from(this.tasks.values());
		if (filters?.status) {
			tasks = tasks.filter(t => t.status === filters.status);
		}
		return tasks.map(t => ({ ...t }));
	}

	async addDependency(childId: string, parentId: string): Promise<void> {
		const child = this.tasks.get(childId);
		if (!child) {
			throw new Error(`Task not found: ${childId}`);
		}
		if (!this.tasks.has(parentId)) {
			throw new Error(`Task not found: ${parentId}`);
		}
		if (!child.dependencies) {
			child.dependencies = [];
		}
		child.dependencies.push(parentId);

		// Auto-block: if parent is not complete, block the child
		const parent = this.tasks.get(parentId)!;
		if (parent.status !== 'committed' && parent.status !== 'reviewed') {
			if (child.status === 'ready') {
				child.status = 'blocked';
			}
		}
	}
}
