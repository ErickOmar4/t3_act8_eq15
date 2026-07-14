import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite config — https://vitejs.dev/config/
// NOTA: cuando llegues a la FASE 4 (despliegue en el VPS), cambia el valor
// de "base" para que coincida con la ruta de tu equipo, por ejemplo:
// base: '/t3_act8_eqXX/'
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
