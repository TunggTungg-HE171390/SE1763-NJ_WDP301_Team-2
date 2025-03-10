import { fileURLToPath } from "url";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Convert `import.meta.url` to a file path equivalent to `__dirname`
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    base: "/tamgiao",
});
