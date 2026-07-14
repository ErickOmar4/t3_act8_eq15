import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/t3_act8_eq15/',
  plugins: [react(), tailwindcss()],
})
