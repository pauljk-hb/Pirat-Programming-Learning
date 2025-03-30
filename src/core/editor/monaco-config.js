import * as monaco from "monaco-editor";
import { getMonacoWorkerUrl } from "./monaco-worker-loader.js";

export function configureMonacoEnvironment() {
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      return getMonacoWorkerUrl(label);
    },
  };
}

export function createMonacoEditor(containerId) {
  // Dummy-Sprache registrieren, um Standard-JS-Vorschläge zu deaktivieren
  monaco.languages.register({ id: "custom-js" });

  // Editor erstellen
  const editor = monaco.editor.create(document.getElementById(containerId), {
    language: "custom-js", // Verwenden einer Dummy-Sprache
    suggest: {
      showWords: false, // Deaktiviert allgemeine Wortvorschläge
    },
  });

  return editor;
}

export function registerCustomCompletionProvider() {
  monaco.languages.registerCompletionItemProvider("custom-js", {
    provideCompletionItems: () => {
      const suggestions = [
        {
          label: "for-Schleife",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "Create a for loop",
          insertText:
            "for (let ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n\t$0\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
          label: "while-Schleife",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "Create a while loop",
          insertText: "while (${1:condition}) {\n\t$0\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
          label: "if-Abfrage",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "If statement",
          insertText: "if (${1:condition}) {\n\t$0\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
          label: "ifElse-Abfrage",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "If-Else statement",
          insertText: "if (${1:condition}) {\n\t$0\n} else {\n\t\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
          label: "Function deklaration",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "Create a function",
          insertText: "function ${1:functionName}(${2:params}) {\n\t$0\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
          label: "move()",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation:
            "Bewegt den Spieler einen Schritt in die aktuelle Richtung.",
          insertText: "move()",
        },
        {
          label: "turnLeft()",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: "Dreht den Spieler um 90° nach links.",
          insertText: "turnLeft()",
        },
        {
          label: "noWater()",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: "Prüft, ob vor dem Spieler Land (kein Wasser) ist.",
          insertText: "noWater()",
        },
        {
          label: "setMarker()",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation:
            "Setzt eine Markierung an der aktuellen Position des Spielers.",
          insertText: "setMarker()",
        },
        {
          label: "onTreasure()",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: "Prüft, ob der Spieler auf dem Schatz steht.",
          insertText: "onTreasure()",
        },
        {
          label: "vor()",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation:
            "Bewegt den Spieler einen Schritt in die aktuelle Richtung.",
          insertText: "vor()",
        },
        {
          label: "links()",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: "Dreht den Spieler um 90° nach links.",
          insertText: "links()",
        },
        {
          label: "vorneFrei()",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: "Prüft, ob vor dem Spieler Land (kein Wasser) ist.",
          insertText: "vorneFrei()",
        },
        {
          label: "setzteMarkierung()",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation:
            "Setzt eine Markierung an der aktuellen Position des Spielers.",
          insertText: "setzteMarkierung()",
        },
        {
          label: "aufSchatz()",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: "Prüft, ob der Spieler auf dem Schatz steht.",
          insertText: "aufSchatz()",
        },
      ];
      return { suggestions };
    },
  });
}
