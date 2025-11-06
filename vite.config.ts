import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  // Check if we're building the demo (via command line arg or env var)
  const isDemoBuild = process.env.BUILD_DEMO === 'true' || process.argv.includes('--demo');

  if (isDemoBuild) {
    // Demo build configuration
    return {
      root: 'demo',
      build: {
        outDir: '../demo-dist',
        emptyOutDir: true,
        rollupOptions: {
          input: resolve(__dirname, 'demo/index.html')
        }
      },
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src')
        }
      }
    };
  }

  // Library build configuration (default)
  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'Stylizer',
        formats: ['es', 'umd'],
        fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`
      },
      sourcemap: true,
      minify: 'esbuild'
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    }
  };
});

