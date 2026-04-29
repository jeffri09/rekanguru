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
async function callGeminiProxy(prompt, maxRetries = 4) {
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
async function callGeminiDirect(prompt, maxRetries = 4) {
  const apiKey = state.get('settings.geminiKey');
  let model = state.get('settings.geminiModel') || 'gemini-3.1-flash-lite-preview';

  if (!apiKey) {
    showApiKeyGuide();
    throw new Error('API key diperlukan. Lihat petunjuk di layar.');
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await rateLimit('gemini');

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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

        // Rate limited — retry with backoff
        if (response.status === 429) {
          console.warn(`Gemini rate limited (attempt ${attempt + 1}), waiting...`);
          await sleep(10000 * (attempt + 1));
          continue;
        }

        // Model overloaded (503) — retry with backoff (like Python SDK tenacity)
        if (response.status === 503) {
          if (attempt < maxRetries) {
            const waitSec = Math.min(5 * (attempt + 1), 20);
            showToast(`⏳ Model sibuk, retry ${attempt + 1}/${maxRetries} (${waitSec}s)...`, 'info', waitSec * 1000);
            await sleep(waitSec * 1000);
            continue;
          }
          throw new Error('Model sedang sibuk (503). Coba ganti model di ⚙️ Settings atau coba lagi nanti.');
        }

        // Model not found (404) — auto-switch to stable fallback
        if (response.status === 404) {
          console.warn(`Model ${model} not found, switching to gemini-2.5-flash`);
          showToast('⚠️ Model tidak tersedia, beralih ke Gemini 2.5 Flash', 'warning');
          model = 'gemini-2.5-flash';
          state.set('settings.geminiModel', model);
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
 * Call Qwen via Vercel Server Proxy (same pattern as Gemini)
 * Server key from QWEN_API_KEY env, or user's own key as fallback
 */
let qwenServerKeyExhausted = false;

async function callQwenProxy(prompt, userApiKey, maxRetries = 2) {
  const model = state.get('settings.qwenModel') || 'qvq-max-2025-03-25';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch('/api/qwen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model, userApiKey: userApiKey || '' }),
    });

    const data = await response.json();

    if (data.useOwnKey) {
      qwenServerKeyExhausted = true;
      throw new Error(data.error || 'Server Qwen key not available');
    }

    if (data.rateLimited && data.retryAfter) {
      if (attempt < maxRetries) {
        const waitSec = Math.min(data.retryAfter, 30);
        showToast(`⏳ Qwen sibuk, menunggu ${waitSec} detik...`, 'info', waitSec * 1000);
        await sleep(waitSec * 1000);
        continue;
      }
      throw new Error(data.error);
    }

    if (!response.ok) {
      throw new Error(data.error || `Qwen proxy error: ${response.status}`);
    }

    return data.text;
  }
}

/**
 * Main Qwen call — tries server proxy with user key or server key
 */
async function callQwen(prompt, maxRetries = 2) {
  const userKey = state.get('settings.qwenKey')?.trim();

  await rateLimit('qwen');

  // Always go through proxy (handles CORS + correct endpoint)
  return callQwenProxy(prompt, userKey, maxRetries);
}

/**
 * Main AI call — routes to active provider
 * Auto-fallback hanya jika settings.autoFallback === true
 */
export async function generateText(prompt) {
  const provider = state.get('settings.apiProvider');
  const autoFallback = state.get('settings.autoFallback');

  if (provider === 'qwen') {
    try {
      return await callQwen(prompt);
    } catch (err) {
      if (autoFallback && state.get('settings.enableGemini')) {
        console.warn('Qwen gagal, fallback ke Gemini:', err.message);
        showToast('⚠️ Qwen gagal, mencoba Gemini...', 'info', 3000);
        try {
          return await callGemini(prompt);
        } catch (err2) {
          throw new Error(`Qwen: ${err.message} | Gemini fallback: ${err2.message}`);
        }
      }
      throw err;
    }
  }

  // Default: Gemini
  try {
    return await callGemini(prompt);
  } catch (err) {
    if (autoFallback && state.get('settings.enableQwen')) {
      console.warn('Gemini gagal, fallback ke Qwen:', err.message);
      showToast('⚠️ Gemini gagal, mencoba Qwen...', 'info', 3000);
      try {
        return await callQwen(prompt);
      } catch (err2) {
        throw new Error(`Gemini: ${err.message} | Qwen fallback: ${err2.message}`);
      }
    }
    throw err;
  }
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
