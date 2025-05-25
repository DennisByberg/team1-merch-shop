import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Ladda miljövariabler
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api-proxy': {
          target: env.VITE_JIN_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-proxy/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const apiKey = env.VITE_JIN_API_KEY;
              if (apiKey) {
                proxyReq.setHeader('X-API-KEY', apiKey);
              } else {
                console.error('No API key found for proxy request');
              }
            });
          },
        },
      },
    },
    preview: {
      host: true, // allow all hosts to access the preview server
      allowedHosts: [
        'localhost',
        '.azurecontainerapps.io', // allow all Azure Container Apps subdomains
        'merchstorefrontend.agreeabledesert-a7938720.swedencentral.azurecontainerapps.io',
      ],
      proxy: {
        '/api-proxy': {
          target: env.VITE_JIN_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-proxy/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const apiKey = env.VITE_JIN_API_KEY;
              if (apiKey) {
                proxyReq.setHeader('X-API-KEY', apiKey);
              } else {
                console.error('No API key found for proxy request');
              }
            });
          },
        },
      },
    },
  };
});
