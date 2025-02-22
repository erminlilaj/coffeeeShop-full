import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'server',
  adapter: node({
    mode: 'production', // Explicitly setting the mode for the node adapter
    middleware: 'src/middleware.ts', // Ensure middleware is defined here
  }),
  base: './',
  build: {
    assets: 'assets',
  },
  vite: {
    base: './',
    build: {
      rollupOptions: {
        output: {
          format: 'es',
        },
      },
    },
  },
  server: {
    port: 4321,
    host: true,
  },
});
