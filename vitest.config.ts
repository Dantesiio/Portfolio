import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
