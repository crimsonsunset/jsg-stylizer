import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  // Check if we're building or serving the demo
  const isDemoMode = process.env.BUILD_DEMO === 'true' || 
                     process.env.DEMO_MODE === 'true' ||
                     process.argv.includes('--demo');

  // Load env vars from project root (where vite.config.ts is located)
  // loadEnv looks for .env files relative to the root parameter
  const env = loadEnv(mode, resolve(__dirname), '');

  if (isDemoMode) {
    // Demo build/dev server configuration
    return {
      root: 'demo',
      envDir: resolve(__dirname), // Look for .env in project root, not demo directory
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
      },
      define: {
        // Explicitly define env vars for client access
        'import.meta.env.VITE_GOOGLE_FONTS_API_KEY': JSON.stringify(env.VITE_GOOGLE_FONTS_API_KEY || '')
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

