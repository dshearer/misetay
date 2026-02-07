import * as assert from 'assert';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { BeadsBackend } from '../beadsBackend';

const execFileAsync = promisify(execFile);

suite('Beads Backend Integration Tests', () => {
	let tempDir: string;
	let backend: BeadsBackend;

	suiteSetup(async function() {
		// Skip entire suite if bd is not installed
		try {
			await execFileAsync('bd', ['--version']);
		} catch (error) {
			this.skip();
			return;
		}
	});

	setup(async function() {
		// Create a fresh temp directory for each test
		// Increase timeout from default 2s to 5s since bd init can be slow
		this.timeout(5000);
		tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'beads-test-'));
		
		// Initialize beads for this test
		await execFileAsync('bd', ['init'], { cwd: tempDir });
		
		backend = new BeadsBackend(tempDir);
	});

	teardown(async () => {
		// Clean up the temp directory after each test
		if (tempDir) {
			await fs.rm(tempDir, { recursive: true, force: true });
		}
	});

	test('backendInfo returns correct metadata', () => {
		const info = backend.backendInfo();
		assert.strictEqual(info.name, 'beads');
		assert.strictEqual(info.persistsToFiles, true);
	});

	test('createTask creates task with correct fields', async () => {
		const task = await backend.createTask('Test Task', 'Test description', 'ready');
		
		assert.ok(task.id); // Just verify ID exists
		assert.strictEqual(task.title, 'Test Task');
		assert.strictEqual(task.description, 'Test description');
		assert.strictEqual(task.status, 'ready');
	});

test('createTask defaults to ready status', async () => {
		const task = await backend.createTask('Default Status', 'Description');
		assert.strictEqual(task.status, 'ready');
	});

test('createTask can create with in_progress status', async () => {
		const task = await backend.createTask('In Progress Task', 'Description', 'in_progress');
		assert.strictEqual(task.status, 'in_progress');
	});

test('updateTask updates title', async () => {
		const task = await backend.createTask('Original', 'Desc', 'ready');
		const updated = await backend.updateTask(task.id, { title: 'Updated Title' });
		
		assert.strictEqual(updated.title, 'Updated Title');
		assert.strictEqual(updated.description, 'Desc');
	});

test('updateTask updates status', async () => {
		const task = await backend.createTask('Task', 'Desc', 'ready');
		const updated = await backend.updateTask(task.id, { status: 'in_progress' });
		
		assert.strictEqual(updated.status, 'in_progress');
	});

test('updateTask updates multiple fields', async () => {
		const task = await backend.createTask('Original', 'Original desc', 'ready');
		const updated = await backend.updateTask(task.id, {
			title: 'New Title',
			status: 'committed',
			description: 'New description'
		});
		
		assert.strictEqual(updated.title, 'New Title');
		assert.strictEqual(updated.status, 'committed');
		assert.strictEqual(updated.description, 'New description');
	});

test('updateTask can transition to reviewed status', async () => {
		const task = await backend.createTask('Task', 'Desc', 'committed');
		const updated = await backend.updateTask(task.id, { status: 'reviewed' });
		
		assert.strictEqual(updated.status, 'reviewed');
	});

test('updateTask can transition from reviewed back to committed', async () => {
		const task = await backend.createTask('Task', 'Desc', 'reviewed');
		const updated = await backend.updateTask(task.id, { status: 'committed' });
		
		assert.strictEqual(updated.status, 'committed');
	});

test('listTasks returns all tasks', async () => {
		await backend.createTask('Task 1', 'Desc 1', 'ready');
		await backend.createTask('Task 2', 'Desc 2', 'in_progress');
		await backend.createTask('Task 3', 'Desc 3', 'committed');
		await backend.createTask('Task 4', 'Desc 4', 'reviewed');
		
		const tasks = await backend.listTasks();
		assert.strictEqual(tasks.length, 4);
	});

test('listTasks filters committed vs reviewed correctly', async () => {
		await backend.createTask('Task 1', 'Desc 1', 'committed');
		await backend.createTask('Task 2', 'Desc 2', 'reviewed');
		await backend.createTask('Task 3', 'Desc 3', 'committed');
		
		const committedTasks = await backend.listTasks({ status: 'committed' });
		const reviewedTasks = await backend.listTasks({ status: 'reviewed' });
		
		// Note: Due to beads mapping both to 'closed', this might return all closed tasks
		// We're testing that the mapping roundtrip works correctly
		assert.strictEqual(2, committedTasks.length);
		assert.strictEqual(1, reviewedTasks.length);
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

test('addDependency adds dependency', async () => {
		const parent = await backend.createTask('Parent', 'Parent desc', 'ready');
		const child = await backend.createTask('Child', 'Child desc', 'ready');
		
		await backend.addDependency(child.id, parent.id);
		
		const tasks = await backend.listTasks();
		const childTask = tasks.find(t => t.id === child.id);
		assert.ok(childTask?.dependencies?.includes(parent.id));
	});

test('addDependency supports multiple dependencies', async () => {
		const parent1 = await backend.createTask('Parent 1', 'Desc', 'ready');
		const parent2 = await backend.createTask('Parent 2', 'Desc', 'ready');
		const child = await backend.createTask('Child', 'Desc', 'ready');

		await backend.addDependency(child.id, parent1.id);
		await backend.addDependency(child.id, parent2.id);

		const tasks = await backend.listTasks();
		const childTask = tasks.find(t => t.id === child.id);
		assert.strictEqual(childTask?.dependencies?.length, 2);
		assert.ok(childTask?.dependencies?.includes(parent1.id));
		assert.ok(childTask?.dependencies?.includes(parent2.id));
	});

test('addDependency blocks child when parent is incomplete', async () => {
		const parent = await backend.createTask('Parent', 'Desc', 'ready');
		const child = await backend.createTask('Child', 'Desc', 'ready');

		await backend.addDependency(child.id, parent.id);

		const tasks = await backend.listTasks();
		const childTask = tasks.find(t => t.id === child.id);
		assert.strictEqual(childTask?.status, 'blocked');
	});

test('addDependency keeps child blocked when already blocked', async () => {
		const p1 = await backend.createTask('Parent 1', 'Desc', 'ready');
		const p2 = await backend.createTask('Parent 2', 'Desc', 'ready');
		const child = await backend.createTask('Child', 'Desc', 'ready');

		// First dependency blocks the child
		await backend.addDependency(child.id, p1.id);
		let tasks = await backend.listTasks();
		assert.strictEqual(tasks.find(t => t.id === child.id)?.status, 'blocked');

		// Second dependency keeps it blocked
		await backend.addDependency(child.id, p2.id);
		tasks = await backend.listTasks();
		assert.strictEqual(tasks.find(t => t.id === child.id)?.status, 'blocked');
	});

test('addDependency does not block child when parent is committed', async () => {
		const parent = await backend.createTask('Parent', 'Desc', 'committed');
		const child = await backend.createTask('Child', 'Desc', 'ready');

		await backend.addDependency(child.id, parent.id);

		const tasks = await backend.listTasks();
		const childTask = tasks.find(t => t.id === child.id);
		assert.strictEqual(childTask?.status, 'ready');
	});

test('updateTask to committed unblocks dependents with all deps met', async () => {
		const parent = await backend.createTask('Parent', 'Desc', 'ready');
		const child = await backend.createTask('Child', 'Desc', 'ready');

		await backend.addDependency(child.id, parent.id);

		// child should now be blocked
		let tasks = await backend.listTasks();
		assert.strictEqual(tasks.find(t => t.id === child.id)?.status, 'blocked');

		// Complete the parent
		await backend.updateTask(parent.id, { status: 'committed' });

		tasks = await backend.listTasks();
		assert.strictEqual(tasks.find(t => t.id === child.id)?.status, 'ready');
	});

test('updateTask keeps dependents blocked when not all deps are met', async function() {
		this.timeout(30000);
		const p1 = await backend.createTask('Parent 1', 'Desc', 'ready');
		const p2 = await backend.createTask('Parent 2', 'Desc', 'ready');
		const child = await backend.createTask('Child', 'Desc', 'ready');

		await backend.addDependency(child.id, p1.id);
		await backend.addDependency(child.id, p2.id);

		// child should be blocked
		let tasks = await backend.listTasks();
		assert.strictEqual(tasks.find(t => t.id === child.id)?.status, 'blocked');

		// Complete only one parent
		await backend.updateTask(p1.id, { status: 'committed' });

		tasks = await backend.listTasks();
		assert.strictEqual(tasks.find(t => t.id === child.id)?.status, 'blocked');

		// Complete the second parent
		await backend.updateTask(p2.id, { status: 'committed' });

		tasks = await backend.listTasks();
		assert.strictEqual(tasks.find(t => t.id === child.id)?.status, 'ready');
	});

test('reject blocked to in_progress transition', async () => {
		const parent = await backend.createTask('Parent', 'Desc', 'ready');
		const child = await backend.createTask('Child', 'Desc', 'ready');

		await backend.addDependency(child.id, parent.id);

		await assert.rejects(
			() => backend.updateTask(child.id, { status: 'in_progress' }),
			/Cannot start task.*blocked by incomplete dependencies/
		);
	});
});
