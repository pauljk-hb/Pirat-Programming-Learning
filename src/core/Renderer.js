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

    this.tileSet.onload = () => {
      console.log("Tileset geladen");
    };
  }

  /**
   * Zeichnet das gesamte Spielfeld, einschließlich Karte, Spieler, Schatz und Kreuze.
   * @param {number[][]} map - Die Karte als 2D-Array (z. B. 0 = Wasser, 1 = Land).
   * @param {object} player - Der Spieler mit `x`, `y` und `direction`-Eigenschaften.
   * @param {object} treasure - Der Schatz mit `x` und `y`-Eigenschaften.
   * @param {Array<{x: number, y: number}>} crosses - Liste der Kreuze mit `x` und `y`-Koordinaten.
   */
  drawGrid(map, player, treasure, crosses) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Zeichne die Karte
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        this.drawTile(map[y][x], x, y);
      }
    }

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

    this.drawTreasure(treasure);

    this.drawPlayer(player);

    crosses.forEach(({ x, y }) => this.drawCross(x, y));
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
    this.ctx.save();

    // Setze die Position des Spielers in die Mitte des Feldes
    this.ctx.translate(
      player.x * this.gridSize + this.gridSize / 2,
      player.y * this.gridSize + this.gridSize / 2
    );

    switch (player.direction) {
      case "up":
        this.ctx.rotate(0);
        break;
      case "right":
        this.ctx.rotate(Math.PI / 2);
        break;
      case "down":
        this.ctx.rotate(Math.PI);
        break;
      case "left":
        this.ctx.rotate(-Math.PI / 2);
        break;
    }

    this.ctx.fillStyle = "blue";
    this.ctx.beginPath();
    this.ctx.moveTo(0, -this.gridSize / 3); // Spitze des Dreiecks
    this.ctx.lineTo(-this.gridSize / 3, this.gridSize / 3); // Linke Ecke
    this.ctx.lineTo(this.gridSize / 3, this.gridSize / 3); // Rechte Ecke
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  /**
   * Zeichnet den Schatz auf das Spielfeld.
   * @param {object} treasure - Der Schatz mit `x` und `y`-Eigenschaften.
   */
  drawTreasure(treasure) {
    const dx = treasure.x * this.gridSize;
    const dy = treasure.y * this.gridSize;

    this.ctx.fillStyle = "red";
    this.ctx.beginPath();
    this.ctx.arc(
      dx + this.gridSize / 2,
      dy + this.gridSize / 2,
      this.gridSize / 4,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  /**
   * Zeichnet ein rotes Kreuz auf das Spielfeld.
   * @param {number} x - Die X-Koordinate des Kreuzes.
   * @param {number} y - Die Y-Koordinate des Kreuzes.
   */
  drawCross(x, y) {
    const dx = x * this.gridSize;
    const dy = y * this.gridSize;

    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(dx + 5, dy + 5);
    this.ctx.lineTo(dx + this.gridSize - 5, dy + this.gridSize - 5);
    this.ctx.moveTo(dx + this.gridSize - 5, dy + 5);
    this.ctx.lineTo(dx + 5, dy + this.gridSize - 5);
    this.ctx.stroke();
  }
}
