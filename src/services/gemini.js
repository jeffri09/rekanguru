// ============================================================
// AI Service — Gemini & Qwen API Integration
// Strategy: Server proxy first → user's own key as fallback
// ============================================================

import { state } from '../state.js';
import { sleep, showToast } from '../utils/helpers.js';

// Rate limiting state
let lastRequestTime = 0;
let serverKeyExhausted = false; // track if server key hit limit

/**
 * Enforce rate limiting
 */
async function rateLimit(provider = 'gemini') {
  const minInterval = provider === 'qwen' ? 500 : 4500;
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < minInterval) {
    await sleep(minInterval - elapsed);
  }
  lastRequestTime = Date.now();
}

/**
 * Call Gemini via Vercel Server Proxy (default key on server)
 * Returns { text, useOwnKey } or throws error
 */
async function callGeminiProxy(prompt, maxRetries = 2) {
  const model = state.get('settings.geminiModel') || 'gemini-3.1-flash-lite-preview';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model }),
    });

    const data = await response.json();

    if (data.useOwnKey) {
      serverKeyExhausted = true;
      throw new Error(data.error || 'Server key limit reached');
    }

    // Rate limited — auto-retry after wait
    if (data.rateLimited && data.retryAfter) {
      if (attempt < maxRetries) {
        const waitSec = Math.min(data.retryAfter, 30);
        showToast(`⏳ Server sibuk, menunggu ${waitSec} detik...`, 'info', waitSec * 1000);
        await sleep(waitSec * 1000);
        continue;
      }
      throw new Error(data.error);
    }

    if (!response.ok) {
      throw new Error(data.error || `Proxy error: ${response.status}`);
    }

    return data.text;
  }
}

/**
 * Call Gemini API directly with user's own key
 */
async function callGeminiDirect(prompt, maxRetries = 2) {
  const apiKey = state.get('settings.geminiKey');
  const model = state.get('settings.geminiModel') || 'gemini-3.1-flash-lite-preview';

  if (!apiKey) {
    showApiKeyGuide();
    throw new Error('API key diperlukan. Lihat petunjuk di layar.');
  }

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
            maxOutputTokens: 12000,
            temperature: 0.7,
            topP: 0.9,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429) {
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
 * Main Gemini call — tries server proxy first, then user's own key
 */
async function callGemini(prompt) {
  const userKey = state.get('settings.geminiKey')?.trim();

  // If user has their own key, use it directly (faster, no proxy)
  if (userKey) {
    return callGeminiDirect(prompt);
  }

  // If server key was previously exhausted, go straight to asking for key
  if (serverKeyExhausted) {
    showApiKeyGuide();
    throw new Error('Kuota harian habis. Masukkan API key Anda sendiri di ⚙️ Settings.');
  }

  // Try server proxy first
  try {
    return await callGeminiProxy(prompt);
  } catch (proxyErr) {
    console.warn('Server proxy failed:', proxyErr.message);

    // If server key exhausted, show guide
    if (serverKeyExhausted) {
      showApiKeyGuide();
      throw new Error('Kuota server habis. Masukkan API key Anda sendiri (gratis) di ⚙️ Settings. Lihat petunjuk di layar.');
    }

    // Other proxy errors (e.g., network) — also ask for key
    throw proxyErr;
  }
}

/**
 * Show API key guide notification
 */
function showApiKeyGuide() {
  // Only show once per session
  if (window._apiKeyGuideShown) return;
  window._apiKeyGuideShown = true;

  showToast(
    '🔑 Kuota harian server habis! Dapatkan API key gratis di aistudio.google.com/apikey lalu masukkan di ⚙️ Settings.',
    'warning',
    15000
  );

  // Show a more detailed modal guide
  setTimeout(() => {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
      const body = document.getElementById('modal-body');
      const header = document.getElementById('modal-header');
      const footer = document.getElementById('modal-footer');

      header.innerHTML = '<h3>🔑 Cara Mendapatkan API Key (Gratis)</h3>';
      body.innerHTML = `
        <div style="line-height: 1.8; font-size: 0.9rem;">
          <p style="margin-bottom: 12px;">Kuota harian server telah habis. Anda bisa mendapatkan API key <strong>gratis</strong> dari Google dalam 2 menit:</p>

          <ol style="padding-left: 20px;">
            <li style="margin-bottom: 8px;">
              Buka <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" style="color: #8b5cf6; font-weight: 600;">aistudio.google.com/apikey</a>
            </li>
            <li style="margin-bottom: 8px;">Login dengan akun Google Anda</li>
            <li style="margin-bottom: 8px;">Klik <strong>"Create API Key"</strong></li>
            <li style="margin-bottom: 8px;">Copy API key yang muncul</li>
            <li style="margin-bottom: 8px;">Kembali ke aplikasi ini → klik <strong>⚙️</strong> di header → paste key</li>
          </ol>

          <div style="background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); border-radius: 8px; padding: 12px; margin-top: 12px;">
            <strong>💡 Info:</strong> API key Google AI Studio gratis untuk penggunaan wajar (hingga 1500 request/hari). Tidak perlu kartu kredit.
          </div>
        </div>
      `;
      footer.innerHTML = `
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" class="btn btn-primary">
          🔗 Buka Google AI Studio
        </a>
        <button class="btn btn-ghost" onclick="document.getElementById('modal-overlay').classList.add('hidden')">Tutup</button>
      `;
      modal.classList.remove('hidden');
    }
  }, 500);
}

/**
 * Call Qwen API (via Vite proxy to avoid CORS)
 */
async function callQwen(prompt, maxRetries = 2) {
  const apiKey = state.get('settings.qwenKey');
  const model = state.get('settings.qwenModel') || 'qwen-plus';

  if (!apiKey) throw new Error('Qwen API key tidak ditemukan. Masukkan di ⚙️ Settings.');

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
          model,
          messages: [
            { role: 'system', content: 'Kamu adalah penulis profesional. Ikuti instruksi dengan tepat.' },
            { role: 'user', content: prompt },
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
    // For test, use direct call if user has key
    const userKey = state.get('settings.geminiKey')?.trim();
    if (userKey) {
      return await callGeminiDirect(testPrompt, 0);
    }
    return await callGeminiProxy(testPrompt);
  } catch (err) {
    throw new Error(`Gagal terhubung ke ${provider === 'qwen' ? 'Qwen' : 'Gemini'}: ${err.message}`);
  }
}

/**
 * Parse JSON from AI response (handles markdown code blocks)
 */
export function parseJsonResponse(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
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
