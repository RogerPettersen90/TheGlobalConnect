/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@theglobalconnect/db': path.resolve(__dirname, '../../packages/db'),
      '@theglobalconnect/ui': path.resolve(__dirname, '../../packages/ui'),
      '@theglobalconnect/config': path.resolve(__dirname, '../../packages/config'),
    },
  },
});