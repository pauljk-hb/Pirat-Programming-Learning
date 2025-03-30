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
  await Utils.delay(500);
}

/**
 * Prüft, ob vor der Spielfigur Land ist.
 * @returns {boolean} - `true`, wenn vor der Spielfigur Land ist, sonst `false`.
 */
export function noWater() {
  if (!gameController)
    throw new Error("GameController ist nicht initialisiert.");
  const player = gameController.getPlayer();
  const map = gameController.getMap();
  const { x, y, direction } = player;

  if (direction === "up" && y > 0) return map[y - 1][x] === 1;
  if (direction === "down" && y < map.length - 1) return map[y + 1][x] === 1;
  if (direction === "left" && x > 0) return map[y][x - 1] === 1;
  if (direction === "right" && x < map[0].length - 1)
    return map[y][x + 1] === 1;

  Utils.logAction(`noWater() : ${result}`, result ? "green" : "orange");
  return false;
}

/**
 * Dreht die Spielfigur nach links.
 */
export async function turnLeft() {
  if (!gameController)
    throw new Error("GameController ist nicht initialisiert.");
  gameController.turnLeft();
  Utils.logAction("turnLeft()", "blue");
  await Utils.delay(500); // Wartezeit für Animation
}

/**
 * Prüft, ob die Spielfigur auf dem Schatz steht.
 * @returns {boolean} - `true`, wenn die Spielfigur auf dem Schatz steht, sonst `false`.
 */
export function onTreasure() {
  if (!gameController)
    throw new Error("GameController ist nicht initialisiert.");
  const result = gameController.checkTreasure();
  Utils.logAction(
    result ? "✨ onTreasure() : true" : "onTreasure() : false",
    result ? "green" : "orange"
  );
  return result;
}

/**
 * Setzt eine Markierung (Kreuz) auf das aktuelle Feld der Spielfigur.
 */
export function setMarker() {
  if (!gameController)
    throw new Error("GameController ist nicht initialisiert.");
  const player = gameController.getPlayer();
  gameController.addCross(player.x, player.y);
  Utils.logAction("setMarker()", "blue");
}
