import * as assert from 'assert';
import { InMemoryBackend } from '../inMemoryBackend';

suite('InMemoryBackend Tests', () => {
	let backend: InMemoryBackend;

	setup(() => {
		backend = new InMemoryBackend();
	});

	test('backendInfo returns correct metadata', () => {
		const info = backend.backendInfo();
		assert.strictEqual(info.name, 'inMemory');
		assert.strictEqual(info.persistsToFiles, false);
	});

	test('createTask returns task with mem-N ID', async () => {
		const task = await backend.createTask('Test Task', 'Test description', 'ready');

		assert.strictEqual(task.id, 'mem-1');
		assert.strictEqual(task.title, 'Test Task');
		assert.strictEqual(task.description, 'Test description');
		assert.strictEqual(task.status, 'ready');
	});

	test('createTask assigns sequential IDs', async () => {
		const t1 = await backend.createTask('Task 1', 'Desc 1');
		const t2 = await backend.createTask('Task 2', 'Desc 2');
		const t3 = await backend.createTask('Task 3', 'Desc 3');

		assert.strictEqual(t1.id, 'mem-1');
		assert.strictEqual(t2.id, 'mem-2');
		assert.strictEqual(t3.id, 'mem-3');
	});

	test('createTask defaults to ready status', async () => {
		const task = await backend.createTask('Default Status', 'Description');
		assert.strictEqual(task.status, 'ready');
	});

	test('updateTask updates fields', async () => {
		const task = await backend.createTask('Original', 'Desc', 'ready');
		const updated = await backend.updateTask(task.id, { title: 'Updated', status: 'in_progress' });

		assert.strictEqual(updated.title, 'Updated');
		assert.strictEqual(updated.status, 'in_progress');
		assert.strictEqual(updated.description, 'Desc');
	});

	test('updateTask throws for nonexistent task', async () => {
		await assert.rejects(
			() => backend.updateTask('mem-999', { title: 'Nope' }),
			/Task not found: mem-999/
		);
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

	test('listTasks returns empty array when no tasks', async () => {
		const tasks = await backend.listTasks();
		assert.strictEqual(tasks.length, 0);
	});

	test('addDependency records dependency', async () => {
		const parent = await backend.createTask('Parent', 'Desc', 'ready');
		const child = await backend.createTask('Child', 'Desc', 'ready');

		await backend.addDependency(child.id, parent.id);

		const tasks = await backend.listTasks();
		const childTask = tasks.find(t => t.id === child.id);
		assert.ok(childTask?.dependencies?.includes(parent.id));
	});

	test('addDependency supports multiple dependencies', async () => {
		const p1 = await backend.createTask('Parent 1', 'Desc', 'ready');
		const p2 = await backend.createTask('Parent 2', 'Desc', 'ready');
		const child = await backend.createTask('Child', 'Desc', 'ready');

		await backend.addDependency(child.id, p1.id);
		await backend.addDependency(child.id, p2.id);

		const tasks = await backend.listTasks();
		const childTask = tasks.find(t => t.id === child.id);
		assert.strictEqual(childTask?.dependencies?.length, 2);
		assert.ok(childTask?.dependencies?.includes(p1.id));
		assert.ok(childTask?.dependencies?.includes(p2.id));
	});

	test('addDependency throws for nonexistent child', async () => {
		const parent = await backend.createTask('Parent', 'Desc', 'ready');
		await assert.rejects(
			() => backend.addDependency('mem-999', parent.id),
			/Task not found: mem-999/
		);
	});

	test('addDependency throws for nonexistent parent', async () => {
		const child = await backend.createTask('Child', 'Desc', 'ready');
		await assert.rejects(
			() => backend.addDependency(child.id, 'mem-999'),
			/Task not found: mem-999/
		);
	});

	test('returned tasks are copies (not references)', async () => {
		const task = await backend.createTask('Test', 'Desc', 'ready');
		task.title = 'Mutated';

		const tasks = await backend.listTasks();
		assert.strictEqual(tasks[0].title, 'Test');
	});
});
