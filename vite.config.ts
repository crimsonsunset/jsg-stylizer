import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import preact from '@preact/preset-vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  // Check if we're building or serving the demo
  const isDemoMode = process.env.BUILD_DEMO === 'true' || 
                     process.env.DEMO_MODE === 'true' ||
                     process.argv.includes('--demo');

  // Load env vars from project root (where vite.config.ts is located)
  // loadEnv looks for .env files relative to the root parameter
  // Empty prefix '' means load all env vars, but Vite only exposes VITE_ prefixed vars to client
  const env = loadEnv(mode, resolve(__dirname), '');

  if (isDemoMode) {
    // Demo build/dev server configuration
    return {
      plugins: [preact()],
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
        alias: [
          {
            find: '@',
            replacement: resolve(__dirname, 'src')
          },
          {
            find: 'react',
            replacement: 'preact/compat'
          },
          {
            find: 'react-dom',
            replacement: 'preact/compat'
          }
        ]
      },
      define: {
        // Explicitly define env vars for client access
        // Vite automatically exposes VITE_ prefixed vars, but we define it explicitly to ensure it's available
        'import.meta.env.VITE_GOOGLE_FONTS_API_KEY': JSON.stringify(env.VITE_GOOGLE_FONTS_API_KEY || ''),
        'import.meta.env.PUBLIC_GOOGLE_FONTS_API_KEY': JSON.stringify(env.PUBLIC_GOOGLE_FONTS_API_KEY || '')
      }
    };
  }

  // Library build configuration (default)
  return {
    plugins: [
      preact(),
      visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap'
      })
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'Stylizer',
        formats: ['es'],
        fileName: () => 'index.esm.js'
      },
      cssCodeSplit: false,
      cssMinify: true,
      sourcemap: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          manualChunks: undefined,
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') {
              return 'style.css';
            }
            return assetInfo.name || 'asset';
          }
        },
        external: ['@crimsonsunset/jsg-logger']
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        'react': 'preact/compat',
        'react-dom': 'preact/compat'
      }
    }
  };
});

