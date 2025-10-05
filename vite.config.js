import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    target: "es2022", // Unterstützt top-level await
    rollupOptions: {
      input: {
        main: "index.html",
        game: "game.html",
        levelEditor: "levelEditor.html",
      },
    },
  },
  esbuild: {
    target: "es2022", // ESBuild sollte auch ES2022 targeten
  },
});
