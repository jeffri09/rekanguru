// ============================================================
// AI Service — Gemini & Qwen API Integration
// ============================================================

import { state } from '../state.js';
import { sleep } from '../utils/helpers.js';

// Rate limiting state
let lastRequestTime = 0;

/**
 * Enforce rate limiting
 */
async function rateLimit(provider = 'gemini') {
  // Gemini (20 RPM) needs ~4.5s delay. Qwen (600 RPM) is safe with 500ms delay.
  const minInterval = provider === 'qwen' ? 500 : 4500;
  
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < minInterval) {
    await sleep(minInterval - elapsed);
  }
  lastRequestTime = Date.now();
}

/**
 * Call Gemini API
 */
async function callGemini(prompt, maxRetries = 2) {
  const apiKey = state.get('settings.geminiKey');
  const model = state.get('settings.geminiModel') || 'gemini-3.1-flash-lite-preview';

  if (!apiKey) throw new Error('Gemini API key tidak ditemukan. Masukkan di Pengaturan.');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await rateLimit('gemini');

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 8192,
            temperature: 1.0,
            topP: 0.95,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429) {
          // Rate limited — wait and retry
          console.warn(`Gemini rate limited (attempt ${attempt + 1}), waiting...`);
          await sleep(10000 * (attempt + 1));
          continue;
        }
        throw new Error(err.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      throw new Error('Tidak ada respons dari Gemini API.');
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.warn(`Retry ${attempt + 1}:`, err.message);
      await sleep(3000 * (attempt + 1));
    }
  }
}

/**
 * Call Qwen API (via Vite proxy to avoid CORS)
 */
async function callQwen(prompt, maxRetries = 2) {
  const apiKey = state.get('settings.qwenKey');
  const model = state.get('settings.qwenModel') || 'qwen-plus';

  if (!apiKey) throw new Error('Qwen API key tidak ditemukan. Masukkan di Pengaturan.');

  // Use proxy in dev, direct URL otherwise
  const url = '/api/qwen/chat/completions';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await rateLimit('qwen');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'Kamu adalah penulis buku profesional dan berpengalaman. Selalu ikuti instruksi dengan tepat dan berikan output yang lengkap dan berkualitas tinggi.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 8192,
          temperature: 0.7,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429) {
          console.warn(`Qwen rate limited (attempt ${attempt + 1}), waiting...`);
          await sleep(10000 * (attempt + 1));
          continue;
        }
        throw new Error(err.error?.message || `Qwen API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices?.[0]?.message?.content) {
        return data.choices[0].message.content;
      }

      throw new Error('Tidak ada respons dari Qwen API.');
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.warn(`Retry ${attempt + 1}:`, err.message);
      await sleep(3000 * (attempt + 1));
    }
  }
}

/**
 * Main AI call — routes to the active provider
 */
export async function generateText(prompt) {
  const provider = state.get('settings.apiProvider');

  if (provider === 'qwen') {
    return callQwen(prompt);
  }
  return callGemini(prompt);
}

/**
 * Test API connection
 */
export async function testConnection(provider) {
  const testPrompt = 'Katakan "Koneksi berhasil!" dalam satu kalimat singkat.';

  try {
    if (provider === 'qwen') {
      return await callQwen(testPrompt, 0);
    }
    return await callGemini(testPrompt, 0);
  } catch (err) {
    throw new Error(`Gagal terhubung ke ${provider === 'qwen' ? 'Qwen' : 'Gemini'}: ${err.message}`);
  }
}

/**
 * Parse JSON from AI response (handles markdown code blocks)
 */
export function parseJsonResponse(text) {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try to find JSON in the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        throw new Error('Gagal parsing respons AI sebagai JSON. Coba generate ulang.');
      }
    }
    throw new Error('Respons AI bukan format JSON yang valid. Coba generate ulang.');
  }
}
