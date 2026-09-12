import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import analyzeHandler from './api/analyze.js';
import startHandler from './api/interview/start.js';
import answerHandler from './api/interview/answer.js';
import codingHandler from './api/interview/coding.js';
import finalHandler from './api/interview/final.js';

// Local API middleware plugin for seamless dev testing
function apiServerPlugin() {
  return {
    name: 'api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) return next();

        // Polyfill express/vercel style helper methods
        let body = {};
        if (req.method === 'POST') {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const raw = Buffer.concat(buffers).toString();
          try {
            body = JSON.parse(raw);
          } catch (e) {
            body = {};
          }
        }
        req.body = body;

        res.status = (code) => {
          res.statusCode = code;
          return res;
        };

        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };

        const url = req.url.split('?')[0];

        try {
          if (url === '/api/analyze') {
            return await analyzeHandler(req, res);
          } else if (url === '/api/interview/start') {
            return await startHandler(req, res);
          } else if (url === '/api/interview/answer') {
            return await answerHandler(req, res);
          } else if (url === '/api/interview/coding') {
            return await codingHandler(req, res);
          } else if (url === '/api/interview/final') {
            return await finalHandler(req, res);
          }
        } catch (err) {
          console.error('Local API Handler Error:', err);
          return res.status(500).json({ error: err.message || 'Internal API Error' });
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiServerPlugin()],
  server: {
    port: 3000,
    open: false,
  },
});
