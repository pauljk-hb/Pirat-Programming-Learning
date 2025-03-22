let playerRef;
let mapRef;
let rowsRef;
let colsRef;
let drawGridRef;
let checkTreasureRef;

export function initGame(gameState) {
  playerRef = gameState.player;
  mapRef = gameState.map;
  rowsRef = gameState.rows;
  colsRef = gameState.cols;
  drawGridRef = gameState.drawGrid;
  checkTreasureRef = gameState.checkTreasure;
}

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

function delay(ms = 500) {
  // Verwende die globale Variable executionSpeed, falls verfügbar
  return new Promise((resolve) =>
    setTimeout(resolve, window.executionSpeed || ms)
  );
}

export async function move() {
  if (window.currentExecution?.cancelled) return;

  let newX = playerRef.x;
  let newY = playerRef.y;

  switch (playerRef.direction) {
    case "up":
      newY--;
      break;
    case "down":
      newY++;
      break;
    case "left":
      newX--;
      break;
    case "right":
      newX++;
      break;
  }

  // Prüfen, ob die neue Position innerhalb des Spielfelds liegt und Land ist
  if (
    newX >= 0 &&
    newX < colsRef &&
    newY >= 0 &&
    newY < rowsRef &&
    mapRef[newY][newX] === 1
  ) {
    playerRef.x = newX;
    playerRef.y = newY;
  }

  drawGridRef();
  await checkTreasureRef();
  logAction("move()");
  await delay(500);
}

export async function noWater() {
  if (window.currentExecution?.cancelled) return;

  const result = (() => {
    switch (playerRef.direction) {
      case "up":
        return mapRef[playerRef.y - 1]?.[playerRef.x] === 1;
      case "down":
        return mapRef[playerRef.y + 1]?.[playerRef.x] === 1;
      case "left":
        return mapRef[playerRef.y]?.[playerRef.x - 1] === 1;
      case "right":
        return mapRef[playerRef.y]?.[playerRef.x + 1] === 1;
    }
  })();

  logAction(`noWater() → ${result}`, result ? "green" : "red");
  console.log(result);
  await delay(500);
  return result;
}

export async function turnLeft() {
  if (window.currentExecution?.cancelled) return;

  const directions = ["up", "right", "down", "left"];
  const currentIndex = directions.indexOf(playerRef.direction);
  playerRef.direction = directions[(currentIndex + 3) % 4];
  drawGridRef();
  logAction("turnLeft()");
  await delay(500);
}

export async function turnRight() {
  if (window.currentExecution?.cancelled) return;

  const directions = ["up", "right", "down", "left"];
  const currentIndex = directions.indexOf(playerRef.direction);
  playerRef.direction = directions[(currentIndex + 1) % 4];
  drawGridRef();
  logAction("turnRight()");
  await delay(500);
}

function checkTreasure() {
  if (player.x === treasure.x && player.y === treasure.y) {
    alert("Schatz gefunden!");
  }
}

export async function vor() {
  await move();
}

export async function links() {
  await turnLeft();
}

export async function vorneFrei() {
  return await noWater();
}
