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

test('createTask can create with blocked status', async () => {
		const task = await backend.createTask('Blocked Task', 'Description', 'blocked');
		assert.strictEqual(task.status, 'blocked');
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

test('updateTask can transition to blocked status', async () => {
		const task = await backend.createTask('Task', 'Desc', 'in_progress');
		const updated = await backend.updateTask(task.id, { status: 'blocked' });
		
		assert.strictEqual(updated.status, 'blocked');
	});

test('updateTask can transition from blocked to ready', async () => {
		const task = await backend.createTask('Task', 'Desc', 'blocked');
		const updated = await backend.updateTask(task.id, { status: 'ready' });
		
		assert.strictEqual(updated.status, 'ready');
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

test('listTasks filters blocked status correctly', async () => {
		await backend.createTask('Task 1', 'Desc 1', 'ready');
		await backend.createTask('Task 2', 'Desc 2', 'blocked');
		await backend.createTask('Task 3', 'Desc 3', 'blocked');
		
		const tasks = await backend.listTasks({ status: 'blocked' });
		assert.strictEqual(tasks.length, 2);
		assert.ok(tasks.every(t => t.status === 'blocked'));
	});

test('listTasks filters by branch', async () => {
		const task1 = await backend.createTask('Task 1', 'Desc 1', 'ready', 'feature/test');
		const task2 = await backend.createTask('Task 2', 'Desc 2', 'ready', 'feature/test');
		const task3 = await backend.createTask('Task 3', 'Desc 3', 'ready', 'feature/other');
		
		const tasks = await backend.listTasks({ branch: 'feature/test' });
		assert.strictEqual(tasks.length, 2);
		assert.ok(tasks.every(t => t.branch === 'feature/test'));
	});

test('updateTask can update branch', async () => {
		const task = await backend.createTask('Task', 'Desc', 'ready', 'feature/old');
		assert.strictEqual(task.branch, 'feature/old');
		
		const updated = await backend.updateTask(task.id, { branch: 'feature/new' });
		assert.strictEqual(updated.branch, 'feature/new');
	});

test('updateTask can clear branch', async () => {
		const task = await backend.createTask('Task', 'Desc', 'ready', 'feature/test');
		assert.strictEqual(task.branch, 'feature/test');
		
		const updated = await backend.updateTask(task.id, { branch: '' });
		assert.strictEqual(updated.branch, undefined);
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
});
