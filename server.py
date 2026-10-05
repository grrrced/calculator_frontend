"""Tiny static file server for local frontend development and deployment."""

import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

if __name__ == "__main__":
    host = os.environ.get("FRONTEND_HOST", "127.0.0.1")
    port = int(os.environ.get("FRONTEND_PORT", "5500"))
    print(f"Calculator frontend listening at http://{host}:{port}")
    ThreadingHTTPServer((host, port), SimpleHTTPRequestHandler).serve_forever()
