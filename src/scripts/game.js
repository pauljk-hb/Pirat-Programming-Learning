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

// const gameAPI = new GameAPI(canvas, logOutput, levelFile);

configureMonacoEnvironment();
const editor = createMonacoEditor("editor");
registerCustomCompletionProvider();
