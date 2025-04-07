# Pirat Programming

Ein interaktives Projekt, das spielerisch Programmierlogik vermittelt. Entwickelt mit [Vite](https://vitejs.dev/) für schnelle und moderne Webentwicklung. Es basiert auf der Idee des Hamstersimulators.

## 🚀 Schnellstart

### Installation

1. **Repository klonen**:

```sh
git clone <repository-url>
cd pirat-programming
```

2. **Abhängigkeiten installieren**:

```sh
npm install
```

3. **Entwicklung starten**:

```sh
npm run dev
```

4. **Produktion bauen**:

```sh
npm run build
```

## 🕹️ Benutzerbefehle

- **`move()` / `vor()`**: Bewegt den Spieler einen Schritt vorwärts.
- **`turnLeft()` / `links()`**: Dreht den Spieler um 90° nach links.
- **`noWater()` / `vorneFrei()`**: Prüft, ob vor dem Spieler Land ist.
- **`setMarker()` / `setzteMarkierung()`**: Setzt eine Markierung.
- **`onTreasure()` / `aufSchatz()`**: Prüft, ob der Spieler auf einem Schatz steht.

## 📂 Projektstruktur

Das Projekt ist in verschiedene Verzeichnisse und Dateien unterteilt, um die Entwicklung und Wartung zu erleichtern:

### Hauptverzeichnisse

- **`src/`**: Hauptverzeichnis des Quellcodes.

  - **`core/`**: Enthält die Kernlogik des Spiels.
    - **`GameController.js`**: Verwalten des Spielzustands, der Spiellogik und der Interaktionen.
    - **`Renderer.js`**: Zeichnet das Spielfeld, den Spieler, den Schatz und andere Elemente.
    - **`LevelLoader.js`**: Laden und Speichern von Level-Daten.
    - **`Utils.js`**: Hilfsfunktionen wie Logging, Verzögerungen und Speicheroperationen.
    - **`InputHandler.js`**: Verarbeitet Benutzereingaben wie Klicks und Tastendrücke.
    - **`editor/`**: Konfiguration und Integration des Monaco Editors.
      - **`monaco-config.js`**: Anpassung des Editors (z. B. Syntax-Highlighting, Autovervollständigung).
      - **`monaco-worker-loader.js`**: Lädt die Monaco-Worker für verschiedene Sprachen.
  - **`scripts/`**: Enthält die Hauptskripte für die Startseite und das Spiel.
    - **`home.js`**: Initialisiert die Levelübersicht und das Laden von Leveln.
    - **`game.js`**: Steuert die Spiellogik und die Benutzerinteraktionen im Spiel.
  - **`styles/`**: CSS-Dateien für das Styling der Anwendung.
    - **`style.css`**: Globale Stile für die Anwendung.
    - **`home.css`**: Stile für die Startseite.
    - **`game.css`**: Stile für die Spielseite.
  - **`GameAPI.js`**: Hauptklasse zur Verwaltung des Spiels und der Benutzerinteraktionen.
  - **`userFunctions.js`**: Benutzerdefinierte Funktionen, die im Spiel verwendet werden können.

- **`public/`**: Statische Dateien, die direkt bereitgestellt werden.
  - **`levels/`**: JSON-Dateien mit den Definitionen der verschiedenen Spiellevel.
  - **`index.html`**: Startseite des Projekts.
  - **`game.html`**: Seite, auf der das Spielfeld und der Code-Editor angezeigt werden.

### Wichtige Dateien

- **`vite.config.js`**: Konfigurationsdatei für Vite, die den Entwicklungs- und Build-Prozess steuert.
- **`package.json`**: Enthält Metadaten über das Projekt sowie die Abhängigkeiten und Skripte.
- **`.gitignore`**: Definiert Dateien und Verzeichnisse, die nicht in das Git-Repository aufgenommen werden sollen.
- **`README.md`**: Dokumentation des Projekts (diese Datei).

### Level-Dateien

Die Level-Dateien befinden sich im Verzeichnis **`public/levels/`** und sind im JSON-Format. Sie enthalten:

- **`titel`**: Der Name des Levels.
- **`player`**: Startposition und Richtung des Spielers.
- **`treasure`**: Position des Schatzes.
- **`map`**: 2D-Array, das die Karte definiert (0 = Wasser, 1 = Land).
- **`instructions`**: HTML-Inhalt mit Anweisungen für das Level.

Diese Struktur sorgt dafür, dass der Code modular und leicht verständlich bleibt, während er gleichzeitig die Flexibilität bietet, neue Features hinzuzufügen.

## 🛠️ Technologien

- [Vite](https://vitejs.dev/) für schnelle Entwicklung.
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) für den integrierten Code-Editor.
- [Acorn](https://github.com/acornjs/acorn) für die Code-Analyse.

## 📜 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

Viel Spaß beim Programmieren und Entdecken! 🏴‍☠️
