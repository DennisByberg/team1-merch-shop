import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-proxy': {
        target:
          'https://review.agreeablewater-71863421.swedencentral.azurecontainerapps.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ''),
        secure: false,
      },
    },
  },
});
