/**
 * InputHandler-Klasse für die Verarbeitung von Benutzereingaben.
 */
export class InputHandler {
  /**
   * Erstellt eine neue InputHandler-Instanz.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem geklickt wird.
   * @param {object} gameController - Der gameController, der den Spielzustand verwaltet.
   */
  constructor(canvas, gameController) {
    this.canvas = canvas;
    this.gameController = gameController;
    this.selectedTool = "player";
    this.initEventListeners();
  }

  /**
   * Initialisiert die Event-Listener für Benutzerinteraktionen.
   */
  initEventListeners() {
    this.canvas.addEventListener("click", (event) =>
      this.handleCanvasClick(event)
    );

    const radioButtons = document.querySelectorAll(
      'input[name="level-design"]'
    );
    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener("change", (event) => {
        this.selectedTool = event.target.value;
      });
    });

    document.getElementById("rotate-btn").addEventListener("click", () => {
      this.rotatePlayer();
    });
  }

  /**
   * Verarbeitet Klicks auf das Spielfeld und aktualisiert den Spielzustand.
   * @param {MouseEvent} event - Klick-Event.
   */
  handleCanvasClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / 50);
    const y = Math.floor((event.clientY - rect.top) / 50);

    console.log(`Clicked on grid cell: (${x}, ${y})`);

    if (this.selectedTool === "player") {
      const player = this.gameController.getPlayer();
      player.userX = x;
      player.x = x;
      player.userY = y;
      player.y = y;
    } else if (this.selectedTool === "land") {
      this.gameController.getMap()[y][x] = 1;
    } else if (this.selectedTool === "water") {
      this.gameController.getMap()[y][x] = 0;
    } else if (this.selectedTool === "treasure") {
      const treasure = this.gameController.getTreasure();
      treasure.x = x;
      treasure.y = y;
    }

    this.gameController.update();
  }

  /**
   * Dreht den Spieler im Uhrzeigersinn.
   */
  rotatePlayer() {
    const player = this.gameController.getPlayer();
    const directions = ["up", "right", "down", "left"];
    const currentIndex = directions.indexOf(player.direction);
    player.direction = directions[(currentIndex + 1) % directions.length];
    this.gameController.update();
  }
}
