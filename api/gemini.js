// ============================================================
// Vercel Serverless Function — Gemini API Proxy
// Delay 5 detik antar request → max 12 RPM (aman di bawah 15)
// ============================================================

// Timestamp request terakhir (shared dalam warm instance)
let lastRequestTime = 0;
const MIN_DELAY_MS = 5000; // 5 detik antar request

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server API key not configured', useOwnKey: true });
  }

  try {
    const { prompt, model } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    // Enforce 5 second delay between requests
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < MIN_DELAY_MS) {
      const waitMs = MIN_DELAY_MS - elapsed;
      await sleep(waitMs);
    }
    lastRequestTime = Date.now();

    const geminiModel = model || 'gemini-3.1-flash-lite-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 12000,
        },
      }),
    });

    const data = await response.json();

    if (response.status === 429) {
      return res.status(429).json({
        error: 'Gemini API rate limit. Coba lagi nanti atau gunakan API key sendiri.',
        rateLimited: true,
        retryAfter: 10,
      });
    }

    if (response.status === 403) {
      return res.status(429).json({
        error: 'Kuota harian server habis. Gunakan API key Anda sendiri.',
        useOwnKey: true,
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Gemini API error',
        useOwnKey: response.status === 401,
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(500).json({ error: 'No response from Gemini' });

    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
