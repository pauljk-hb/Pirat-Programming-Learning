/**
 * LevelLoader-Klasse zum Laden und Speichern von Level-Daten.
 */
export class LevelLoader {
  /**
   * Erstellt eine neue LevelLoader-Instanz.
   * @param {string} basePath - Der Basis-Pfad für die Level-Dateien.
   */
  constructor(basePath = "/public/levels/") {
    this.basePath = basePath; // Standardpfad für Level-Dateien
  }

  /**
   * Lädt ein Level aus einer JSON-Datei.
   * @param {string} levelFile - Der Name der Level-Datei (z. B. "level1.json").
   * @returns {Promise<object>} - Ein Promise, das die Level-Daten zurückgibt.
   */
  async loadLevel(levelFile) {
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
