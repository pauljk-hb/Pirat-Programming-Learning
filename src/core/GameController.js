import { Renderer } from "./Renderer.js";

/**
 * GameController-Klasse zur Verwaltung des Spielzustands und der Spiel-Logik.
 */
export class GameController {
  /**
   * Erstellt eine neue GameController-Instanz.
   * @param {canvas} canvas - Das Canvas-Element für die Anzeige des Spiels.
   * @param {number} gridSize - Die Größe eines einzelnen Grids in Pixeln.
   * @param {object} editor - Der Code-Editor
   */
  constructor(canvas, gridSize = 50, editor) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Ein gültiges Canvas-Element ist erforderlich.");
    }
    this.renderer = new Renderer(canvas, gridSize);
    this.editor = editor;
    this.player = null;
    this.treasure = null;
    this.map = null;
    this.crosses = [];
  }

  /**
   * Initialisiert das Spiel mit den Level-Daten.
   * @param {object} levelData - Die Daten des Levels (Karte, Spieler, Schatz).
   */
  initGame(levelData) {
    this.player = levelData.player;
    this.treasure = levelData.treasure;
    this.map = levelData.map;
    this.crosses = [];
    if (levelData.code) {
      this.editor.setValue(levelData.code);
    }
    this.renderer.drawGrid(this.map, this.player, this.treasure, this.crosses);
  }

  /**
   * Setzt das Spiel zurück, indem der Spieler und die Kreuze zurückgesetzt werden.
   */
  resetGame() {
    this.player.x = 0;
    this.player.y = 0;
    this.player.direction = "up";
    this.crosses = [];
    this.renderer.drawGrid(this.map, this.player, this.treasure, this.crosses);
  }

  update() {
    this.renderer.drawGrid(this.map, this.player, this.treasure, this.crosses);
  }

  stopUserCode() {}

  /**
   * Fügt ein Kreuz an der angegebenen Position hinzu.
   * @param {number} x - Die X-Koordinate des Kreuzes.
   * @param {number} y - Die Y-Koordinate des Kreuzes.
   */
  addCross(x, y) {
    if (!this.crosses.some((cross) => cross.x === x && cross.y === y)) {
      this.crosses.push({ x, y });
    }
    this.renderer.drawGrid(this.map, this.player, this.treasure, this.crosses);
  }

  /**
   * Überprüft, ob der Spieler ein Kreuz erreicht hat und entfernt es gegebenenfalls.
   * @returns {boolean} - `true`, wenn ein Kreuz erreicht wurde, sonst `false`.
   */
  checkCrosses() {
    const playerOnCrossIndex = this.crosses.findIndex(
      (cross) => cross.x === this.player.x && cross.y === this.player.y
    );

    if (playerOnCrossIndex !== -1) {
      return true;
    }

    return false;
  }

  /**
   * Bewegt den Spieler in die aktuelle Richtung.
   */
  movePlayer() {
    const { x, y, direction } = this.player;

    if (direction === "up" && y > 0 && this.map[y - 1][x] === 1) {
      this.player.y -= 1;
    } else if (
      direction === "down" &&
      y < this.map.length - 1 &&
      this.map[y + 1][x] === 1
    ) {
      this.player.y += 1;
    } else if (direction === "left" && x > 0 && this.map[y][x - 1] === 1) {
      this.player.x -= 1;
    } else if (
      direction === "right" &&
      x < this.map[0].length - 1 &&
      this.map[y][x + 1] === 1
    ) {
      this.player.x += 1;
    }

    this.renderer.drawGrid(this.map, this.player, this.treasure, this.crosses);
  }

  turnLeft() {
    const directions = ["up", "left", "down", "right"];
    const currentIndex = directions.indexOf(this.player.direction);
    this.player.direction = directions[(currentIndex + 1) % directions.length];
    this.renderer.drawGrid(this.map, this.player, this.treasure, this.crosses);
  }

  /**
   * Prüft, ob der Spieler den Schatz erreicht hat.
   * @returns {boolean} - `true`, wenn der Spieler den Schatz erreicht hat, sonst `false`.
   */
  checkTreasure() {
    return (
      this.player.x === this.treasure.x && this.player.y === this.treasure.y
    );
  }

  /**
   * Gibt den aktuellen Spielerzustand zurück.
   * @returns {object} - Der Spielerzustand.
   */
  getPlayer() {
    return this.player;
  }

  /**
   * Gibt die aktuelle Schatzposition zurück.
   * @returns {object} - Die Schatzposition.
   */
  getTreasure() {
    return this.treasure;
  }

  /**
   * Gibt die aktuelle Karte zurück.
   * @returns {number[][]} - Die Karte als 2D-Array.
   */
  getMap() {
    return this.map;
  }
}
