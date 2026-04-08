// ============================================================
// Utility Helpers
// ============================================================

/**
 * Count words in a text string
 */
export function wordCount(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Generate a unique ID
 */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce a function
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle a function
 */
export function throttle(fn, limit = 300) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Escape HTML
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Sleep for ms
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Show a toast notification
 */
export function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

/**
 * Show modal dialog
 */
export function showModal(title, bodyHtml, buttons = []) {
  const overlay = document.getElementById('modal-overlay');
  const header = document.getElementById('modal-header');
  const body = document.getElementById('modal-body');
  const footer = document.getElementById('modal-footer');

  header.innerHTML = `<h2>${title}</h2>`;
  body.innerHTML = bodyHtml;
  footer.innerHTML = '';

  buttons.forEach((btn) => {
    const el = document.createElement('button');
    el.className = `btn ${btn.class || 'btn-secondary'}`;
    el.textContent = btn.text;
    el.onclick = () => {
      if (btn.onClick) btn.onClick();
      if (btn.close !== false) hideModal();
    };
    footer.appendChild(el);
  });

  overlay.classList.remove('hidden');
}

/**
 * Hide modal
 */
export function hideModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('hidden');
}

/**
 * Truncate text
 */
export function truncate(text, maxLen = 60) {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
}

/**
 * Format date for display
 */
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Parse markdown-like text to simple HTML
 */
export function markdownToHtml(text) {
  if (!text) return '';
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/, '<p>$1</p>');
}
