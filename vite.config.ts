/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA, no backend (PRODUCT.md section 6). Deployed to Vercel from a
// plain `vite build`, so the default base and output paths are what we want.
//
// Vite does not read PORT on its own. Honouring it lets tooling that assigns a
// port (and CI) drive the dev server instead of silently landing on a
// different port than the one it was told to use.
const port = Number(process.env['PORT']) || 5173

export default defineConfig({
  plugins: [react()],
  server: { port },
  preview: { port },
})
