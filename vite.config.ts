import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        main: "index.html",
        puzzleVsZombiePrivacy: "privacy/puzzle-vs-zombie/index.html",
        whiteNinjaPrivacy: "privacy/white-ninja/index.html",
      },
    },
  },
});
