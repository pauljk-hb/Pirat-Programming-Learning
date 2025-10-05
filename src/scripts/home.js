import { LevelLoader } from "../Game/core/LevelLoader.js";
import feather from "feather-icons";

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
  "level6.json",
  "level7.json",
  "level8.json",
  "level9.json",
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
      img.style.width = "70px"; // Größe des Vorschaubilds
      img.style.height = "70px";
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
    const innderDivBtn = document.createElement("div");

    if (level.preview) {
      const img = document.createElement("img");
      img.src = level.preview; // Base64-Bild als Quelle setzen
      img.alt = `Vorschaubild für ${level.fileName}`;
      img.style.width = "70px"; // Größe des Vorschaubilds
      img.style.height = "70px";
      innerDiv.appendChild(img);
    }

    const button = document.createElement("button");
    button.textContent = "Level starten";
    button.className = "pixel-button";
    button.onclick = () => {
      window.location.href = `game.html?level=${level.fileName}&custom=true`;
    };

    const deleteButton = document.createElement("button");
    deleteButton.className = "pixel-button";
    const i = document.createElement("i");
    i.setAttribute("data-feather", "x");
    i.className = "feather-icon";
    deleteButton.prepend(i);
    deleteButton.onclick = () => {
      levelLoader.deleteCustomLevel(level.fileName).then(() => {
        window.location.reload();
      });
    };

    innerDiv.appendChild(title);
    innderDivBtn.appendChild(button);
    innderDivBtn.appendChild(deleteButton);
    div.appendChild(innerDiv);
    div.appendChild(innderDivBtn);
    customLevelList.appendChild(div);
  });
  feather.replace();
});

loadCustomLevelBtn.addEventListener("click", async () => {
  levelLoader.customLevelToLocalStore().then(() => {
    window.location.reload();
  });
});

feather.replace();
