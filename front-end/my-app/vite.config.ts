import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})

module.exports = {
  theme: {
    extend: {
      colors: {
        'azul-escuro': '#00275A',
      },
    },
  },
}