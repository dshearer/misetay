import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TaskBackend, Task } from './taskBackend';

/**
 * Manages the task status webview panel
 */
export class TaskStatusView {
	private panel: vscode.WebviewPanel | undefined;
	private getBackend: () => TaskBackend;
	private disposables: vscode.Disposable[] = [];
	private taskCardTemplate: string;

	constructor(private context: vscode.ExtensionContext, getBackend: () => TaskBackend) {
		this.getBackend = getBackend;
		
		// Load task card template
		const templatePath = path.join(this.context.extensionPath, 'webview', 'taskCard.html');
		this.taskCardTemplate = fs.readFileSync(templatePath, 'utf8');
	}

	/**
	 * Show the task status view
	 */
	public async show() {
		if (this.panel) {
			this.panel.reveal(vscode.ViewColumn.Two);
			await this.refresh();
			return;
		}

		this.panel = vscode.window.createWebviewPanel(
			'misetayTaskStatus',
			'Misetay Tasks',
			vscode.ViewColumn.Two,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
				localResourceRoots: []
			}
		);

		this.panel.onDidDispose(() => {
			this.panel = undefined;
		}, null, this.disposables);

		this.panel.webview.onDidReceiveMessage(
			async (message) => {
				if (message.type === 'refresh') {
					await this.refresh();
				}
			},
			null,
			this.disposables
		);

		await this.refresh();
	}

	/**
	 * Refresh the webview content
	 */
	public async refresh() {
		if (!this.panel) {
			return;
		}

		const tasks = await this.getBackend().listTasks();
		const html = this.getWebviewContent(tasks);
		this.panel.webview.html = html;
	}

	/**
	 * Generate HTML for the webview
	 */
	private getWebviewContent(tasks: Task[]): string {
		if (tasks.length === 0) {
			return this.getEmptyStateHtml();
		}

		const tasksByStatus = this.groupTasksByStatus(tasks);
		const tasksHtml = this.renderTasksByStatus(tasksByStatus);
		
		// Read the template file
		const templatePath = path.join(this.context.extensionPath, 'webview', 'taskStatus.html');
		const template = fs.readFileSync(templatePath, 'utf8');
		
		// Replace placeholder with actual content
		return template.replace('{{TASKS_CONTENT}}', tasksHtml);
	}

	/**
	 * Render tasks grouped by status
	 */
	private renderTasksByStatus(tasksByStatus: Map<string, Task[]>): string {
		const statusOrder: string[] = ['in_progress', 'ready', 'committed', 'reviewed'];
		let html = '';

		for (const status of statusOrder) {
			const tasks = tasksByStatus.get(status) || [];
			if (tasks.length === 0) {
				continue;
			}

			const statusLabel = status.replace('_', ' ').toUpperCase();
			html += `<div class="section-header">${statusLabel}</div>`;
			html += '<div class="tasks-container">';

			for (const task of tasks) {
				html += this.renderTask(task);
			}

			html += '</div>';
		}

		return html;
	}

	/**
	 * Render a single task card
	 */
	private renderTask(task: Task): string {
		// Build dependencies HTML if present
		const dependenciesHtml = task.dependencies && task.dependencies.length > 0 ? `
			<div class="dependencies">
				<div class="dependency-label">Depends on:</div>
				<div class="dependency-list">
					${task.dependencies.map(dep => 
						`<span class="dependency-tag">${this.escapeHtml(dep)}</span>`
					).join('')}
				</div>
			</div>
		` : '';
		
		// Replace placeholders in template
		return this.taskCardTemplate
			.replace(/{{STATUS}}/g, task.status)
			.replace('{{TASK_ID}}', this.escapeHtml(task.id))
			.replace('{{TASK_TITLE}}', this.escapeHtml(task.title))
			.replace('{{STATUS_LABEL}}', task.status.replace('_', ' '))
			.replace('{{TASK_DESCRIPTION}}', this.escapeHtml(task.description))
			.replace('{{DEPENDENCIES_HTML}}', dependenciesHtml);
	}

	/**
	 * Generate empty state HTML
	 */
	private getEmptyStateHtml(): string {
		const templatePath = path.join(this.context.extensionPath, 'webview', 'taskStatusEmpty.html');
		return fs.readFileSync(templatePath, 'utf8');
	}

	/**
	 * Group tasks by status
	 */
	private groupTasksByStatus(tasks: Task[]): Map<string, Task[]> {
		const grouped = new Map<string, Task[]>();
		for (const task of tasks) {
			const statusTasks = grouped.get(task.status) || [];
			statusTasks.push(task);
			grouped.set(task.status, statusTasks);
		}
		return grouped;
	}

	/**
	 * Escape HTML to prevent XSS
	 */
	private escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	/**
	 * Dispose of resources
	 */
	public dispose() {
		this.disposables.forEach(d => d.dispose());
		this.panel?.dispose();
	}
}
