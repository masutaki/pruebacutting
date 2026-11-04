import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ttf': 'font/ttf', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html'; }
  catch { res.writeHead(400); res.end('Bad request'); return; }
  const allowed = ['index.html', 'style.css', 'legacy.css', 'game.js', 'favicon.svg', 'LICENSE', 'THIRD_PARTY.md', 'THIRD_PARTY_LICENSES.txt', 'fonts/Inconsolata.ttf', 'fonts/OFL.txt'].includes(name) || /^(js|images)\/[A-Za-z0-9_ /,.-]+\.(js|png)$/.test(name);
  if (!allowed || name.split('/').includes('..')) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const data = await readFile(path.join(root, name));
    res.writeHead(200, { 'Content-Type': types[path.extname(name)], 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(500); res.end('Unable to read file'); }
});
const port = Number(process.env.PORT || 3000);
server.listen(port, process.env.HOST || '0.0.0.0', () => console.log(`Grassland: puerto ${port}`));
