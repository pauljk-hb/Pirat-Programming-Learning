import * as monaco from "monaco-editor";
import { transformUserCode } from "./codePaser.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runCode");

const gridSize = 50;
const rows = 10;
const cols = 10;

let player = {
  x: 0,
  y: 0,
  direction: "up",
  userX: undefined,
  userY: undefined,
  userDirection: undefined,
};
let treasure = { x: 8, y: 6 };

const map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// Speichere die Positionen der Kreuze
const crosses = [];

function drawCross(x, y) {
  // Speichere die Position des Kreuzes, falls es noch nicht existiert
  if (!crosses.some((cross) => cross.x === x && cross.y === y)) {
    crosses.push({ x, y });
  }

  // Zeichne alle gespeicherten Kreuze
  crosses.forEach((cross) => {
    ctx.save(); // Speichere den aktuellen Zustand des Canvas

    const lineWidth = 5;
    const padding = 10;

    ctx.strokeStyle = "red";
    ctx.lineWidth = lineWidth;

    // Zeichne die diagonale Linie von oben links nach unten rechts
    ctx.beginPath();
    ctx.moveTo(cross.x * gridSize + padding, cross.y * gridSize + padding);
    ctx.lineTo(
      (cross.x + 1) * gridSize - padding,
      (cross.y + 1) * gridSize - padding
    );
    ctx.stroke();

    // Zeichne die diagonale Linie von oben rechts nach unten links
    ctx.beginPath();
    ctx.moveTo(
      (cross.x + 1) * gridSize - padding,
      cross.y * gridSize + padding
    );
    ctx.lineTo(
      cross.x * gridSize + padding,
      (cross.y + 1) * gridSize - padding
    );
    ctx.stroke();

    ctx.restore(); // Wiederherstellen des ursprünglichen Canvas-Zustands
  });
}

// Stelle sicher, dass drawCross bei jedem Aufruf von drawGrid berücksichtigt wird
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

  // Kreuze zeichnen
  drawCross();
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
  }
}

const resetButton = document.getElementById("resetGame");

resetButton.addEventListener("click", reset);

async function reset() {
  // Stoppe die Ausführung des Benutzer-Codes
  if (window.currentExecution) {
    window.currentExecution.cancelled = true;
  }
  window.currentExecution = { cancelled: false };
  // Spieler auf die Startposition zurücksetzen
  player.x = player.userX || 0;
  player.y = player.userY || 0;
  player.direction = player.userDirection || "up";

  // Log-Ausgabe leeren
  const logOutput = document.getElementById("logOutput");
  logOutput.innerHTML = "";

  // Entferne alle gespeicherten Kreuze
  crosses.length = 0;
  // Spielfeld neu zeichnen
  drawGrid();
  await delay();
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

let executionSpeed = 500; // Standardgeschwindigkeit in Millisekunden
window.executionSpeed = executionSpeed; // Globale Verfügbarkeit

const speedControl = document.getElementById("speedControl");

// Aktualisiere die Geschwindigkeit basierend auf dem Schieberegler
speedControl.addEventListener("input", (event) => {
  const speedValue = parseInt(event.target.value, 10);
  executionSpeed = 1100 - speedValue * 100; // Geschwindigkeit umrechnen (1 = langsam, 10 = schnell)
  window.executionSpeed = executionSpeed; // Globale Variable aktualisieren
});

function delay(ms = 500) {
  // Verwende die globale Variable executionSpeed, falls verfügbar
  return new Promise((resolve) =>
    setTimeout(resolve, window.executionSpeed || ms)
  );
}

// Mache delay global verfügbar
window.delay = delay;

runButton.addEventListener("click", async () => {
  await reset();
  const userCode = editor.getValue(); // User-Code holen
  const transformedCode = transformUserCode(userCode); // Code transformieren

  try {
    await eval(transformedCode); // Asynchronen Code ausführen
  } catch (e) {
    logAction("Fehler im Code: " + e.message, "red");
  }
});

function logAction(action, styling = "") {
  const logOutput = document.getElementById("logOutput");
  const logEntry = document.createElement("div");
  logEntry.textContent = `→ ${action}`;
  if (styling) {
    logEntry.className = styling;
  }
  logOutput.appendChild(logEntry);
  logOutput.scrollTop = logOutput.scrollHeight;
}

const radioButtons = document.querySelectorAll('input[name="level-design"]');

// Variable, um den aktuellen Wert des ausgewählten Radio-Buttons zu speichern
let selectedValue = "player";

// Entferne alte Event-Listener und füge einen neuen hinzu
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / gridSize);
  const y = Math.floor((event.clientY - rect.top) / gridSize);

  console.log(`Clicked on grid cell: (${x}, ${y})`);

  if (selectedValue === "player") {
    player.userX = x;
    player.x = x;
    player.userY = y;
    player.y = y;
  } else if (selectedValue === "land") {
    map[y][x] = 1;
  } else if (selectedValue === "water") {
    map[y][x] = 0;
  } else if (selectedValue === "treasure") {
    treasure.x = x;
    treasure.y = y;
  }

  drawGrid();
});

// Event-Listener für die Radio-Buttons
radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("change", (event) => {
    if (event.target.checked) {
      selectedValue = event.target.value || "player";
      console.log(`Selected value: ${selectedValue}`);
    }
  });
});

document.getElementById("rotate-btn").addEventListener("click", () => {
  const directions = ["up", "right", "down", "left"];
  const currentIndex = directions.indexOf(player.direction);
  player.userDirection = directions[(currentIndex + 3) % 4];
  player.direction = directions[(currentIndex + 3) % 4];
  drawGrid();
});

// Level speichern
document.getElementById("saveLevel").addEventListener("click", () => {
  console.log(editor.getValue());
  const levelData = {
    player: { x: player.x, y: player.y, direction: player.direction },
    treasure: { x: treasure.x, y: treasure.y },
    map,
    code: editor.getValue(),
  };

  const blob = new Blob([JSON.stringify(levelData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "level.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Level laden
document.getElementById("loadLevel").addEventListener("click", async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const levelData = JSON.parse(text);

    // Level-Daten anwenden
    player.userX = levelData.player.x;
    player.userY = levelData.player.y;
    player.x = levelData.player.x;
    player.y = levelData.player.y;
    player.userDirection = levelData.player.direction;

    treasure.x = levelData.treasure.x;
    treasure.y = levelData.treasure.y;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        map[y][x] = levelData.map[y][x];
      }
    }

    if (levelData.code) {
      editor.setValue(levelData.code); // Setze den gespeicherten Code in den Editor
    }

    drawGrid();
  });

  input.click();
});

import {
  move,
  noWater,
  turnLeft,
  initGame,
  vor,
  links,
  vorneFrei,
  onTreasure,
  aufSchatz,
  setMarker,
  setzteMarkierung,
} from "./userFunctions.js";

// Initialisiere `userFunctions.js` mit dem Spielfeld und den Spieler-Daten
initGame({
  player,
  map,
  rows,
  cols,
  drawGrid,
  treasure,
  drawCross,
});

// Damit die Benutzerfunktionen in eval() genutzt werden können
window.move = move;
window.noWater = noWater;
window.turnLeft = turnLeft;
window.vor = vor;
window.links = links;
window.vorneFrei = vorneFrei;
window.onTreasure = onTreasure;
window.aufSchatz = aufSchatz;
window.setMarker = setMarker;
window.setzteMarkierung = setzteMarkierung;

drawGrid();
