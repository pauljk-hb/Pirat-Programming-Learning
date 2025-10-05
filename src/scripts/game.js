import * as monaco from "monaco-editor";
import { getMonacoWorkerUrl } from "../Game/core/editor/monaco-worker-loader.js";
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
const resetCodeButton = document.getElementById("resetCode");
const instructionParent = document.getElementById("instructions");

const urlParams = new URLSearchParams(window.location.search);
const levelFile = urlParams.get("level");
const isCustomLevel = urlParams.get("custom") === "true";
// const levelFile = "level2.json";

// Initialisierung in async function wrappen
async function initGame() {
  configureMonacoEnvironment();
  const editor = createMonacoEditor("editor");
  registerCustomCompletionProvider();

  const gameAPI = new GameAPI(canvas, editor, logOutput);

  const instruktions = await gameAPI.initGame(levelFile, isCustomLevel);
  if (instruktions && instruktions.length > 0) {
    instructionParent.innerHTML = instruktions;
  }

  // Event-Listener für "Code ausführen"
  runButton.addEventListener("click", async () => {
    await gameAPI.runUserCode();
  });

  // Event-Listener für "Spiel zurücksetzen"
  resetButton.addEventListener("click", () => {
    gameAPI.resetGame();
  });

  resetCodeButton.addEventListener("click", () => {
    gameAPI.resetCode();
  });

  // Speichert den aktuellen Code im Local Storage, wenn der Editor geändert wird
  editor.onDidChangeModelContent(() => {
    const currentCode = editor.getValue();
    Utils.saveToStorage(`${levelFile}-userCode`, currentCode);
  });

  feather.replace();
}

// Initialisierung starten
initGame().catch(console.error);
