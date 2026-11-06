import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  // Archivos con hash (main-XXXX.js, styles-XXXX.css): inmutables, 1 año.
  // HTML: siempre se revalida (ETag) para que un nuevo despliegue se vea al instante.
  // Resto (assets sin hash, como los .glb o las imágenes): 7 días.
  server.get('**', express.static(browserDistFolder, {
    index: 'index.html',
    setHeaders: (res, filePath) => {
      if (/[-.][A-Z0-9]{8}\.(js|css)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
    },
  }));

  // Caché en memoria del HTML renderizado: la página es estática, así que se
  // renderiza una vez y se sirve desde memoria durante 10 minutos.
  const TTL_MS = 10 * 60 * 1000;
  const MAX_ENTRADAS = 20;
  const cacheHtml = new Map<string, { html: string; expira: number }>();

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    const cabecera = 'public, max-age=60, stale-while-revalidate=600';

    const guardado = cacheHtml.get(originalUrl);
    if (guardado && guardado.expira > Date.now()) {
      res.setHeader('Cache-Control', cabecera);
      res.send(guardado.html);
      return;
    }

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => {
        if (cacheHtml.size >= MAX_ENTRADAS) {
          cacheHtml.delete(cacheHtml.keys().next().value as string);
        }
        cacheHtml.set(originalUrl, { html, expira: Date.now() + TTL_MS });
        res.setHeader('Cache-Control', cabecera);
        res.send(html);
      })
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
