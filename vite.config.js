import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        game: "game.html",
        levelEditor: "levelEditor.html",
        test: "test.html",
      },
    },
  },
});
