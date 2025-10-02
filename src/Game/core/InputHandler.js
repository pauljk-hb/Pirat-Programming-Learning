import { LevelLoader } from "./LevelLoader.js";

/**
 * InputHandler-Klasse für die Verarbeitung von Benutzereingaben.
 */
export class InputHandler {
  /**
   * Erstellt eine neue InputHandler-Instanz.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element, auf dem geklickt wird.
   * @param {object} gameController - Der gameController, der den Spielzustand verwaltet.
   * @param {object} editor - Der Code-Editor (z. B. Monaco-Editor).
   */
  constructor(canvas, gameController, editor) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Ein gültiges Canvas-Element ist erforderlich.");
    }
    this.canvas = canvas;
    this.editor = editor;
    this.instructions = null;
    this.gameController = gameController;
    this.selectedTool = "player";
    this.levelLoader = new LevelLoader();
    this.initEventListeners();
  }

  /**
   * Initialisiert die Event-Listener für Benutzerinteraktionen.
   */
  initEventListeners() {
    // Canvas Event-Listener
    if (this.canvas) {
      this.canvas.addEventListener("click", (event) =>
        this.handleCanvasClick(event)
      );
    }

    // Radio-Buttons (Tool-Auswahl)
    const radioButtons = document.querySelectorAll(
      'input[name="level-design"]'
    );
    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener("change", (event) => {
        this.selectedTool = event.target.value;
      });
    });

    // Button-Event-Listener mit if-Bedingung
    const rotateBtn = document.getElementById("rotate-btn");
    if (rotateBtn) {
      rotateBtn.addEventListener("click", () => {
        this.rotatePlayer();
      });
    }

    const saveLevelBtn = document.getElementById("saveLevel");
    if (saveLevelBtn) {
      saveLevelBtn.addEventListener("click", () => {
        this.saveLevel();
      });
    }

    const saveLevelFromEditorBtn = document.getElementById(
      "saveLevelFromEditor"
    );
    if (saveLevelFromEditorBtn) {
      saveLevelFromEditorBtn.addEventListener("click", () => {
        const titel = document.getElementById("levelTitle").value;
        if (!titel || titel.trim() === "") {
          alert("Bitte geben Sie einen Level-Titel ein.");
          return;
        }
        const instructions = this.instructions;
        this.saveLevelFromEditor(titel, instructions);
      });
    }

    const loadLevelBtn = document.getElementById("loadLevel");
    if (loadLevelBtn) {
      loadLevelBtn.addEventListener("click", async () => {
        await this.loadLevel();
      });
    }
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
    player.userDirection = player.direction;
    this.gameController.update();
  }

  /**
   * Speichert das aktuelle Level als JSON-Datei.
   */
  saveLevel() {
    const levelData = {
      player: this.gameController.getPlayer(),
      treasure: this.gameController.getTreasure(),
      map: this.gameController.getMap(),
      code: this.editor.getValue(), // Benutzer-Code aus dem Editor
      preview: this.canvas.toDataURL("image/png"),
    };

    this.levelLoader.saveLevel(levelData, "level.json");
    console.log("Level gespeichert:", levelData);
  }

  saveLevelFromEditor(titel, instructions) {
    const levelData = {
      player: this.gameController.getPlayer(),
      treasure: this.gameController.getTreasure(),
      map: this.gameController.getMap(),
      code: this.editor.getValue(), // Benutzer-Code aus dem Editor
      titel: titel,
      instructions: instructions,
      preview: this.canvas.toDataURL("image/png"),
    };

    this.levelLoader.saveLevel(levelData, `${titel}.json`);
    console.log("Level gespeichert:", levelData);
  }

  /**
   * Lädt ein Level aus einer JSON-Datei.
   */
  async loadLevel() {
    try {
      const levelData = await this.levelLoader.loadLevelFromFile();
      if (!levelData) {
        console.warn("Kein Level ausgewählt oder Ladevorgang abgebrochen.");
        return;
      }

      // Validierung der Level-Daten
      if (!levelData.map || !levelData.player || !levelData.treasure) {
        console.error("Unvollständige Level-Daten:", levelData);
        alert("Die Level-Datei ist unvollständig oder beschädigt.");
        return;
      }

      this.gameController.initGame(levelData, "custom-level");

      // Code in den Editor laden, falls vorhanden
      if (levelData.code && this.editor) {
        this.editor.setValue(levelData.code);
      }

      console.log("Level erfolgreich geladen:", levelData);
    } catch (error) {
      console.error("Fehler beim Laden des Levels:", error);
      alert("Fehler beim Laden der Level-Datei: " + error.message);
    }
  }

  setHTMLinstructions(instructions) {
    this.instructions = instructions;
  }
}
