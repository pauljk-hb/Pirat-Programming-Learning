/**
 * InputHandler-Klasse für die Verarbeitung von Benutzereingaben.
 */
export class InputHandler {
  /**
   * Erstellt eine neue InputHandler-Instanz.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem geklickt wird.
   * @param {object} gameManager - Der GameManager, der den Spielzustand verwaltet.
   */
  constructor(canvas, gameManager) {
    this.canvas = canvas;
    this.gameManager = gameManager;
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

    if (this.selectedTool === "player") {
      this.gameManager.getPlayer().x = x;
      this.gameManager.getPlayer().y = y;
    } else if (this.selectedTool === "treasure") {
      this.gameManager.getTreasure().x = x;
      this.gameManager.getTreasure().y = y;
    } else if (this.selectedTool === "cross") {
      this.gameManager.addCross(x, y);
    }

    this.gameManager.resetGame();
  }

  /**
   * Dreht den Spieler im Uhrzeigersinn.
   */
  rotatePlayer() {
    const player = this.gameManager.getPlayer();
    const directions = ["up", "right", "down", "left"];
    const currentIndex = directions.indexOf(player.direction);
    player.direction = directions[(currentIndex + 1) % directions.length];
    this.gameManager.resetGame();
  }
}
