import * as monaco from "monaco-editor";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runCode");

const gridSize = 50;
const rows = 10;
const cols = 10;

let player = { x: 1, y: 4, direction: "up" };
let treasure = { x: 8, y: 6 };

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Zeichne das Spielfeld
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }
  }

  // Zeichne den Spieler
  drawPlayer();

  // Zeichne den Schatz
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

function move(direction) {
  switch (player.direction) {
    case "up":
      if (direction === "up" && player.y > 0) player.y--;
      if (direction === "down" && player.y < rows - 1) player.y++;
      if (direction === "left" && player.x > 0) player.x--;
      if (direction === "right" && player.x < cols - 1) player.x++;
      break;

    case "right":
      if (direction === "up" && player.x < cols - 1) player.x++;
      if (direction === "down" && player.x > 0) player.x--;
      if (direction === "left" && player.y < rows - 1) player.y++;
      if (direction === "right" && player.y > 0) player.y--;
      break;

    case "down":
      if (direction === "up" && player.y < rows - 1) player.y++;
      if (direction === "down" && player.y > 0) player.y--;
      if (direction === "left" && player.x < cols - 1) player.x++;
      if (direction === "right" && player.x > 0) player.x--;
      break;

    case "left":
      if (direction === "up" && player.x > 0) player.x--;
      if (direction === "down" && player.x < cols - 1) player.x++;
      if (direction === "left" && player.y > 0) player.y--;
      if (direction === "right" && player.y < rows - 1) player.y++;
      break;
  }

  drawGrid();
  checkTreasure();
}

function turnLeft() {
  const directions = ["up", "right", "down", "left"];
  const currentIndex = directions.indexOf(player.direction);
  player.direction = directions[(currentIndex + 3) % 4];
  drawGrid();
}

function turnRight() {
  const directions = ["up", "right", "down", "left"];
  const currentIndex = directions.indexOf(player.direction);
  player.direction = directions[(currentIndex + 1) % 4];
  drawGrid();
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
