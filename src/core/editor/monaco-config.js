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
  // Custom Autovervollständigung für unsere eigene Sprache "custom-js"
  monaco.languages.registerCompletionItemProvider("custom-js", {
    provideCompletionItems: () => {
      const suggestions = [
        {
          label: "log",
          kind: monaco.languages.CompletionItemKind.Function,
          documentation: "Log a message to the console",
          insertText: "console.log(${1:message});",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
          label: "forLoop",
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: "Create a for loop",
          insertText:
            "for (let ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n\t$0\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
      ];
      return { suggestions };
    },
  });
}
