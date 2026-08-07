import { copyFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
// GitHub Pages serves this project site from https://<user>.github.io/William-Vasseur/
export default defineConfig({
  base: '/William-Vasseur/',
  plugins: [react(), spaFallback()],
})

// GitHub Pages has no server-side rewrite: a direct hit on /projects returns its
// 404 page. Shipping a copy of index.html as 404.html makes the SPA boot anyway.
function spaFallback(): Plugin {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      const dist = resolve(rootDir, 'dist')
      const index = resolve(dist, 'index.html')
      if (existsSync(index)) {
        copyFileSync(index, resolve(dist, '404.html'))
      }
    },
  }
}
