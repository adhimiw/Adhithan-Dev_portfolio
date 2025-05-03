import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Skip TypeScript checking for production builds
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions: {
          skipLibCheck: true,
          skipDefaultLibCheck: true,
        }
      }
    }
  },
  build: {
    // Disable TypeScript checking during build
    typescript: {
      noEmit: true,
      skipLibCheck: true,
    }
  }
});
