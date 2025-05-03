import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Specify the root directory where index.html is located
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 3000,
    strictPort: true, // Don't try another port if 3000 is in use
  },
  build: {
    outDir: 'dist',
  },
});
