import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Localmente, a API roda na máquina host. O Docker Compose substitui esse
// destino pelo nome do serviço backend na rede interna dos containers.
const apiTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:8000';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { 

    proxy: { 

      "/api": { target: apiTarget, changeOrigin: true },

    }, 

    watch: { usePolling: true }, 

  }, 

});


