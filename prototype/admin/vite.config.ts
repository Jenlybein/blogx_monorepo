import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import vueSourceLocator from "@blogx/vite-plugin-vue-source-locator";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [
    vueSourceLocator({
      launchEditor: "code",
      overlay: false,
      pathMode: "relative",
      triggerKey: "alt",
    }),
    vue(),
    vueDevTools({
      launchEditor: "code", // 明确指定用VSCode打开
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 4178,
  },
});
