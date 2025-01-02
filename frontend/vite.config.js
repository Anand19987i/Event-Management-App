import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['fabric'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Ensures CommonJS modules are transformed correctly
    },
  },
});
