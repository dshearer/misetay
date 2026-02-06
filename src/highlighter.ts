import * as vscode from "vscode";

export class Highlighter {
    private highlightDecoration: vscode.TextEditorDecorationType | undefined;

    private clampLine(line: number, document: vscode.TextDocument): number {
        const maxLine = document.lineCount;
        if (line < 1) {
            return 1;
        }
        if (line > maxLine) {
            return maxLine;
        }
        return line;
    }

    clearHighlights() {
        if (this.highlightDecoration) {
            this.highlightDecoration.dispose();
            this.highlightDecoration = undefined;
        }
    }

    applyHighlight(
        editor: vscode.TextEditor,
        range: vscode.Range,
    ) {
        this.clearHighlights();

        this.highlightDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor(
                "editor.findMatchHighlightBackground"
            ),
            isWholeLine: true,
        });

        editor.setDecorations(this.highlightDecoration, [range]);
    }
}