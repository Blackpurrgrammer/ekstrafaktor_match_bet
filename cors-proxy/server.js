//0f534c7fb965f8983d9160d34499a2ff
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Configure CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-rapidapi-key, x-rapidapi-host',
  credentials: true
}));

// Proxy middleware for multiple endpoints
app.use('/api', createProxyMiddleware({
  target: 'https://v3.football.api-sports.io',
  changeOrigin: true,

  // Rewrite path for specific API routes
  pathRewrite: (path, req) => {
    if (path.startsWith('/api/injuries')) {
      return path.replace('/api/injuries', '/injuries');
    } else if (path.startsWith('/api/fixtures')) {
      return path.replace('/api/fixtures', '/fixtures');
    }
    return path.replace('/api', ''); // Default rewrite
  },

  // Modify headers before forwarding request
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('x-rapidapi-key', '0f534c7fb965f8983d9160d34499a2ff'); // Set your API key
    proxyReq.setHeader('x-rapidapi-host', 'v3.football.api-sports.io');
    proxyReq.setHeader('Cache-Control', 'no-cache'); // Disable caching
  },

  // Forward headers and handle rate-limiting response
  onProxyRes: (proxyRes, req, res) => {
    // Disable caching by setting headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1
    res.setHeader('Pragma', 'no-cache'); // HTTP 1.0
    res.setHeader('Expires', '0'); // Proxies
    // Expose rate-limit headers so the frontend can access them
    res.setHeader('Access-Control-Expose-Headers', 'X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After');
    

    // Copy rate-limit headers from the response to the proxy response
    const rateLimitLimit = proxyRes.headers['x-ratelimit-limit'];
    const rateLimitRemaining = proxyRes.headers['x-ratelimit-remaining'];
    const retryAfter = proxyRes.headers['retry-after'];

    // disable caching for specific responses
    if (rateLimitLimit) {
      console.log('Rate Limit:', rateLimitLimit);
      res.setHeader('Access-Control-Expose-Headers', 'X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After');
      res.setHeader('X-RateLimit-Limit', rateLimitLimit);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      
    }
    if (rateLimitRemaining) {
      console.log('Rate Limit Remaining:', rateLimitRemaining);
      res.setHeader('Access-Control-Expose-Headers', 'X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After');
      res.setHeader('X-RateLimit-Remaining', rateLimitRemaining);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    }
    if (retryAfter) {
      console.log('Retry-After:', retryAfter);
      res.setHeader('Access-Control-Expose-Headers', 'X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After');
      res.setHeader('Retry-After', retryAfter);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    // Log rate-limit headers for debugging
    console.log('Rate Limit:', rateLimitLimit);
    console.log('Rate Limit Remaining:', rateLimitRemaining);
    console.log('Retry-After:', retryAfter);

    // Handle 429 Too Many Requests response
    if (proxyRes.statusCode === 429) {
      res.status(429).json({
        message: 'Rate limit exceeded. Please wait before making more requests.',
        retryAfter: retryAfter || 'Unknown'
      });
    }
  },

  // Error handling for proxy requests
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Internal Server Error - Proxy Failed' });
  }
}));

// Start the server
app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on port ${PORT}`);
});
