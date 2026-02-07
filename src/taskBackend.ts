/**
 * Task status values (Misatay workflow statuses)
 */
export type TaskStatus = 'ready' | 'in_progress' | 'committed' | 'reviewed';

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
