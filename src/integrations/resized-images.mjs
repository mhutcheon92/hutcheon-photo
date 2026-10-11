// Serves and builds the /_img/w<width>/images/… copies that
// src/lib/resized-images.js puts in srcsets.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseVariantUrl, resizeImage, contentType } from '../lib/resized-images.js';

const URL_RE = /\/_img\/w\d+\/images\/[^\s"'<>,?#]+/g;

export default function resizedImages() {
  return {
    name: 'resized-images',
    hooks: {
      // Dev: resize on request, cached for the life of the server.
      'astro:config:setup': ({ command, updateConfig }) => {
        if (command !== 'dev') return;
        const cache = new Map();
        updateConfig({
          vite: {
            plugins: [{
              name: 'resized-images-dev',
              configureServer(server) {
                server.middlewares.use(async (req, res, next) => {
                  const v = parseVariantUrl((req.url ?? '').split('?')[0]);
                  if (!v) return next();
                  try {
                    const key = `${v.width}${v.src}`;
                    if (!cache.has(key)) cache.set(key, resizeImage(v.src, v.width));
                    const buf = await cache.get(key);
                    res.setHeader('Content-Type', contentType(v.src));
                    res.end(buf);
                  } catch {
                    next();
                  }
                });
              },
            }],
          },
        });
      },

      // Build: write every resized copy the generated pages reference.
      'astro:build:generated': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const files = (await fs.readdir(out, { recursive: true }))
          .filter((f) => f.endsWith('.html'));

        const urls = new Set();
        for (const f of files) {
          const html = await fs.readFile(path.join(out, f), 'utf8');
          for (const m of html.matchAll(URL_RE)) urls.add(m[0]);
        }

        let count = 0;
        for (const url of urls) {
          const v = parseVariantUrl(url);
          if (!v) continue;
          const dest = path.join(out, decodeURI(url));
          await fs.mkdir(path.dirname(dest), { recursive: true });
          await fs.writeFile(dest, await resizeImage(v.src, v.width));
          count++;
        }
        logger.info(`${count} resized images written`);
      },
    },
  };
}
