const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const port = process.env.PORT || 4282;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://localhost:${port}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = path
    .normalize(decodeURIComponent(requestedPath))
    .replace(/^[/\\]+/, "")
    .replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(content);
  });
});

server.listen(port, () => {
  console.log(`Dog Pattern AI running at http://localhost:${port}`);
});
