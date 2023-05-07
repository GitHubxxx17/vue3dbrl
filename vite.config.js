import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig({
  base: '/GitHubxxx17/vue3dbrl',
  lintOnSave: false,
  publicPath: process.env.NODE_ENV == "production"?"./":"/",
  plugins: [vue(),
  Components({
    resolvers: [VantResolver()],
  }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
