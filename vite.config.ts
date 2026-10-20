import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

import fs from 'fs';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'serve-shell-scripts',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const urlPath = req.url ? req.url.split('?')[0] : '';
            if (urlPath === '/install.sh' || urlPath === '/setup.sh') {
              const filePath = path.join(__dirname, 'public', urlPath);
              if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'text/x-shellscript; charset=utf-8');
                return fs.createReadStream(filePath).pipe(res);
              }
            }
            if (urlPath.endsWith('.tar.gz') || urlPath.endsWith('.zip')) {
              const filePath = path.join(__dirname, 'public', urlPath);
              if (fs.existsSync(filePath)) {
                const stat = fs.statSync(filePath);
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/octet-stream');
                return fs.createReadStream(filePath).pipe(res);
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
