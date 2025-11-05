import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Stylizer',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: ['@crimsonsunset/jsg-logger'],
      output: {
        globals: {
          '@crimsonsunset/jsg-logger': 'JSGLogger'
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild'
  },
  optimizeDeps: {
    // Exclude logger and devtools from dep optimization to avoid import issues
    exclude: [
      '@crimsonsunset/jsg-logger',
      '@crimsonsunset/jsg-logger/devtools'
    ]
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    // Preserve symlinks for npm link to work correctly
    preserveSymlinks: true
  },
  server: {
    fs: {
      // Allow serving files from parent directories and linked packages
      allow: ['..', '../..']
    }
  }
});

