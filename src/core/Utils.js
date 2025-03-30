export class Utils {
  static logOutput = null;

  /**
   * Verzögert die Ausführung um die aktuelle Verzögerungszeit (aus dem Slider).
   * @returns {Promise<void>} - Ein Promise, das nach der Verzögerung aufgelöst wird.
   */
  static delay() {
    const slider = document.getElementById("speedControl"); // Slider direkt auslesen
    let delayTime = parseInt(slider.value);
    delayTime = (11 - delayTime) * 100;
    console.log("Delay time:", delayTime);
    return new Promise((resolve) => setTimeout(resolve, delayTime));
  }

  /**
   * Loggt eine Aktion in ein definiertes Log-Element.
   * @param {string} action - Die Aktion, die geloggt werden soll.
   * @param {string} [styling=""] - Optionales CSS-Styling für den Log-Eintrag.
   */
  static logAction(action, styling = "") {
    const logOutput = document.getElementById("logOutput");
    if (!logOutput) {
      console.warn("Log-Element nicht gefunden.");
      return;
    }

    const logEntry = document.createElement("div");
    logEntry.textContent = `→ ${action}`;
    if (styling) logEntry.className = styling;
    logOutput.appendChild(logEntry);
    logOutput.scrollTop = logOutput.scrollHeight;
  }

  /**
   * Berechnet die Position auf dem Spielfeld basierend auf einem Klick.
   * @param {MouseEvent} event - Das Klick-Event.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element.
   * @param {number} gridSize - Die Größe eines einzelnen Grids.
   * @returns {{ x: number, y: number }} - Die berechneten Koordinaten.
   */
  static getGridPositionFromClick(event, canvas, gridSize) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize);
    const y = Math.floor((event.clientY - rect.top) / gridSize);
    return { x, y };
  }

  /**
   * Prüft, ob zwei Objekte mit `x` und `y`-Eigenschaften gleich sind.
   * @param {{ x: number, y: number }} obj1 - Erstes Objekt.
   * @param {{ x: number, y: number }} obj2 - Zweites Objekt.
   * @returns {boolean} - `true`, wenn die Objekte gleich sind, sonst `false`.
   */
  static arePositionsEqual(obj1, obj2) {
    return obj1.x === obj2.x && obj1.y === obj2.y;
  }

  /**
   * Lädt ein JSON-Objekt von einer angegebenen URL.
   * @param {string} url - Die URL der JSON-Datei.
   * @returns {Promise<object>} - Ein Promise, das das JSON-Objekt zurückgibt.
   */
  static async fetchJson(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fehler beim Laden der Datei: ${url}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Fehler beim Abrufen der JSON-Datei:", error.message);
      throw error;
    }
  }

  /**
   * Setzt das Log-Element, das für die Ausgabe von Aktionen verwendet wird.
   * @param {HTMLElement} element - Das Log-Element.
   */
  static setLogOutput(element) {
    this.logOutput = element;
  }

  /**
   * Loggt eine Aktion in das Log-Element.
   * @param {string} action - Die Aktion, die geloggt werden soll.
   * @param {string} [styling=""] - Optionales CSS-Styling für den Log-Eintrag.
   */
  static logAction(action, styling = "") {
    if (!this.logOutput) {
      console.warn("Log-Element nicht gefunden.");
      return;
    }

    const logEntry = document.createElement("div");
    logEntry.textContent = `→ ${action}`;
    if (styling) logEntry.className = styling;
    this.logOutput.appendChild(logEntry);
    this.logOutput.scrollTop = this.logOutput.scrollHeight;
  }

  static deleteLog() {
    if (this.logOutput) {
      this.logOutput.innerHTML = ""; // Löscht den Inhalt des Log-Elements
    } else {
      console.warn("Log-Element nicht gefunden.");
    }
  }
}
