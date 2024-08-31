const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Configure CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'], // Allow requests from these origins
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-rapidapi-key, x-rapidapi-host',
  credentials: true
}));

// Proxy middleware for multiple endpoints
app.use('/api', createProxyMiddleware({
  target: 'https://v3.football.api-sports.io',
  changeOrigin: true,
  pathRewrite: (path, req) => {
    console.log(`Original path: ${path}`); // Debugging log
    if (path.startsWith('/api/injuries')) {
      const newPath = path.replace('/api/injuries', '/injuries');
      console.log(`Rewritten path for injuries: ${newPath}`); // Debugging log
      return newPath;
    } else if (path.startsWith('/api/fixtures')) {
      const newPath = path.replace('/api/fixtures', '/fixtures');
      console.log(`Rewritten path for fixtures: ${newPath}`); // Debugging log
      return newPath;
    }
    const newPath = path.replace('/api', ''); // Default rewrite
    console.log(`Rewritten default path: ${newPath}`); // Debugging log
    return newPath;
  },
  onProxyReq: (proxyReq, req, res) => {
    const targetUrl = new URL(req.url, 'https://v3.football.api-sports.io');
    console.log(`Proxying request to: ${targetUrl.href}`);
    proxyReq.setHeader('x-rapidapi-key', '0f534c7fb965f8983d9160d34499a2ff');
    proxyReq.setHeader('x-rapidapi-host', 'v3.football.api-sports.io');
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  }
}));

// Start the server
app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on port ${PORT}`);
});