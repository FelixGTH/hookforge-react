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
      'hookforge-react': resolve(__dirname, '../packages/hooks/src/index.ts'),
    },
  },
});
