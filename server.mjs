// @ts-nocheck
import { createReadStream, promises as fs } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, process.env.STATIC_DIR || 'dist');
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 4321);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^([/\\])+/, '');
  const candidate = path.resolve(rootDir, normalized);
  return candidate === rootDir || candidate.startsWith(`${rootDir}${path.sep}`) ? candidate : null;
}

async function findFile(urlPath) {
  const requested = safePath(urlPath);
  if (!requested) return null;
  try {
    const stat = await fs.stat(requested);
    if (stat.isFile()) return requested;
    if (stat.isDirectory()) {
      const index = path.join(requested, 'index.html');
      await fs.access(index);
      return index;
    }
  } catch {}

  // Astro's directory output has an index.html for each route. The root
  // fallback keeps direct navigation resilient when a proxy strips a slash.
  const routeIndex = path.join(requested, 'index.html');
  try { await fs.access(routeIndex); return routeIndex; } catch {}
  return path.extname(requested) ? null : path.join(rootDir, 'index.html');
}

const server = createServer(async (request, response) => {
  try {
    const file = await findFile(request.url || '/');
    if (!file) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    const contentType = mimeTypes[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const cacheControl = file.includes(`${path.sep}_astro${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache';
    response.writeHead(200, {
      'Cache-Control': cacheControl,
      'Content-Type': contentType,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    });
    createReadStream(file).pipe(response);
  } catch (error) {
    console.error('Static server error', error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Internal server error');
  }
});

server.listen(port, host, () => console.log(`License Manager frontend listening on http://${host}:${port}`));
