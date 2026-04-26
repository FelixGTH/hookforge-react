import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      'hook-forge': resolve(__dirname, '../packages/hooks/src/index.ts'),
    },
  },
});
