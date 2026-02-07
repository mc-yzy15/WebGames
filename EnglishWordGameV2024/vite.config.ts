import {defineConfig} from "vite";
import {fileURLToPath} from "url";
import {dirname, resolve} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent Vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host ? {
            protocol: "ws",
            host,
            port: 1421
        } : undefined,
        watch: { // 3. tell Vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"]
        }
    },
    // 配置构建选项
    build: { // 输出目录
        outDir: "dist",
        // 资源内联限制
        assetsInlineLimit: 0,
        // 滚动优化
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                account: resolve(__dirname, "account.html"),
                word: resolve(__dirname, "src/games/word/index.html"),
                jvzi: resolve(__dirname, "src/games/jvzi/index.html")
            }
        }
    }
}));
