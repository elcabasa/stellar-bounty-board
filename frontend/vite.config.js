/// <reference types="vitest" />
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
// ─── Content-Security-Policy plugin (issue #351) ──────────────────────────────
// Injects a CSP meta tag into index.html at build time.
// Report-only mode is used first so violations are logged to the browser console
// without blocking any existing functionality.  Upgrade to enforcement
// (Content-Security-Policy) once no violations are observed in staging.
function cspPlugin() {
    var cspDirectives = [
        "default-src 'self'",
        "connect-src 'self' https://rpc-futurenet.stellar.org https://api.github.com",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join("; ");
    return {
        name: "vite-plugin-csp",
        transformIndexHtml: function (html) {
            // Inject report-only CSP so violations are visible in the browser console
            var reportOnlyMeta = "<meta http-equiv=\"Content-Security-Policy-Report-Only\" content=\"".concat(cspDirectives, "\">");
            return html.replace(/(<head[^>]*>)/i, "$1\n    ".concat(reportOnlyMeta));
        },
    };
}
export default defineConfig(function (_a) {
    var mode = _a.mode;
    return ({
        plugins: __spreadArray([
            react(),
            cspPlugin()
        ], (mode === "analyze"
            ? [
                visualizer({
                    filename: "dist/bundle-report.html",
                    open: true,
                    gzipSize: true,
                    brotliSize: true,
                    template: "treemap",
                }),
            ]
            : []), true),
        build: {
            rollupOptions: {
                output: {
                    /**
                     * Manual chunk strategy:
                     *
                     * 1. react-vendor  — react + react-dom are the heaviest runtime deps and
                     *    change rarely, so they get a long-lived cached chunk.
                     * 2. ui-vendor     — lucide-react icons + sonner toast library. Both are
                     *    UI-only and update independently from app logic.
                     * 3. Everything else falls into the default app chunk(s).
                     */
                    manualChunks: function (id) {
                        if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
                            return "react-vendor";
                        }
                        if (id.includes("node_modules/lucide-react/") || id.includes("node_modules/sonner/")) {
                            return "ui-vendor";
                        }
                    },
                },
            },
        },
        test: {
            environment: "jsdom",
            setupFiles: "./src/setupTests.ts",
            globals: true,
        },
        server: {
            port: 3000,
            proxy: {
                "/api": {
                    target: "http://localhost:3001",
                    changeOrigin: true,
                },
            },
        },
    });
});
