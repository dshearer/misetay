import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/{extension,taskTools}.test.js', // Exclude beadsBackend - run with npm run test:fast
	installExtensions: ['dshearer.beatrice@prerelease'],
});
