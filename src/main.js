import * as monaco from "monaco-editor";
import { parsedCode } from "./codePaser.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runCode");

const gridSize = 50;
const rows = 10;
const cols = 10;

let player = { x: 1, y: 9, direction: "up" };
let treasure = { x: 8, y: 6 };

const map = [
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 0, 0, 1, 1],
  [1, 0, 1, 1, 1, 1, 0, 0, 1, 1],
  [1, 0, 1, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      ctx.fillStyle = map[y][x] === 1 ? "#a3d977" : "#6fb3d2"; // Land = Grün, Wasser = Blau
      ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }
  }

  // Spieler zeichnen
  drawPlayer();

  // Schatz zeichnen
  ctx.fillStyle = "gold";
  ctx.fillRect(
    treasure.x * gridSize,
    treasure.y * gridSize,
    gridSize,
    gridSize
  );
}

function drawPlayer() {
  ctx.save(); // Speichert den aktuellen Zustand des Canvas

  // Setze die Position und drehe das Canvas entsprechend der Blickrichtung des Spielers
  ctx.translate(
    player.x * gridSize + gridSize / 2,
    player.y * gridSize + gridSize / 2
  );

  switch (player.direction) {
    case "up":
      ctx.rotate(0); // Blickrichtung nach oben
      break;
    case "right":
      ctx.rotate(Math.PI / 2); // Blickrichtung nach rechts
      break;
    case "down":
      ctx.rotate(Math.PI); // Blickrichtung nach unten
      break;
    case "left":
      ctx.rotate(-Math.PI / 2); // Blickrichtung nach links
      break;
  }

  // Zeichne den Spieler als Pfeil
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(0, -gridSize / 2); // Spitze des Pfeils
  ctx.lineTo(-gridSize / 4, gridSize / 4); // Linker Teil des Pfeils
  ctx.lineTo(gridSize / 4, gridSize / 4); // Rechter Teil des Pfeils
  ctx.closePath();
  ctx.fill();

  ctx.restore(); // Wiederherstellen des ursprünglichen Canvas-Zustands
}

// Bewegungsfunktionen

// Überprüfen, ob der Schatz gefunden wurde
function checkTreasure() {
  if (player.x === treasure.x && player.y === treasure.y) {
    alert("Schatz gefunden!");
  }
}

window.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    return `${window.location.origin}/monaco-editor/min/vs/base/worker/workerMain.js`;
  },
};

const editor = monaco.editor.create(document.getElementById("editor"), {
  language: "javascript",
  automaticLayout: true,
  suggestOnTriggerCharacters: true,
  quickSuggestions: { other: true, strings: true, comments: true },
});

runButton.addEventListener("click", async () => {
  const code = editor.getValue();
  const evalCode = parsedCode(code);

  try {
    eval(evalCode);
  } catch (e) {
    alert("Fehler im Code: " + e.message);
  }
});

import {
  moveForward,
  noWater,
  turnLeft,
  turnRight,
  initGame,
} from "./userFunctions.js";

// Initialisiere `userFunctions.js` mit dem Spielfeld und den Spieler-Daten
initGame({
  player,
  map,
  rows,
  cols,
  drawGrid,
  checkTreasure,
});

// Damit die Benutzerfunktionen in eval() genutzt werden können
window.moveForward = moveForward;
window.noWater = noWater;
window.turnLeft = turnLeft;
window.turnRight = turnRight;

drawGrid();
