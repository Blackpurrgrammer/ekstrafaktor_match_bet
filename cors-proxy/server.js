const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

app.use('/api', createProxyMiddleware({
  target: 'https://v3.football.api-sports.io',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('x-rapidapi-key', '436ccf9b5092f9960ceb89cfa9ac53fe');
    proxyReq.setHeader('x-rapidapi-host', 'v3.football.api-sports.io');
  }
}));

app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on port ${PORT}`);
});
