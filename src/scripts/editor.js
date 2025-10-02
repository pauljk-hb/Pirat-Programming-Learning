import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import { marked } from "marked";

import { GameAPI } from "../Game/GameAPI";
import {
  configureMonacoEnvironment,
  createMonacoEditor,
  registerCustomCompletionProvider,
} from "../Game/core/editor/monaco-config.js";
import "monaco-editor/min/vs/editor/editor.main.css";
import feather from "feather-icons";
import { Utils } from "../Game/core/Utils.js";

const canvas = document.getElementById("gameCanvas");
const logOutput = document.getElementById("logOutput");
const runButton = document.getElementById("runCode");
const resetButton = document.getElementById("resetGame");

configureMonacoEnvironment();
const editor = createMonacoEditor("editor");
registerCustomCompletionProvider();

const gameAPI = new GameAPI(canvas, editor, logOutput);

const instruktions = await gameAPI.initGame("level1.json");

// Event-Listener für "Code ausführen"
runButton.addEventListener("click", async () => {
  await gameAPI.runUserCode();
});

// Event-Listener für "Spiel zurücksetzen"
resetButton.addEventListener("click", () => {
  gameAPI.resetGame();
  gameAPI.resetCode();
});

// Speichert den aktuellen Code im Local Storage, wenn der Editor geändert wird
editor.onDidChangeModelContent(() => {
  const currentCode = editor.getValue();
  Utils.saveToStorage(`${levelFile}-userCode`, currentCode);
});

feather.replace();

console.log(document.getElementById("instructions-editor"));

const easyMDE = new EasyMDE({
  element: document.getElementById("instructions-editor"),
  toolbar: [
    "bold", // Fett
    "italic", // Kursiv
    "|", // Trennlinie
    "heading-3", // Erstellt eine H3-Überschrift
    "|",
    "unordered-list", // Aufzählungspunkt
    "ordered-list", // Nummerierte Liste
    "|",
    "link", // Link
    "|",
    "code", // Vorschau
    "|",
    "preview", // Vorschau umschalten
  ],
});

easyMDE.codemirror.on("change", () => {
  const currentInstructions = easyMDE.value();

  //Markdown-Inhalt zu HTML umwandeln
  const htmlInstructions = marked.parse(currentInstructions);

  gameAPI.setHTMLinstructions(htmlInstructions);
});
