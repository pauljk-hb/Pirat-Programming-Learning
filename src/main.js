import * as monaco from "monaco-editor";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runCode");

const gridSize = 50;
const rows = 10;
const cols = 10;

let player = { x: 1, y: 4, targetX: 0, targetY: 0 };
let treasure = { x: 8, y: 6 };

// Zeichne Spielfeld
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }
  }
  // Spieler zeichnen
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x * gridSize, player.y * gridSize, gridSize, gridSize);

  // Schatz zeichnen
  ctx.fillStyle = "gold";
  ctx.fillRect(
    treasure.x * gridSize,
    treasure.y * gridSize,
    gridSize,
    gridSize
  );
}

// Spieler bewegen
function move(direction) {
  switch (direction) {
    case "up":
      if (player.y > 0) player.y--;
      break;
    case "down":
      if (player.y < rows - 1) player.y++;
      break;
    case "left":
      if (player.x > 0) player.x--;
      break;
    case "right":
      if (player.x < cols - 1) player.x++;
      break;
  }
  drawGrid();
  checkTreasure();
}

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

runButton.addEventListener("click", () => {
  const code = editor.getValue(); // Hole den geschriebenen Code aus dem Editor

  try {
    // Verwende eval, um den Code auszuführen
    eval(code);
  } catch (e) {
    // Fehlerbehandlung, falls der Code nicht richtig ist
    alert("Fehler im Code: " + e.message);
  }
});

drawGrid();
