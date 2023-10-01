import { defineConfig } from "vite";
import { createVuePlugin as vue } from "vite-plugin-vue2";
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'

const path = require("path");
export default defineConfig({
  plugins: [vue(),
  Components({
    resolvers: [VuetifyResolver()]
  })],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
