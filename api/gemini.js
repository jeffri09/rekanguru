// ============================================================
// Vercel Serverless Function — Gemini API Proxy
// Rate limited to 15 RPM (Gemini free tier limit)
// ============================================================

// In-memory rate limiter (shared across warm instances)
const requestLog = [];
const MAX_RPM = 14; // safety margin under 15 RPM limit
const WINDOW_MS = 60 * 1000; // 1 minute window

function isRateLimited() {
  const now = Date.now();
  // Remove entries older than 1 minute
  while (requestLog.length > 0 && requestLog[0] < now - WINDOW_MS) {
    requestLog.shift();
  }
  return requestLog.length >= MAX_RPM;
}

function logRequest() {
  requestLog.push(Date.now());
}

function getWaitTime() {
  if (requestLog.length === 0) return 0;
  const oldestInWindow = requestLog[0];
  const waitMs = (oldestInWindow + WINDOW_MS) - Date.now();
  return Math.max(0, Math.ceil(waitMs / 1000));
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

  // Check rate limit
  if (isRateLimited()) {
    const waitSec = getWaitTime();
    return res.status(429).json({
      error: `Server sedang sibuk (${MAX_RPM} request/menit). Coba lagi dalam ${waitSec} detik, atau gunakan API key sendiri.`,
      useOwnKey: false,
      retryAfter: waitSec,
      rateLimited: true,
    });
  }

  try {
    const { prompt, model } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const geminiModel = model || 'gemini-3.1-flash-lite-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    // Log this request BEFORE sending (to prevent race conditions)
    logRequest();

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

    // Gemini's own rate limit or quota exhausted
    if (response.status === 429) {
      return res.status(429).json({
        error: 'Gemini API rate limit tercapai. Coba lagi nanti atau gunakan API key sendiri.',
        useOwnKey: false,
        retryAfter: 60,
        rateLimited: true,
      });
    }

    if (response.status === 403) {
      return res.status(429).json({
        error: 'Kuota harian API key server habis. Silakan gunakan API key Anda sendiri.',
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

    // Return remaining quota info
    const remaining = MAX_RPM - requestLog.length;
    return res.status(200).json({ text, remaining });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
