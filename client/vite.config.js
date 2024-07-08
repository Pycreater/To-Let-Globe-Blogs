import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://blogs-eyj8.onrender.com",
      // "/api": "http://localhost:8000",
    },
  },
  plugins: [react()],
});
