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
    theme: "beginner-friendly-light",
    automaticLayout: true,
    suggest: {
      showWords: false, // Deaktiviert allgemeine Wortvorschläge
    },
  });

  configureCustomJsHighlighting();
  return editor;
}

export function configureCustomJsHighlighting() {
  monaco.languages.setMonarchTokensProvider("custom-js", {
    tokenizer: {
      root: [
        // Schlüsselwörter (if, else, for, function, return, etc.)
        [/\b(function|if|else|while|for|return|let|const|var)\b/, "keyword"],

        // Wahrheitswerte & Null-Werte (true, false, null, undefined)
        [/\b(true|false|null|undefined)\b/, "boolean"],

        // Zahlen (0-9, auch Dezimalzahlen)
        [/\b\d+(\.\d+)?\b/, "number"],

        // Zeichenketten ("Text" oder 'Text')
        [/".*?"|'.*?'/, "string"],

        // Kommentare (// oder /* */)
        [/\/\/.*/, "comment"],
        [/\/\*[\s\S]*?\*\//, "comment"],

        // Funktionen (z. B. move(), setMarker())
        [
          /\b(move|setMarker|turnLeft|noWater|onTreasure|vor|links|vorneFrei|setzteMarkierung|aufSchatz)\b(?=\()/,
          "function",
        ],

        // Standard-Objekte (console, Math, Date, etc.)
        [/\b(console|Math|Date|String|Array|Object)\b/, "type"],

        // Variablen & Namen
        [/[A-Za-z_$][\w$]*/, "identifier"],
      ],
    },
  });

  monaco.languages.setLanguageConfiguration("custom-js", {
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"],
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });
}

monaco.editor.defineTheme("beginner-friendly-light", {
  base: "vs", // Light Mode
  inherit: true,
  rules: [
    { token: "keyword", foreground: "007ACC", fontStyle: "bold" }, // Blau für Schlüsselwörter
    { token: "boolean", foreground: "1A8F79", fontStyle: "bold" }, // Türkis für Wahrheitswerte
    { token: "number", foreground: "686868" }, // Grau für Zahlen
    { token: "string", foreground: "008000" }, // Grün für Strings
    { token: "comment", foreground: "7A7A7A", fontStyle: "italic" }, // Grau für Kommentare
    { token: "function", foreground: "D44C8A" }, // Lila für Funktionen
    { token: "type", foreground: "B5C634" }, // Gelb für Standard-Objekte
    { token: "identifier", foreground: "000000" }, // Schwarz für Variablen
  ],
  colors: {
    "editor.background": "#FFFFFF", // Weißer Hintergrund
    "editor.foreground": "#000000", // Schwarzer Text
  },
});

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
          label: "Function",
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
        {
          label: "true",
          kind: monaco.languages.CompletionItemKind.Keyword,
          documentation: "Boolean value representing true",
          insertText: "true",
        },
        {
          label: "false",
          kind: monaco.languages.CompletionItemKind.Keyword,
          documentation: "Boolean value representing false",
          insertText: "false",
        },
      ];
      return { suggestions };
    },
  });
}
