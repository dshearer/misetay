/**
 * Task status values (Misatay workflow statuses)
 */
export type TaskStatus = 'ready' | 'in_progress' | 'committed' | 'reviewed' | 'blocked' | 'needs_help';

/**
 * Task object returned by backend
 */
export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	dependencies?: string[];
}

/**
 * Metadata about the active backend
 */
export interface BackendInfo {
	name: string;
	persistsToFiles: boolean;
}

/**
 * Interface that task backends must implement
 */
export interface TaskBackend {
	/**
	 * Return metadata about this backend
	 */
	backendInfo(): BackendInfo;

	/**
	 * Initialize the task backend for the current workspace.
	 * For backends that persist to files, this creates the necessary
	 * directory structure. No-op if already initialized.
	 */
	init(): Promise<string>;

	/**
	 * Create a new task
	 */
	createTask(title: string, description: string, status?: TaskStatus): Promise<Task>;

	/**
	 * Update an existing task
	 */
	updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task>;

	/**
	 * List tasks, optionally filtered
	 */
	listTasks(filters?: { status?: TaskStatus }): Promise<Task[]>;

	/**
	 * Add a dependency relationship (childId depends on parentId)
	 */
	addDependency(childId: string, parentId: string): Promise<void>;
}
