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
		Object.assign(task, updates);
		return { ...task };
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
	}
}
