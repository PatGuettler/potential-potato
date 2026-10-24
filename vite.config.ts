import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// `npm run build:demo` produces a fully static, backend-free build for GitHub Pages.
const isDemo = process.env.VITE_DEMO === "true";

export default defineConfig({
  base: isDemo ? "./" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@data": path.resolve(__dirname, "data"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, isDemo ? "dist/demo" : "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      allow: [__dirname],
      deny: ["**/.*", "**/db.json"],
    },
  },
});
