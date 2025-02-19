import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  base: './',
  build: {
    assets: 'assets'
  },
  vite: {
    base: './',
    build: {
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    }
  },
  server: {
    port: 4321,
    host: true
  }
});