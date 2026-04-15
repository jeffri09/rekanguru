import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  plugins: [qwenDevProxy()],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
  },
});

/**
 * Vite plugin: handles /api/qwen in dev mode
 * Same logic as api/qwen.js serverless function
 */
function qwenDevProxy() {
  return {
    name: 'qwen-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/qwen', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          });
          return res.end();
        }

        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }

        // Parse request body
        let body = '';
        for await (const chunk of req) body += chunk;

        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        }

        const { prompt, model, userApiKey } = parsed;

        if (!prompt) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Prompt is required' }));
        }

        const apiKey = userApiKey || process.env.QWEN_API_KEY;
        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Qwen API key tidak tersedia.', useOwnKey: true }));
        }

        const qwenModel = model || 'qvq-max-2025-03-25';
        const url = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: qwenModel,
              messages: [
                { role: 'system', content: 'Kamu adalah penulis profesional. Ikuti instruksi dengan tepat.' },
                { role: 'user', content: prompt },
              ],
              max_tokens: 8192,
              temperature: 0.7,
              top_p: 0.9,
            }),
          });

          const data = await response.json();

          if (response.status === 429) {
            res.writeHead(429, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Qwen rate limit', rateLimited: true, retryAfter: 10 }));
          }

          if (!response.ok) {
            res.writeHead(response.status, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: data.error?.message || `Qwen API error: ${response.status}` }));
          }

          const text = data.choices?.[0]?.message?.content;
          if (!text) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'No response from Qwen' }));
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ text }));

        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}
