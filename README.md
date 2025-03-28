# Pirat Programming

Dieses Projekt wurde mit [Vite](https://vitejs.dev/) erstellt und bietet eine interaktive Umgebung, um Programmierlogik spielerisch zu erlernen.

## 🚀 Installation & Start

### 1. Repository klonen

```sh
git clone <repository-url>
cd pirat-programming
```

### 2. Abhängigkeiten installieren

```sh
npm install
```

### 3. Entwicklung starten

```sh
npm run dev
```

## 📦 Produktion bauen

```sh
npm run build
```

## 🕹️ Features

- **Interaktives Spielfeld**: Erstelle und bearbeite Level mit einem visuellen Editor.
- **Code-Editor**: Schreibe und führe JavaScript-Code direkt im Browser aus.
- **Lernfunktionen**: Nutze vordefinierte Funktionen wie `move()`, `turnLeft()`, `noWater()` und mehr, um den Spieler zu steuern.
- **Level speichern und laden**: Speichere deine Level als JSON-Dateien und lade sie später wieder.

## 🛠️ Technologien

- [Vite](https://vitejs.dev/) für schnelle Entwicklung
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) für den integrierten Code-Editor
- [Acorn](https://github.com/acornjs/acorn) für die Code-Analyse

## 📜 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

## 📖 Anleitung

### Verfügbare Funktionen

- **Englische Funktionsnamen**:

  - `move()`: Bewegt den Spieler einen Schritt in die aktuelle Richtung.
  - `turnLeft()`: Dreht den Spieler um 90° nach links.
  - `noWater()`: Prüft, ob vor dem Spieler Land (kein Wasser) ist.
  - `setMarker()`: Setzt eine Markierung an der aktuellen Position des Spielers.
  - `onTreasure()`: Prüft, ob der Spieler auf dem Schatz steht.

- **Deutsche Funktionsnamen**:
  - `vor()`: Bewegt den Spieler einen Schritt in die aktuelle Richtung.
  - `links()`: Dreht den Spieler um 90° nach links.
  - `vorneFrei()`: Prüft, ob vor dem Spieler Land (kein Wasser) ist.
  - `setzteMarkierung()`: Setzt eine Markierung an der aktuellen Position des Spielers.
  - `aufSchatz()`: Prüft, ob der Spieler auf dem Schatz steht.

### Level-Editor

- **Spieler platzieren**: Wähle "Player" und klicke auf das Spielfeld.
- **Land/Wasser setzen**: Wähle "Land" oder "Wasser" und klicke auf das Spielfeld.
- **Schatz platzieren**: Wähle "Schatz" und klicke auf das Spielfeld.

Viel Spaß beim Programmieren und Entdecken! 🏴‍☠️
