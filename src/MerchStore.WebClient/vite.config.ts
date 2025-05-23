import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Ladda miljövariabler
  const env = loadEnv(mode, process.cwd(), '');

  // Debug loggning
  console.log('🔧 Vite config loading...');
  console.log('  Mode:', mode);
  console.log('  VITE_JIN_API_URL:', env.VITE_JIN_API_URL ? '***set***' : 'MISSING');
  console.log('  VITE_JIN_API_KEY:', env.VITE_JIN_API_KEY ? '***set***' : 'MISSING');

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
                console.log('🔑 Adding API key to proxy request');
              } else {
                console.error('❌ No API key found for proxy request');
              }
            });
          },
        },
      },
    },
    preview: {
      host: true, // Tillåt alla hosts
      allowedHosts: [
        'localhost',
        '.azurecontainerapps.io', // Tillåt alla Azure Container Apps domäner
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
                console.log('🔑 Adding API key to proxy request');
              } else {
                console.error('❌ No API key found for proxy request');
              }
            });
          },
        },
      },
    },
  };
});
