import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { existsSync, readFileSync } from 'fs';

// Helper function to parse .env file
function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  
  const content = readFileSync(filePath, 'utf-8');
  const env = {};
  
  content.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) return;
    
    // Parse KEY=VALUE format
    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  });
  
  return env;
}

export default defineConfig(({ mode }) => {
  // Load environment variables with priority:
  // 1. .env.deployment (highest priority - for production)
  // 2. .env.[mode] (mode-specific, e.g., .env.production)
  // 3. .env (base file)
  
  let env = {};
  
  // Priority 3: Base .env file
  const baseEnv = loadEnv('', process.cwd(), '');
  env = { ...baseEnv };
  
  // Priority 2: Mode-specific env (e.g., .env.production, .env.development)
  const modeEnv = loadEnv(mode, process.cwd(), '');
  env = { ...env, ...modeEnv };
  
  // Priority 1: .env.deployment (highest priority - overrides everything)
  const deploymentEnv = parseEnvFile('.env.deployment');
  env = { ...env, ...deploymentEnv };
  
  // Apply to process.env for Vite to use
  Object.assign(process.env, env);
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // CSS configuration - PostCSS is now handled by postcss.config.js
    // Build optimizations for better performance
    build: {
      // Enable minification
      minify: 'terser',
      terserOptions: {
        compress: {
          // Keep console.error in production
          drop_console: false,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          // Disable hoisting to prevent TDZ issues
          hoist_vars: false,
          hoist_funs: false,
          // Keep function names for better error messages
          keep_fnames: true,
          // Keep class names for better error messages
          keep_classnames: true,
          // Disable some aggressive optimizations that might cause issues
          reduce_vars: false,
          unused: false
        },
        mangle: {
          // Keep function names for better error messages
          keep_fnames: true,
          // Keep class names for better error messages
          keep_classnames: true,
          // Disable property mangling to prevent issues
          properties: false
        },
        // Preserve function names for better error messages
        keep_classnames: true,
        keep_fnames: true,
        // Disable hoisting to prevent TDZ issues
        hoist_vars: false,
        hoist_funs: false,
      },
      mangle: {
        safari10: true,
      },
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      // Enable source maps for production debugging
      sourcemap: true,
      // Better error handling for production
      rollupOptions: {
        onwarn(warning, warn) {
          // Ignore circular dependency warnings for now
          if (warning.code === 'CIRCULAR_DEPENDENCY') {
            return;
          }
          warn(warning);
        }
      },
      // Generate manifest for PWA
      manifest: {
        name: 'University of Embu Equity Leaders Program',
        short_name: 'ELP Embu',
        description: 'Empowering next generation of leaders at University of Embu',
        theme_color: '#3B82F6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      // Target modern browsers for better optimization
      target: ['es2020', 'chrome80', 'firefox78', 'safari13'],
      // CSS code splitting
      cssCodeSplit: true,
      // Enable CSS minification
      cssMinify: true,
    },
    server: {
      port: 5173,
      // Proxy only used in development
      // In production, frontend uses VITE_API_URL from .env.deployment
      proxy: {
        '/api': {
          target: env.VITE_API_URL || process.env.VITE_API_URL || 'https://embuni-elc-backend.onrender.com',
          changeOrigin: true,
        }
      }
    },
    // Optimize dependencies pre-bundling
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
    // PWA Configuration
    serviceWorker: mode === 'production' ? 'dist/sw.js' : false,
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 // 24 hours
            }
          }
        }
      ]
    }
  };
});
