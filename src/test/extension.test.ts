import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Running Misatay tests...');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('dshearer.misatay'));
	});

	test('Extension should activate', async () => {
		const ext = vscode.extensions.getExtension('dshearer.misatay');
		assert.ok(ext);
		await ext.activate();
		assert.strictEqual(ext.isActive, true);
	});

	test('At least one Misatay tool is registered', () => {
		const tools = vscode.lm.tools;
		const misatayTools = tools.filter(t => t.name.startsWith('misatay_'));
		assert.ok(misatayTools.length > 0, 'At least one misatay_ tool should be registered');
	});
});
