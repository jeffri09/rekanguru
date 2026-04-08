// ============================================================
// Rate Limiter — Track and enforce Gemini API limits
// Limits: RPM 15, RPD 500, TPM 250,000
// ============================================================

const LIMITS = {
  RPM: 15,       // Requests per minute
  RPD: 500,      // Requests per day
  TPM: 250000,   // Tokens per minute
};

// In-memory tracking
let requestTimestamps = [];  // timestamps of requests (for RPM)
let tokenTimestamps = [];    // { time, tokens } entries (for TPM)

// Daily tracking (persisted to localStorage)
function getDailyKey() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `ratelimit_daily_${today}`;
}

function getDailyCount() {
  try {
    const data = JSON.parse(localStorage.getItem(getDailyKey()) || '{}');
    return data.count || 0;
  } catch {
    return 0;
  }
}

function incrementDailyCount() {
  const key = getDailyKey();
  try {
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    data.count = (data.count || 0) + 1;
    localStorage.setItem(key, JSON.stringify(data));

    // Clean old daily keys
    cleanOldDailyKeys();
  } catch {
    localStorage.setItem(key, JSON.stringify({ count: 1 }));
  }
}

function cleanOldDailyKeys() {
  const today = getDailyKey();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('ratelimit_daily_') && key !== today) {
      localStorage.removeItem(key);
    }
  }
}

/**
 * Get current usage stats
 */
export function getUsageStats() {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  // Clean old timestamps
  requestTimestamps = requestTimestamps.filter(t => t > oneMinuteAgo);
  tokenTimestamps = tokenTimestamps.filter(t => t.time > oneMinuteAgo);

  const rpm = requestTimestamps.length;
  const rpd = getDailyCount();
  const tpm = tokenTimestamps.reduce((sum, t) => sum + t.tokens, 0);

  return {
    rpm, rpmLimit: LIMITS.RPM, rpmPct: Math.round((rpm / LIMITS.RPM) * 100),
    rpd, rpdLimit: LIMITS.RPD, rpdPct: Math.round((rpd / LIMITS.RPD) * 100),
    tpm, tpmLimit: LIMITS.TPM, tpmPct: Math.round((tpm / LIMITS.TPM) * 100),
  };
}

/**
 * Estimate token count (rough: ~4 chars per token for mixed ID/EN)
 */
export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Wait until rate limits allow a request.
 * Returns estimated wait time in ms, or 0 if ready.
 * Throws if daily limit is reached.
 */
export async function waitForRateLimit(estimatedPromptTokens = 500) {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  // Clean old entries
  requestTimestamps = requestTimestamps.filter(t => t > oneMinuteAgo);
  tokenTimestamps = tokenTimestamps.filter(t => t.time > oneMinuteAgo);

  // Check RPD (hard limit — can't wait)
  const rpd = getDailyCount();
  if (rpd >= LIMITS.RPD) {
    throw new Error(`Batas harian tercapai (${rpd}/${LIMITS.RPD} request). Coba lagi besok atau gunakan API key Anda sendiri.`);
  }

  // Check TPM — wait if would exceed
  const currentTPM = tokenTimestamps.reduce((sum, t) => sum + t.tokens, 0);
  if (currentTPM + estimatedPromptTokens > LIMITS.TPM) {
    const oldestToken = tokenTimestamps[0];
    if (oldestToken) {
      const waitMs = oldestToken.time + 60000 - now + 1000; // wait until oldest expires + buffer
      if (waitMs > 0) {
        updateUsageUI('⏳ Menunggu reset kuota token...');
        await sleep(Math.min(waitMs, 30000)); // max 30s wait
      }
    }
  }

  // Check RPM — wait if at limit
  if (requestTimestamps.length >= LIMITS.RPM) {
    const oldestRequest = requestTimestamps[0];
    const waitMs = oldestRequest + 60000 - now + 1000; // wait until oldest expires + buffer
    if (waitMs > 0) {
      updateUsageUI(`⏳ Rate limit: tunggu ${Math.ceil(waitMs / 1000)}s...`);
      await sleep(Math.min(waitMs, 30000));
    }
    // Re-clean after waiting
    requestTimestamps = requestTimestamps.filter(t => t > Date.now() - 60000);
  }

  return 0;
}

/**
 * Record a completed request
 */
export function recordRequest(promptTokens, responseTokens) {
  const now = Date.now();
  const totalTokens = (promptTokens || 0) + (responseTokens || 0);

  requestTimestamps.push(now);
  tokenTimestamps.push({ time: now, tokens: totalTokens });
  incrementDailyCount();

  // Update UI
  updateUsageUI();
}

/**
 * Update the usage indicator in the browser
 */
export function updateUsageUI(statusText = null) {
  const indicator = document.getElementById('usage-indicator');
  if (!indicator) return;

  const stats = getUsageStats();

  // Color based on usage level
  const getColor = (pct) => {
    if (pct >= 90) return '#ef4444'; // red
    if (pct >= 70) return '#f59e0b'; // amber
    if (pct >= 50) return '#eab308'; // yellow
    return '#10b981'; // green
  };

  const maxPct = Math.max(stats.rpmPct, stats.rpdPct, stats.tpmPct);
  const dotColor = getColor(maxPct);

  indicator.innerHTML = `
    <div class="usage-dot" style="background: ${dotColor};"></div>
    <div class="usage-stats">
      <span class="usage-stat" title="Requests Per Minute">
        <span class="usage-label">RPM</span>
        <span class="usage-value" style="color: ${getColor(stats.rpmPct)}">${stats.rpm}/${stats.rpmLimit}</span>
      </span>
      <span class="usage-stat" title="Requests Per Day">
        <span class="usage-label">RPD</span>
        <span class="usage-value" style="color: ${getColor(stats.rpdPct)}">${stats.rpd}/${stats.rpdLimit}</span>
      </span>
      <span class="usage-stat" title="Tokens Per Minute">
        <span class="usage-label">TPM</span>
        <span class="usage-value" style="color: ${getColor(stats.tpmPct)}">${formatTokens(stats.tpm)}/${formatTokens(stats.tpmLimit)}</span>
      </span>
    </div>
    ${statusText ? `<div class="usage-status">${statusText}</div>` : ''}
  `;
}

function formatTokens(n) {
  if (n >= 1000) return Math.round(n / 1000) + 'K';
  return n.toString();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Auto-refresh usage UI every 5 seconds
setInterval(() => updateUsageUI(), 5000);
