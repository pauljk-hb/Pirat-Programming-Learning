import * as monaco from "monaco-editor";
import { getMonacoWorkerUrl } from "../core/editor/monaco-worker-loader.js";
import { GameAPI } from "../GameAPI";
import {
  configureMonacoEnvironment,
  createMonacoEditor,
  registerCustomCompletionProvider,
} from "../core/editor/monaco-config.js";
import "monaco-editor/min/vs/editor/editor.main.css";

const canvas = document.getElementById("gameCanvas");
const logOutput = document.getElementById("logOutput");
const runButton = document.getElementById("runCode");
const resetButton = document.getElementById("resetGame");

// const urlParams = new URLSearchParams(window.location.search);
// const levelFile = urlParams.get("level");
const levelFile = "level1.json";

configureMonacoEnvironment();
const editor = createMonacoEditor("editor");
registerCustomCompletionProvider();

const gameAPI = new GameAPI(canvas, editor, logOutput);

gameAPI.initGame(levelFile);

// Event-Listener für "Code ausführen"
runButton.addEventListener("click", async () => {
  await gameAPI.runUserCode();
});

// Event-Listener für "Spiel zurücksetzen"
resetButton.addEventListener("click", () => {
  gameAPI.resetGame();
});

const stopButton = document.getElementById("stopCode");

stopButton.addEventListener("click", () => {
  gameAPI.stopUserCode();
});
