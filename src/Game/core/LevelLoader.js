import { Utils } from "./Utils.js";

/**
 * LevelLoader-Klasse zum Laden und Speichern von Level-Daten.
 */
export class LevelLoader {
  /**
   * Erstellt eine neue LevelLoader-Instanz.
   * @param {string} basePath - Der Basis-Pfad für die Level-Dateien.
   */
  constructor(basePath = "/levels/") {
    this.basePath = basePath; // Standardpfad für Level-Dateien
  }

  /**
   * Lädt eine Standard-Level-Datei aus dem public/levels-Verzeichnis.
   * @param {string} levelFile - Der Name der Level-Datei (z. B. "level1.json").
   * @returns {Promise<object>} - Ein Promise, das die Level-Daten zurückgibt.
   */
  async loadStandartLevel(levelFile) {
    const url = `${this.basePath}${levelFile}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Level "${levelFile}" konnte nicht geladen werden.`);
      }
      return await response.json();
    } catch (error) {
      console.error("Fehler beim Laden des Levels:", error.message);
      throw error;
    }
  }

  /**
   * Gibt alle Standard-Level-Dateien aus dem public/levels-Verzeichnis zurück.
   * @param {string[]} levelFiles - Ein Array von Level-Dateinamen.
   * @returns {Promise<string[]>} - Ein Promise, das ein Array von Level-Dateinamen zurückgibt.
   */
  async loadAllStandardLevel(levelFiles) {
    const levelPromises = levelFiles.map((file) =>
      this.loadStandartLevel(file)
    );
    try {
      const levels = await Promise.all(levelPromises);
      return levels;
    } catch (error) {
      console.error("Fehler beim Laden der Level:", error.message);
      throw error;
    }
  }

  /**
   * Lädt ein benutzerdefiniertes Level aus dem lokalen Speicher.
   * @param {string} levelFile - Der Name der Level-Datei (z. B. "custom-level.json").
   * @returns {Promise<object|null>} - Ein Promise, das die Level-Daten zurückgibt oder null, wenn das Level nicht gefunden wurde.
   */
  async loadCustomLevel(levelFile) {
    return new Promise((resolve, reject) => {
      try {
        const storedLevel = Utils.loadFromStorage(levelFile);
        if (storedLevel) {
          resolve(JSON.parse(storedLevel));
        } else {
          reject(
            new Error(
              `Level "${levelFile}" nicht im lokalen Speicher gefunden.`
            )
          );
        }
      } catch (error) {
        console.error(
          "Fehler beim Laden des benutzerdefinierten Levels:",
          error.message
        );
        reject(error);
      }
    });
  }

  /**
   * Lädt alle benutzerdefinierten Level-Dateien aus dem lokalen Speicher.
   * @returns {Promise<object[]>} - Ein Promise, das ein Array von Level-Daten zurückgibt.
   */
  async loadAllCustomLevel() {
    let levelNames = Utils.loadFromStorage("levelNames");
    levelNames = JSON.parse(levelNames);
    if (!Array.isArray(levelNames)) return [];
    const levelPromises = levelNames.map((file) => this.loadCustomLevel(file));
    try {
      const levels = await Promise.all(levelPromises);
      levels.forEach((level, index) => {
        level.name = levelNames[index];
      });
      return levels;
    } catch (error) {
      console.error(
        "Fehler beim Laden der benutzerdefinierten Level:",
        error.message
      );
      throw error;
    }
  }

  /**
   * Lädt ein Level aus einer lokalen JSON-Datei, die der Benutzer auswählt.
   * @returns {Promise<object|null>} - Ein Promise, das die Level-Daten zurückgibt oder null, wenn der Benutzer abbricht.
   */
  async loadLevelFromFile() {
    return new Promise((resolve, reject) => {
      try {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.onchange = async (event) => {
          const file = event.target.files[0];
          if (!file) {
            console.error("Keine Datei ausgewählt.");
            resolve(null);
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const levelData = JSON.parse(e.target.result);
              levelData.fileName = file.name;
              console.log("Level-Daten geladen:", levelData);
              resolve(levelData);
            } catch (error) {
              console.error(
                "Fehler beim Parsen der JSON-Datei:",
                error.message
              );
              reject(error);
            }
          };
          reader.onerror = () => {
            reject(new Error("Fehler beim Lesen der Datei"));
          };
          reader.readAsText(file);
        };
        fileInput.oncancel = () => {
          resolve(null);
        };
        fileInput.click();
      } catch (error) {
        console.error("Fehler beim Laden der Datei:", error.message);
        reject(error);
      }
    });
  }

  async customLevelToLocalStore() {
    try {
      const levelData = await this.loadLevelFromFile();
      if (levelData) {
        // Validierung der Level-Daten
        if (!levelData.map || !Array.isArray(levelData.map)) {
          throw new Error(
            "Ungültige Level-Daten: Karte fehlt oder ist ungültig."
          );
        }
        if (!levelData.player || typeof levelData.player !== "object") {
          throw new Error(
            "Ungültige Level-Daten: Spieler fehlt oder ist ungültig."
          );
        }
        if (!levelData.treasure || typeof levelData.treasure !== "object") {
          throw new Error(
            "Ungültige Level-Daten: Schatz fehlt oder ist ungültig."
          );
        }

        let levelNames = Utils.loadFromStorage("levelNames");
        levelNames = levelNames ? JSON.parse(levelNames) : [];
        if (!levelNames.includes(levelData.fileName)) {
          levelNames.push(levelData.fileName);
          Utils.saveToStorage("levelNames", JSON.stringify(levelNames));
        }
        // Speichern der validierten Level-Daten im lokalen Speicher
        Utils.saveToStorage(`${levelData.fileName}`, JSON.stringify(levelData));
      }
    } catch (error) {
      Utils.logAction(
        `Fehler beim Speichern des Levels: ${error.message}`,
        "red"
      );
    }
  }

  async deleteCustomLevel(levelFile) {
    try {
      let levelNames = Utils.loadFromStorage("levelNames");
      levelNames = JSON.parse(levelNames);
      if (!Array.isArray(levelNames)) return;
      levelNames = levelNames.filter((name) => name !== levelFile);
      Utils.saveToStorage("levelNames", JSON.stringify(levelNames));
      Utils.deleteObjectFromStorage(levelFile);
    } catch (error) {
      console.error("Fehler beim Löschen des Levels:", error.message);
      throw error;
    }
  }

  /**
   * Speichert ein Level als JSON-Datei.
   * Hinweis: Diese Methode speichert die Datei lokal im Browser (Client-seitig).
   * @param {object} levelData - Die Level-Daten, die gespeichert werden sollen.
   * @param {string} levelFile - Der Name der Datei, die gespeichert werden soll (z. B. "customLevel.json").
   */
  saveLevel(levelData, levelFile) {
    try {
      const blob = new Blob([JSON.stringify(levelData, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = levelFile;
      link.click();
    } catch (error) {
      console.error("Fehler beim Speichern des Levels:", error.message);
      throw error;
    }
  }
}
