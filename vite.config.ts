import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, 'config/env', '');
  
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env.API_URL': JSON.stringify(env.API_URL),
      'process.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
      'process.env.WORKER_POOL_SIZE': env.WORKER_POOL_SIZE || 4,
    },
    worker: {
      format: 'es',
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            redux: ['@reduxjs/toolkit', 'react-redux'],
            visualization: ['recharts', 'd3', 'three', '@react-three/fiber', '@react-three/drei'],
          },
        },
      },
    },
  }
})