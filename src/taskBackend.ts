import * as vscode from 'vscode';

/**
 * Task status values (Smidja workflow statuses)
 */
export type TaskStatus = 'ready' | 'in_progress' | 'blocked' | 'committed' | 'reviewed';

/**
 * Task object returned by backend
 */
export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	branch?: string;
	dependencies?: string[];
}

/**
 * Interface that task backends must implement
 */
export interface TaskBackend {
	/**
	 * Create a new task
	 */
	createTask(title: string, description: string, status?: TaskStatus, branch?: string): Promise<Task>;

	/**
	 * Update an existing task
	 */
	updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task>;

	/**
	 * List tasks, optionally filtered
	 */
	listTasks(filters?: { status?: TaskStatus; branch?: string }): Promise<Task[]>;

	/**
	 * Add a dependency relationship (childId depends on parentId)
	 */
	addDependency(childId: string, parentId: string): Promise<void>;
}
