import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        minify: "esbuild", // Use esbuild for faster builds
        rollupOptions: {
            output: {
                manualChunks(id) { // Split components, pages and vendor code
                    if (id.includes("components/"))
                        return "components";
                    else if (id.includes("pages/"))
                        return "pages";
                    else if (id.includes("node_modules/"))
                        return "vendor";
                },
            },
        },
    },
});
