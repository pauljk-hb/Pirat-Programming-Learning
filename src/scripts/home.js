import { LevelLoader } from "../core/LevelLoader.js";

const levelList = document.getElementById("levelList");

const levelLoader = new LevelLoader();

const levelFiles = [
  "level1.json",
  "level2.json",
  "level3.json",
  "level4.json",
  "level5.json",
];

levelLoader.loadAllLevel(levelFiles).then((levels) => {
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
    button.onclick = () => {
      window.location.href = `game.html?level=${levelFiles[index]}`;
    };

    innerDiv.appendChild(title);
    div.appendChild(innerDiv);
    div.appendChild(button);
    levelList.appendChild(div);
  });
});
