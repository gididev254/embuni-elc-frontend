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
  // Load environment variables with priority
  let env = {};
  
  // 1. Base .env file
  const baseEnv = loadEnv('', process.cwd(), '');
  env = { ...baseEnv };
  
  // 2. Mode-specific env (e.g., .env.production, .env.development)
  const modeEnv = loadEnv(mode, process.cwd(), '');
  env = { ...env, ...modeEnv };
  
  // 3. .env.deployment (highest priority)
  if (mode === 'production') {
    const deploymentEnv = parseEnvFile(path.resolve(process.cwd(), '.env.deployment'));
    env = { ...env, ...deploymentEnv };
  }

  // Apply to process.env for Vite to use
  Object.assign(process.env, env);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        // Ensure single instance of React is used
        'react': path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
        '@': path.resolve(__dirname, './src'),
      },
      // Add .jsx to the list of extensions to resolve
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    optimizeDeps: {
      // Ensure Vite pre-bundles these dependencies
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        '@sentry/react',
        '@sentry/tracing'
      ],
      // Force dependency pre-bundling, ignoring browser field
      esbuildOptions: {
        target: 'es2020',
        supported: { 
          'top-level-await': true
        }
      }
    },
    build: {
      sourcemap: true, // Enable source maps for better error tracking
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          pure_funcs: ['console.log']
        },
        format: {
          comments: false
        },
        mangle: true
      },
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor chunks
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['axios', 'date-fns', 'i18next'],
            sentry: ['@sentry/react', '@sentry/tracing']
          }
        },
        onwarn(warning, warn) {
          // Ignore circular dependency warnings for now
          if (warning.code === 'CIRCULAR_DEPENDENCY') {
            return;
          }
          warn(warning);
        }
      }
    },
    server: {
      port: 3000,
      open: true,
      fs: {
        // Allow serving files from one level up from the package root
        allow: ['..']
      }
    },
    define: {
      'process.env': {}
    }
  };
});