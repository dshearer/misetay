import * as assert from 'assert';
import * as vscode from 'vscode';
import { TaskBackend, Task, TaskStatus } from '../taskBackend';

/**
 * Mock task backend for testing
 */
class MockTaskBackend implements TaskBackend {
	private tasks: Map<string, Task> = new Map();
	private nextId = 1;
	private dependencies: Map<string, Set<string>> = new Map();

	async createTask(title: string, description: string, status: TaskStatus = 'ready'): Promise<Task> {
		const id = `test-${this.nextId++}`;
		const task: Task = {
			id,
			title,
			description,
			status,
			dependencies: []
		};
		this.tasks.set(id, task);
		return task;
	}

	async updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task> {
		const task = this.tasks.get(id);
		if (!task) {
			throw new Error(`Task ${id} not found`);
		}
		Object.assign(task, updates);
		return task;
	}

	async listTasks(filters?: { status?: TaskStatus; branch?: string }): Promise<Task[]> {
		let tasks = Array.from(this.tasks.values());

		if (filters?.status) {
			tasks = tasks.filter(t => t.status === filters.status);
		}
		if (filters?.branch) {
			tasks = tasks.filter(t => t.branch === filters.branch);
		}

		return tasks;
	}

	async addDependency(childId: string, parentId: string): Promise<void> {
		if (!this.dependencies.has(childId)) {
			this.dependencies.set(childId, new Set());
		}
		this.dependencies.get(childId)!.add(parentId);

		const task = this.tasks.get(childId);
		if (task) {
			task.dependencies = Array.from(this.dependencies.get(childId)!);
		}
	}

	clear() {
		this.tasks.clear();
		this.dependencies.clear();
		this.nextId = 1;
	}
}

suite('Task Backend Tests', () => {
	let backend: MockTaskBackend;

	setup(() => {
		backend = new MockTaskBackend();
	});

	test('createTask creates a task with correct fields', async () => {
		const task = await backend.createTask('Test Task', 'Description', 'ready');
		
		assert.strictEqual(task.title, 'Test Task');
		assert.strictEqual(task.description, 'Description');
		assert.strictEqual(task.status, 'ready');
		assert.ok(task.id);
	});

	test('updateTask updates task fields', async () => {
		const task = await backend.createTask('Original', 'Desc', 'ready');
		const updated = await backend.updateTask(task.id, { 
			status: 'in_progress',
			title: 'Updated'
		});

		assert.strictEqual(updated.title, 'Updated');
		assert.strictEqual(updated.status, 'in_progress');
	});

	test('listTasks returns all tasks', async () => {
		await backend.createTask('Task 1', 'Desc 1', 'ready');
		await backend.createTask('Task 2', 'Desc 2', 'in_progress');
		
		const tasks = await backend.listTasks();
		assert.strictEqual(tasks.length, 2);
	});

	test('listTasks filters by status', async () => {
		await backend.createTask('Task 1', 'Desc 1', 'ready');
		await backend.createTask('Task 2', 'Desc 2', 'in_progress');
		await backend.createTask('Task 3', 'Desc 3', 'ready');
		
		const tasks = await backend.listTasks({ status: 'ready' });
		assert.strictEqual(tasks.length, 2);
		assert.ok(tasks.every(t => t.status === 'ready'));
	});

	test('addDependency records dependency', async () => {
		const parent = await backend.createTask('Parent', 'Parent task', 'ready');
		const child = await backend.createTask('Child', 'Child task', 'ready');
		
		await backend.addDependency(child.id, parent.id);
		
		const tasks = await backend.listTasks();
		const childTask = tasks.find(t => t.id === child.id);
		assert.ok(childTask?.dependencies?.includes(parent.id));
	});
});
