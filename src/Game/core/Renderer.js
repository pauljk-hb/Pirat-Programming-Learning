/**
 * Renderer-Klasse für das Zeichnen des Spielfelds, des Spielers, des Schatzes und anderer Elemente.
 */
export class Renderer {
  /**
   * Erstellt eine neue Renderer-Instanz.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem gezeichnet wird.
   * @param {number} gridSize - Die Größe eines einzelnen Grids in Pixeln.
   */
  constructor(canvas, gridSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.gridSize = gridSize;
    this.tileSet = new Image();
    this.tileSet.src = "tilemap.png";
    this.crosses = [];
    this.isReady = false;

    // Promise für das Laden des Tilesets
    this.tilesetLoaded = new Promise((resolve, reject) => {
      this.tileSet.onload = () => {
        console.log("Tileset geladen");
        this.isReady = true;
        resolve();
      };

      this.tileSet.onerror = (error) => {
        console.error("Fehler beim Laden des Tilesets:", error);
        reject(error);
      };
    });
  }

  /**
   * Wartet bis das Tileset geladen ist
   * @returns {Promise} Promise das erfüllt wird wenn das Tileset bereit ist
   */
  async waitForTileset() {
    if (this.isReady) {
      return Promise.resolve();
    }
    return this.tilesetLoaded;
  }

  /**
   * Zeichnet das gesamte Spielfeld, einschließlich Karte, Spieler, Schatz und Kreuze.
   * @param {number[][]} map - Die Karte als 2D-Array (z. B. 0 = Wasser, 1 = Land).
   * @param {object} player - Der Spieler mit `x`, `y` und `direction`-Eigenschaften.
   * @param {object} treasure - Der Schatz mit `x` und `y`-Eigenschaften.
   * @param {Array<{x: number, y: number}>} crosses - Liste der Kreuze mit `x` und `y`-Koordinaten.
   */
  async drawGrid(map, player, treasure, crosses) {
    await this.waitForTileset();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Zeichne die Karte
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        this.drawTile(map[y][x], x, y);
      }
    }

    this.drawTreasure(treasure);

    crosses.forEach(({ x, y }) => this.drawCross(x, y));

    this.drawPlayer(player);

    this.ctx.strokeStyle = "black"; // Farbe der Linien
    this.ctx.lineWidth = 1;

    const cols = this.canvas.width / this.gridSize;
    const rows = this.canvas.height / this.gridSize;

    for (let i = 0; i <= Math.max(cols, rows); i++) {
      if (i <= cols) {
        this.ctx.beginPath();
        this.ctx.moveTo(i * this.gridSize, 0);
        this.ctx.lineTo(i * this.gridSize, rows * this.gridSize);
        this.ctx.stroke();
      }
      if (i <= rows) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, i * this.gridSize);
        this.ctx.lineTo(cols * this.gridSize, i * this.gridSize);
        this.ctx.stroke();
      }
    }
  }

  /**
   * Zeichnet ein einzelnes Tile auf das Spielfeld.
   * @param {number} tileIndex - Der Index des Tiles im Tileset (z. B. 0 = Wasser, 1 = Land).
   * @param {number} x - Die X-Koordinate des Tiles.
   * @param {number} y - Die Y-Koordinate des Tiles.
   */
  drawTile(tileIndex, x, y) {
    const tileSize = 50;
    const sx = tileIndex * tileSize; // X-Position im Tileset
    const sy = 0; // Y-Position im Tileset (erste Zeile)
    const dx = x * this.gridSize; // X-Position auf dem Canvas
    const dy = y * this.gridSize; // Y-Position auf dem Canvas

    this.ctx.drawImage(
      this.tileSet,
      sx,
      sy,
      tileSize,
      tileSize,
      dx,
      dy,
      this.gridSize,
      this.gridSize
    );
  }

  /**
   * Zeichnet den Spieler auf das Spielfeld.
   * @param {object} player - Der Spieler mit `x`, `y` und `direction`-Eigenschaften.
   */
  drawPlayer(player) {
    const tileSize = 50;
    const dx = player.x * this.gridSize;
    const dy = player.y * this.gridSize;

    // Spalte 2 im Tileset (Spieler)
    const sx = tileSize * 2;
    let sy = 0;

    // Richtung zu Zeile im Tileset
    switch (player.direction) {
      case "down":
        sy = tileSize * 0;
        break;
      case "left":
        sy = tileSize * 1;
        break;
      case "right":
        sy = tileSize * 2;
        break;
      case "up":
        sy = tileSize * 3;
        break;
    }

    this.ctx.drawImage(
      this.tileSet,
      sx,
      sy,
      tileSize,
      tileSize,
      dx,
      dy,
      this.gridSize,
      this.gridSize
    );
  }

  /**
   * Zeichnet den Schatz auf das Spielfeld.
   * @param {object} treasure - Der Schatz mit `x` und `y`-Eigenschaften.
   */
  drawTreasure(treasure) {
    const tileSize = 50;
    const dx = treasure.x * this.gridSize;
    const dy = treasure.y * this.gridSize;

    // Spalte 2 im Tileset (Spieler)
    const sx = tileSize * 2;
    const sy = 4 * tileSize;

    this.ctx.drawImage(
      this.tileSet,
      sx,
      sy,
      tileSize,
      tileSize,
      dx,
      dy,
      this.gridSize,
      this.gridSize
    );
  }

  /**
   * Zeichnet ein rotes Kreuz auf das Spielfeld.
   * @param {number} x - Die X-Koordinate des Kreuzes.
   * @param {number} y - Die Y-Koordinate des Kreuzes.
   */
  drawCross(x, y) {
    const padding = 10;
    const dx = x * this.gridSize;
    const dy = y * this.gridSize;

    this.ctx.save();

    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 5;

    this.ctx.beginPath();
    this.ctx.moveTo(dx + padding, dy + padding);
    this.ctx.lineTo(dx + this.gridSize - padding, dy + this.gridSize - padding);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(dx + this.gridSize - padding, dy + padding);
    this.ctx.lineTo(dx + padding, dy + this.gridSize - padding);
    this.ctx.stroke();

    this.ctx.restore();
  }
}
