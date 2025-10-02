import { LevelLoader } from "../Game/core/LevelLoader.js";

const levelList = document.getElementById("levelList");
const customLevelList = document.getElementById("customLevelList");
const loadCustomLevelBtn = document.getElementById("loadCustomLevel");

const levelLoader = new LevelLoader();

const levelFiles = [
  "level1.json",
  "level2.json",
  "level3.json",
  "level4.json",
  "level5.json",
];

levelLoader.loadAllStandardLevel(levelFiles).then((levels) => {
  console.log("Alle Level geladen:", levels);
  levels.forEach((level, index) => {
    const div = document.createElement("div");
    const innerDiv = document.createElement("div");
    div.className = "level-item";
    const title = document.createElement("h3");
    title.textContent = level.titel;

    if (level.preview) {
      const img = document.createElement("img");
      img.src = level.preview; // Base64-Bild als Quelle setzen
      img.alt = `Vorschaubild für ${level.titel}`;
      img.style.width = "100px"; // Größe des Vorschaubilds
      img.style.height = "100px";
      innerDiv.appendChild(img);
    }

    const button = document.createElement("button");
    button.textContent = "Level starten";
    button.className = "pixel-button";
    button.onclick = () => {
      window.location.href = `game.html?level=${levelFiles[index]}`;
    };

    innerDiv.appendChild(title);
    div.appendChild(innerDiv);
    div.appendChild(button);
    levelList.appendChild(div);
  });
});

levelLoader.loadAllCustomLevel().then((levels) => {
  console.log("Alle benutzerdefinierten Level geladen:", levels);
  levels.forEach((level, index) => {
    const div = document.createElement("div");
    const innerDiv = document.createElement("div");
    div.className = "level-item";
    const title = document.createElement("h3");
    title.textContent = level.fileName.replace(".json", "");

    if (level.preview) {
      const img = document.createElement("img");
      img.src = level.preview; // Base64-Bild als Quelle setzen
      img.alt = `Vorschaubild für ${level.fileName}`;
      img.style.width = "100px"; // Größe des Vorschaubilds
      img.style.height = "100px";
      innerDiv.appendChild(img);
    }

    const button = document.createElement("button");
    button.textContent = "Level starten";
    button.className = "pixel-button";
    button.onclick = () => {
      window.location.href = `game.html?level=${level.fileName}&custom=true`;
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Level löschen";
    deleteButton.className = "pixel-button";
    deleteButton.onclick = () => {
      levelLoader.deleteCustomLevel(level.fileName).then(() => {
        window.location.reload();
      });
    };

    innerDiv.appendChild(title);
    div.appendChild(innerDiv);
    div.appendChild(button);
    div.appendChild(deleteButton);
    customLevelList.appendChild(div);
  });
});

loadCustomLevelBtn.addEventListener("click", async () => {
  levelLoader.customLevelToLocalStore().then(() => {
    window.location.reload();
  });
});
