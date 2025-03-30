import { describe, it, expect, beforeEach } from "vitest";
import { GameController } from "../src/core/GameController.js";

describe("GameController", () => {
  let canvas, gameController;

  beforeEach(() => {
    // Mock-Canvas erstellen
    canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;

    // GameController-Instanz erstellen
    gameController = new GameController(canvas, 50);
  });

  it("should initialize the game with level data", () => {
    const levelData = {
      player: { x: 1, y: 1, direction: "up" },
      treasure: { x: 3, y: 3 },
      map: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    };

    gameController.initGame(levelData);

    expect(gameController.getPlayer()).toEqual(levelData.player);
    expect(gameController.getTreasure()).toEqual(levelData.treasure);
    expect(gameController.getMap()).toEqual(levelData.map);
  });

  it("should reset the game correctly", () => {
    const levelData = {
      player: { x: 1, y: 1, direction: "up" },
      treasure: { x: 3, y: 3 },
      map: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    };

    gameController.initGame(levelData);
    gameController.resetGame();

    expect(gameController.getPlayer().x).toBe(0);
    expect(gameController.getPlayer().y).toBe(0);
    expect(gameController.getPlayer().direction).toBe("up");
    expect(gameController.getMap()).toEqual(levelData.map);
  });

  it("should move the player correctly", () => {
    const levelData = {
      player: { x: 1, y: 1, direction: "up" },
      treasure: { x: 3, y: 3 },
      map: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    };

    gameController.initGame(levelData);
    gameController.movePlayer();

    expect(gameController.getPlayer().x).toBe(1);
    expect(gameController.getPlayer().y).toBe(0);
  });

  it("should not move the player into water", () => {
    const levelData = {
      player: { x: 1, y: 1, direction: "up" },
      treasure: { x: 3, y: 3 },
      map: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    };

    gameController.initGame(levelData);
    gameController.movePlayer();

    expect(gameController.getPlayer().x).toBe(1);
    expect(gameController.getPlayer().y).toBe(1); // Spieler bleibt auf Land
  });

  it("should turn the player left correctly", () => {
    const levelData = {
      player: { x: 1, y: 1, direction: "up" },
      treasure: { x: 3, y: 3 },
      map: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    };

    gameController.initGame(levelData);
    gameController.turnLeft();

    expect(gameController.getPlayer().direction).toBe("left");
  });

  it("should detect when the player reaches the treasure", () => {
    const levelData = {
      player: { x: 3, y: 3, direction: "up" },
      treasure: { x: 3, y: 3 },
      map: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    };

    gameController.initGame(levelData);

    expect(gameController.checkTreasure()).toBe(true);
  });

  it("should add a cross at the correct position", () => {
    const levelData = {
      player: { x: 1, y: 1, direction: "up" },
      treasure: { x: 3, y: 3 },
      map: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    };

    gameController.initGame(levelData);
    gameController.addCross(1, 1);

    expect(gameController.crosses).toContainEqual({ x: 1, y: 1 });
  });

  it("should detect when the player is on a cross", () => {
    const levelData = {
      player: { x: 1, y: 1, direction: "up" },
      treasure: { x: 3, y: 3 },
      map: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    };

    gameController.initGame(levelData);
    gameController.addCross(1, 1);

    expect(gameController.checkCrosses()).toBe(true);
  });
});
