import { Utils } from "./Utils.js";

let gameController = null; // Platzhalter für das GameController-Objekt

/**
 * Initialisiert die Benutzerfunktionen mit dem GameController.
 * @param {GameController} controller - Das GameController-Objekt.
 */
export function initUserFunctions(controller) {
  gameController = controller;
}

/**
 * Bewegt die Spielfigur um ein Feld in die aktuelle Richtung.
 */
export async function move() {
  if (!gameController)
    throw new Error("GameController ist nicht initialisiert.");
  gameController.movePlayer();
  Utils.logAction("move()", "blue");
  await Utils.delay();
}

/**
 * Prüft, ob vor der Spielfigur Land ist.
 * @returns {boolean} - `true`, wenn vor der Spielfigur Land ist, sonst `false`.
 */
export async function noWater() {
  if (!gameController)
    throw new Error("GameController ist nicht initialisiert.");
  const player = gameController.getPlayer();
  const map = gameController.getMap();
  const { x, y, direction } = player;

  const result = (() => {
    switch (direction) {
      case "up":
        return y > 0 && map[y - 1][x] === 1;
      case "down":
        return y < map.length - 1 && map[y + 1][x] === 1;
      case "left":
        return x > 0 && map[y][x - 1] === 1;
      case "right":
        return x < map[0].length - 1 && map[y][x + 1] === 1;
      default:
        return false;
    }
  })();

  Utils.logAction(`noWater() : ${result}`, result ? "green" : "orange");
  await Utils.delay();
  return result;
}

/**
 * Dreht die Spielfigur nach links.
 */
export async function turnLeft() {
  if (!gameController)
    throw new Error("GameController ist nicht initialisiert.");
  gameController.turnLeft();
  Utils.logAction("turnLeft()", "blue");
  await Utils.delay();
}

/**
 * Prüft, ob die Spielfigur auf dem Schatz steht.
 * @returns {boolean} - `true`, wenn die Spielfigur auf dem Schatz steht, sonst `false`.
 */
export async function onTreasure() {
  if (!gameController)
    throw new Error("GameController ist nicht initialisiert.");
  const result = gameController.checkTreasure();
  Utils.logAction(
    result ? "✨ onTreasure() : true" : "onTreasure() : false",
    result ? "green" : "orange"
  );
  await Utils.delay();
  return result;
}

/**
 * Setzt eine Markierung (Kreuz) auf das aktuelle Feld der Spielfigur.
 */
export async function setMarker() {
  if (!gameController)
    throw new Error("GameController ist nicht initialisiert.");
  const player = gameController.getPlayer();
  gameController.addCross(player.x, player.y);
  Utils.logAction("setMarker()", "blue");
  await Utils.delay();
}

export async function onMarker() {
  if (!gameController)
    throw new Error("GameController ist nicht initialisiert.");
  let result = gameController.checkCrosses();
  Utils.logAction(`onMarker() : ${result}`, result ? "green" : "orange");
  await Utils.delay();
  return result;
}

export async function vor() {
  await move();
}

export async function links() {
  await turnLeft();
}

export async function vorneFrei() {
  return noWater();
}

export async function setzteMarkierung() {
  await setMarker();
}

export async function aufSchatz() {
  return onTreasure();
}
