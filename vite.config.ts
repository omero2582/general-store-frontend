import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr({include: "**/*.svg?react",})],
  server: {
    proxy: {
      // '/api' : 'http://localhost:3000'
      '/api' : {
        // target: 'http://localhost:3000',
        target: 'http://127.0.0.1:3000',
        changeOrigin: false,
      }
    }
  },
})
