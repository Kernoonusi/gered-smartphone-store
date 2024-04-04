import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@shadcnUi": path.resolve(__dirname, "./src/components/ui"),
		},
	},
	plugins: [react(), eslint(), TanStackRouterVite()],
});
