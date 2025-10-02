import { InputHandler } from "./core/InputHandler.js";
import { CodeParser } from "./core/CodeParser.js";
import { LevelLoader } from "./core/LevelLoader.js";
import { GameController } from "./core/GameController.js";
import * as UserFunctions from "./core/UserFunctions.js";
import { Utils } from "./core/Utils.js";

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
    this.codeRunning = false;

    this.codeParser = new CodeParser();
    this.levelLoader = new LevelLoader();
    this.gameController = new GameController(
      this.canvas,
      gridSize,
      this.editor
    );
    this.inputHandler = new InputHandler(
      canvas,
      this.gameController,
      this.editor
    );
    Utils.setLogOutput(logOutput);

    UserFunctions.initUserFunctions(this.gameController);

    console.log("UserFunctions:", UserFunctions);

    Object.keys(UserFunctions).forEach((funcName) => {
      if (funcName !== "initUserFunctions") {
        window[funcName] = UserFunctions[funcName];
      }
    });

    // Standardwerte
    this.currentLevel = null;
    console.log("GameAPI initialisiert.", this);
  }

  /**
   * Initialisiert das Spiel mit einem bestimmten Level.
   * @param {string} levelFile - Der Name der Level-Datei (z. B. "level1.json").
   */
  async initGame(levelFile, isCustom = false) {
    try {
      const levelData = isCustom
        ? await this.levelLoader.loadCustomLevel(levelFile)
        : await this.levelLoader.loadStandartLevel(levelFile);
      this.currentLevel = levelFile;
      this.gameController.initGame(levelData, levelFile);
      Utils.logAction(`Level "${levelFile}" erfolgreich geladen.`, "green");
      return levelData.instructions;
    } catch (error) {
      Utils.logAction(`Fehler beim Laden des Levels: ${error.message}`, "red");
    }
  }

  /**
   * Führt den Benutzer-Code aus.
   */
  async runUserCode() {
    const userCode = this.editor.getValue();
    if (!userCode) {
      Utils.logAction("Kein Code vorhanden.", "red");
      return;
    }

    if (this.codeRunning) {
      return;
    }

    const transformedCode = this.codeParser.transformUserCode(userCode);
    console.log("Transformierter Code:", transformedCode);
    if (!transformedCode) {
      Utils.logAction("Fehler beim Transformieren des Codes.", "red");
      return;
    }

    try {
      Utils.deleteLog();
      this.codeRunning = true;
      this.gameController.reset();
      await eval(transformedCode); // Benutzer-Code ausführen
    } catch (error) {
      Utils.logAction(`Fehler im Code: ${error.message}`, "red");
    } finally {
      this.codeRunning = false;
    }
  }

  /**
   * Setzt das aktuelle Level zurück.
   */
  resetGame() {
    if (this.currentLevel) {
      Utils.removeFromStorage(`${this.currentLevel}-userCode`);
      this.gameController.reset();
      Utils.logAction("Spiel zurückgesetzt.", "orange");
    } else {
      Utils.logAction(
        "Kein Level geladen, das zurückgesetzt werden kann.",
        "red"
      );
    }
  }

  stopUserCode() {
    this.gameController.stopUserCode();
  }
}
