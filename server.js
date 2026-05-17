const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 3000;

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function headersFor(filePath) {
  const headers = {
    'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
  };

  if (filePath.endsWith('.html')) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    headers.Pragma = 'no-cache';
    headers.Expires = '0';
  }

  return headers;
}

function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const requested = cleanPath === '/' ? '/index.html' : cleanPath;
  const resolved = path.resolve(root, '.' + requested);

  if (!resolved.startsWith(root)) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  const filePath = resolveRequestPath(req.url || '/');
  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, body) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, headersFor(filePath));
    res.end(body);
  });
});

server.listen(port, () => {
  console.log(`AutomateSEO landing serving on port ${port}`);
});
