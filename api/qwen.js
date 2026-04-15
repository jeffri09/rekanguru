// ============================================================
// Vercel Serverless Function — Qwen (DashScope) API Proxy
// Region: Southeast Asia (Singapore) — dashscope-intl
// Strategy: Server key first → user key fallback
// ============================================================

let lastRequestTime = 0;
const MIN_DELAY_MS = 1000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, model, userApiKey } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    // Determine which API key to use: server env or user-provided
    const serverKey = process.env.QWEN_API_KEY;
    const apiKey = userApiKey || serverKey;

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Qwen API key tidak tersedia. Masukkan key Anda di ⚙️ Settings.', 
        useOwnKey: true 
      });
    }

    // Rate limiting
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < MIN_DELAY_MS) {
      await sleep(MIN_DELAY_MS - elapsed);
    }
    lastRequestTime = Date.now();

    const qwenModel = model || 'qvq-max-2025-03-25';

    // DashScope International (Singapore/Southeast Asia) endpoint
    const url = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';

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
      return res.status(429).json({
        error: 'Qwen API rate limit. Coba lagi nanti.',
        rateLimited: true,
        retryAfter: 10,
      });
    }

    if (response.status === 403) {
      return res.status(429).json({
        error: 'Kuota Qwen habis. Gunakan API key Anda sendiri.',
        useOwnKey: true,
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || `Qwen API error: ${response.status}`,
        useOwnKey: response.status === 401,
      });
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response from Qwen' });

    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
