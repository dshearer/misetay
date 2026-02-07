import * as vscode from 'vscode';
import * as path from 'path';
import { Highlighter } from './highlighter';

/**
 * Register file navigation tools for code review
 */
export function registerNavigationTools(context: vscode.ExtensionContext) {
	
	// Register openFile tool
	const openFileTool = vscode.lm.registerTool('misatay_openFile', {
		async invoke(options, token) {
			const { filePath: filePathInput, line } = options.input as { filePath: string; line?: number };

			try {
				const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
				if (!workspaceRoot) {
					throw new Error('No workspace folder open');
				}

				// Resolve relative path to absolute
				const absolutePath = path.isAbsolute(filePathInput) 
					? filePathInput 
					: path.join(workspaceRoot, filePathInput);

				const uri = vscode.Uri.file(absolutePath);
				const document = await vscode.workspace.openTextDocument(uri);
				const editor = await vscode.window.showTextDocument(document, {
					preview: false,
					viewColumn: vscode.ViewColumn.One
				});

				// If line number provided, move cursor there
				if (line !== undefined && line > 0) {
					const position = new vscode.Position(line - 1, 0); // Convert to 0-based
					editor.selection = new vscode.Selection(position, position);
					editor.revealRange(
						new vscode.Range(position, position),
						vscode.TextEditorRevealType.InCenter
					);
				}

				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Opened file: ${filePathInput}${line ? ` at line ${line}` : ''}`)
				]);
			} catch (error: any) {
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Error opening file: ${error.message}`)
				]);
			}
		},

		prepareInvocation(options, token) {
			const { filePath, line } = options.input as { filePath: string; line?: number };
			return {
				invocationMessage: `Opening ${filePath}${line ? ` at line ${line}` : ''}`
			};
		}
	});

	const highlighter = new Highlighter();

	// Register highlightLines tool
	const highlightLinesTool = vscode.lm.registerTool('misatay_highlightLines', {
		async invoke(options, token) {
			const { startLine, endLine } = options.input as { startLine: number; endLine: number };

			try {
				const editor = vscode.window.activeTextEditor;
				if (!editor) {
					throw new Error('No active text editor');
				}

				// Convert to 0-based indexing
				const start = new vscode.Position(startLine - 1, 0);
				const end = new vscode.Position(endLine - 1, Number.MAX_VALUE);
				const range = new vscode.Range(start, end);

				// Set selection to highlight the lines
				highlighter.applyHighlight(editor, range);
				
				// Reveal the range
				editor.revealRange(range, vscode.TextEditorRevealType.InCenter);

				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Highlighted lines ${startLine}-${endLine}`)
				]);
			} catch (error: any) {
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Error highlighting lines: ${error.message}`)
				]);
			}
		},

		prepareInvocation(options, token) {
			const { startLine, endLine } = options.input as { startLine: number; endLine: number };
			return {
				invocationMessage: `Highlighting lines ${startLine}-${endLine}`
			};
		}
	});

	// Register navigateToLine tool
	const navigateToLineTool = vscode.lm.registerTool('misatay_navigateToLine', {
		async invoke(options, token) {
			const { line } = options.input as { line: number };

			try {
				const editor = vscode.window.activeTextEditor;
				if (!editor) {
					throw new Error('No active text editor');
				}

				// Convert to 0-based indexing
				const position = new vscode.Position(line - 1, 0);
				
				// Move cursor and center in viewport
				editor.selection = new vscode.Selection(position, position);
				editor.revealRange(
					new vscode.Range(position, position),
					vscode.TextEditorRevealType.InCenter
				);

				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Navigated to line ${line}`)
				]);
			} catch (error: any) {
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Error navigating to line: ${error.message}`)
				]);
			}
		},

		prepareInvocation(options, token) {
			const { line } = options.input as { line: number };
			return {
				invocationMessage: `Navigating to line ${line}`
			};
		}
	});

	// Register clearHighlights tool
	const clearHighlights = vscode.lm.registerTool('misatay_clearHighlights', {
		async invoke(options, token) {
			try {
				highlighter.clearHighlights();
			} catch (error: any) {
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(`Failed to clear highlights: ${error.message}`)
				]);
			}
		},

		prepareInvocation(options, token) {
			const { line } = options.input as { line: number };
			return {
				invocationMessage: `Clearing highlights`
			};
		},
	});

	context.subscriptions.push(openFileTool, highlightLinesTool, navigateToLineTool);
	console.log('Misatay: Registered 3 navigation tools');
}
