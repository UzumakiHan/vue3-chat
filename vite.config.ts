import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import type { ViteSentryPluginOptions } from 'vite-plugin-sentry'
import viteSentry from 'vite-plugin-sentry'
const sentryConfig: ViteSentryPluginOptions = {
  url: 'https://hfex.sentry.io/',
  authToken: 'bd2c3afa0a134758aa7a2526a27b794692bb67e9b13242328a8572134a38e1fc',
  org: 'hfex',
  project: 'vue-chat3',
  release: '1.0',
  deploy: {
    env: 'production'
  },
  setCommits: {
    auto: true
  },
  sourceMaps: {
    include: ['./dist/assets'],
    ignore: ['node_modules'],
    urlPrefix: '~/assets'
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteSentry(sentryConfig)],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
  base: './'
})
