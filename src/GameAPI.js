import { Renderer } from "./core/Renderer.js";
import { InputHandler } from "./core/InputHandler.js";
import { CodeParser } from "./core/CodeParser.js";
import { LevelLoader } from "./core/LevelLoader.js";
import { GameController } from "./core/GameController.js";

/**
 * Hauptklasse für die Verwaltung des Spiels.
 */
export class GameAPI {
  /**
   * Erstellt eine neue GameAPI-Instanz.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element für das Spielfeld.
   * @param {object} editor - Der Code-Editor (z. B. Monaco-Editor).
   * @param {HTMLElement} logOutput - Das Log-Element für Ausgaben.
   */
  constructor(canvas, editor, logOutput, gridSize = 50) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Ein gültiges Canvas-Element ist erforderlich.");
    }
    this.canvas = canvas;
    this.editor = editor;
    this.logOutput = logOutput;

    this.renderer = new Renderer(canvas, gridSize);
    this.codeParser = new CodeParser();
    this.levelLoader = new LevelLoader();
    this.gameController = new GameController(this.renderer);
    this.inputHandler = new InputHandler(canvas, this.gameController);

    // Standardwerte
    this.currentLevel = null;
    console.log("GameAPI initialisiert.", this);
  }

  /**
   * Initialisiert das Spiel mit einem bestimmten Level.
   * @param {string} levelFile - Der Name der Level-Datei (z. B. "level1.json").
   */
  async initGame(levelFile) {
    try {
      const levelData = await this.levelLoader.loadLevel(levelFile);
      this.currentLevel = levelFile;
      this.gameController.initGame(levelData);
      this.logAction(`Level "${levelFile}" erfolgreich geladen.`, "green");
    } catch (error) {
      this.logAction(`Fehler beim Laden des Levels: ${error.message}`, "red");
    }
  }

  /**
   * Führt den Benutzer-Code aus.
   */
  async runUserCode() {
    const userCode = this.editor.getValue();
    if (!userCode) {
      this.logAction("Kein Code vorhanden.", "red");
      return;
    }

    const transformedCode = this.codeParser.transformUserCode(userCode);
    if (!transformedCode) {
      this.logAction("Fehler beim Transformieren des Codes.", "red");
      return;
    }

    try {
      this.logAction("Code wird ausgeführt...", "blue");
      await eval(transformedCode); // Benutzer-Code ausführen
      this.logAction("Code erfolgreich ausgeführt.", "green");
    } catch (error) {
      this.logAction(`Fehler im Code: ${error.message}`, "red");
    }
  }

  /**
   * Setzt das aktuelle Level zurück.
   */
  resetGame() {
    if (this.currentLevel) {
      this.initGame(this.currentLevel);
      this.logAction("Spiel zurückgesetzt.", "orange");
    } else {
      this.logAction(
        "Kein Level geladen, das zurückgesetzt werden kann.",
        "red"
      );
    }
  }

  /**
   * Loggt eine Aktion in das Log-Element.
   * @param {string} action - Die Aktion, die geloggt werden soll.
   * @param {string} [styling=""] - Optionales CSS-Styling für den Log-Eintrag.
   */
  logAction(action, styling = "") {
    const logEntry = document.createElement("div");
    logEntry.textContent = `→ ${action}`;
    if (styling) logEntry.className = styling;
    this.logOutput.appendChild(logEntry);
    this.logOutput.scrollTop = this.logOutput.scrollHeight;
  }
}
