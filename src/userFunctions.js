let playerRef;
let mapRef;
let rowsRef;
let colsRef;
let drawGridRef;
let treasureRef;
let drawCrossRef;

export function initGame(gameState) {
  playerRef = gameState.player;
  mapRef = gameState.map;
  rowsRef = gameState.rows;
  colsRef = gameState.cols;
  drawGridRef = gameState.drawGrid;
  treasureRef = gameState.treasure;
  drawCrossRef = gameState.drawCross;
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
  logAction("move()");
  await delay(500);
}

export async function noWater() {
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

  logAction(`noWater() : ${result}`, result ? "green" : "orange");
  console.log(result);
  await delay(500);
  return result;
}

export async function setMarker() {
  drawCrossRef(playerRef.x, playerRef.y);
  logAction("setMarker()");
  await delay(500);
}

export async function turnLeft() {
  const directions = ["up", "right", "down", "left"];
  const currentIndex = directions.indexOf(playerRef.direction);
  playerRef.direction = directions[(currentIndex + 3) % 4];
  drawGridRef();
  logAction("turnLeft()");
  await delay(500);
}

export async function onTreasure() {
  console.log(playerRef, treasureRef);
  if (playerRef.x === treasureRef.x && playerRef.y === treasureRef.y) {
    logAction(`✨ onTreasure() : true`, "green");
    await delay(500);
    return true;
  } else {
    logAction(`onTreasure() : false`, "orange");
    await delay(500);
    return false;
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

export async function aufSchatz() {
  return await onTreasure();
}

export async function setzteMarkierung() {
  await setMarker();
}
