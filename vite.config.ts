import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Freebuff injects PORT for the isolated workspace preview.
const port = Number(process.env.PORT) || 5173;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port,
    strictPort: true,
    // Freebuff requires HMR to remain disabled.
    hmr: false,
  },
  preview: {
    host: true,
    port,
    strictPort: true,
  },
});
