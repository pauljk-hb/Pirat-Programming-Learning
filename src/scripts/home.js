import { LevelLoader } from "../core/LevelLoader.js";

const levelList = document.getElementById("levelList");
const uploadForm = document.getElementById("uploadForm");
const levelFileInput = document.getElementById("levelFile");

const levelLoader = new LevelLoader();

const levelFiles = ["level1.json", "level2.json"];

levelLoader.loadAllLevel(levelFiles).then((levels) => {
  console.log("Alle Level geladen:", levels);
  levels.forEach((level, index) => {
    const option = document.createElement("option");
    option.value = levelFiles[index];
    option.textContent = levelFiles[index];
    levelList.appendChild(option);
  });
});
