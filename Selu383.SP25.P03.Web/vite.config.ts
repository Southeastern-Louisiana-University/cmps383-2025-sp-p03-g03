import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],

    //server: {
    //    port: 5173, // Default Vite port
    //    strictPort: true,
    //    // No proxy needed as we'll configure ASP.NET Core to serve the Vite dev server
    //},
    //build: {
    //    // Generate manifest for ASP.NET Core to reference the correct asset paths
    //    manifest: true,
    //    outDir: '../Selu383.SP25.P03/wwwroot', // Replace with your actual project name
    //    emptyOutDir: true
    //}
});

