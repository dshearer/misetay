import * as vscode from "vscode";

export class Highlighter {
    private highlightDecoration: vscode.TextEditorDecorationType | undefined;

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