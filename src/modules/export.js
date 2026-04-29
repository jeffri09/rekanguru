// ============================================================
// Export Module — Step 3: Word Document Download
// ============================================================

import { state } from '../state.js';
import { showToast, wordCount, formatNumber, escapeHtml } from '../utils/helpers.js';
import { buildAndDownload } from '../services/docx-builder.js';

export default {
  render() {
    const book = state.get('book');
    const chapters = state.get('outline.chapters') || [];
    const content = state.get('content') || {};
    const settings = state.get('exportSettings');
    const totalWords = Object.values(content).reduce((s, c) => s + (c?.wordCount || 0), 0);
    const docLabel = book.docTypes?.map(d => d.toUpperCase()).join(', ') || 'DOKUMEN';

    return `
      <h2 class="step-title">📥 Download Dokumen</h2>
      <p class="step-subtitle">Atur format dan download dokumen sebagai file Word (.docx)</p>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value">${chapters.length}</span>
          <span class="stat-label">Komponen</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${formatNumber(totalWords)}</span>
          <span class="stat-label">Total Kata</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">~${Math.ceil(totalWords / 250)}</span>
          <span class="stat-label">Est. Halaman</span>
        </div>
        ${book.cpScanned ? `
          <div class="stat-item">
            <span class="stat-value">${(book.cpData || []).length}</span>
            <span class="stat-label">CP Terverifikasi</span>
          </div>
        ` : ''}
        ${(book.distribusiPertemuan || []).length > 0 ? `
          <div class="stat-item">
            <span class="stat-value">${(book.distribusiPertemuan || []).length}</span>
            <span class="stat-label">Pertemuan</span>
          </div>
        ` : ''}
      </div>

      <div class="export-grid">
        <!-- Settings Column -->
        <div>
          <div class="card" style="margin-bottom: var(--space-lg);">
            <div class="card-header">
              <h3 class="card-title">🎨 Format Dokumen</h3>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="export-body-font">Font Isi</label>
                <select class="form-select" id="export-body-font">
                  <option value="Times New Roman" ${settings.bodyFont === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
                  <option value="Georgia" ${settings.bodyFont === 'Georgia' ? 'selected' : ''}>Georgia</option>
                  <option value="Garamond" ${settings.bodyFont === 'Garamond' ? 'selected' : ''}>Garamond</option>
                  <option value="Cambria" ${settings.bodyFont === 'Cambria' ? 'selected' : ''}>Cambria</option>
                  <option value="Arial" ${settings.bodyFont === 'Arial' ? 'selected' : ''}>Arial</option>
                  <option value="Calibri" ${settings.bodyFont === 'Calibri' ? 'selected' : ''}>Calibri</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="export-heading-font">Font Judul</label>
                <select class="form-select" id="export-heading-font">
                  <option value="Arial" ${settings.headingFont === 'Arial' ? 'selected' : ''}>Arial</option>
                  <option value="Calibri" ${settings.headingFont === 'Calibri' ? 'selected' : ''}>Calibri</option>
                  <option value="Helvetica" ${settings.headingFont === 'Helvetica' ? 'selected' : ''}>Helvetica</option>
                  <option value="Times New Roman" ${settings.headingFont === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
                  <option value="Georgia" ${settings.headingFont === 'Georgia' ? 'selected' : ''}>Georgia</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="export-body-size">Ukuran Font Isi</label>
                <select class="form-select" id="export-body-size">
                  ${[10, 11, 12, 13, 14].map(s => `<option value="${s}" ${settings.bodySize === s ? 'selected' : ''}>${s} pt</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="export-heading-size">Ukuran Font Judul</label>
                <select class="form-select" id="export-heading-size">
                  ${[14, 16, 18, 20, 22, 24].map(s => `<option value="${s}" ${settings.headingSize === s ? 'selected' : ''}>${s} pt</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="export-spacing">Spasi Baris</label>
              <select class="form-select" id="export-spacing">
                <option value="1" ${settings.spacing === 1 ? 'selected' : ''}>Single (1.0)</option>
                <option value="1.15" ${settings.spacing === 1.15 ? 'selected' : ''}>1.15</option>
                <option value="1.5" ${settings.spacing === 1.5 ? 'selected' : ''}>1.5</option>
                <option value="2" ${settings.spacing === 2 ? 'selected' : ''}>Double (2.0)</option>
              </select>
            </div>
          </div>

          <div class="card" style="margin-bottom: var(--space-lg);">
            <div class="card-header">
              <h3 class="card-title">📄 Elemen Dokumen</h3>
            </div>

            <div class="checkbox-group">
              <label class="checkbox-item">
                <input type="checkbox" id="export-cover" ${settings.includeCover ? 'checked' : ''} />
                <span>Halaman Sampul (Cover Page)</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" id="export-toc" ${settings.includeToc ? 'checked' : ''} />
                <span>Daftar Isi</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" id="export-page-numbers" ${settings.includePageNumbers ? 'checked' : ''} />
                <span>Nomor Halaman</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" id="export-headers" ${settings.includeHeaders ? 'checked' : ''} />
                <span>Header (Judul di atas halaman)</span>
              </label>
            </div>
          </div>

          <button class="btn btn-primary btn-lg" id="btn-download" style="width: 100%;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download .docx
          </button>
        </div>

        <!-- Preview Column -->
        <div>
          <div class="card" style="padding: 0; overflow: hidden;">
            <div style="padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between;">
              <h3 class="card-title" style="font-size: var(--fs-sm);">📖 Preview Struktur</h3>
            </div>
            <div class="export-preview" id="export-preview">
              ${this.renderPreview(book, chapters, content, settings)}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderPreview(book, chapters, content, settings) {
    let html = '';
    const docLabel = book.docTypes?.map(d => d.toUpperCase()).join(' + ') || 'DOKUMEN';
    const title = docLabel + (book.topic ? ' — ' + book.topic : '');

    if (settings.includeCover) {
      html += `
        <div style="text-align: center; padding: 40px 20px; border-bottom: 2px solid #eee; margin-bottom: 20px;">
          <h1 style="font-family: ${settings.headingFont}; font-size: ${settings.headingSize}pt; margin-bottom: 8px;">${escapeHtml(title)}</h1>
          <div style="color: #8b5cf6; margin-bottom: 12px;">━━━━━━━━━━━━</div>
          <p style="font-style: italic; color: #777; font-size: 0.85rem;">${escapeHtml(book.subject || '')} ${book.classPhase ? '— ' + escapeHtml(book.classPhase) : ''}</p>
          ${book.cpScanned ? `<p style="margin-top: 8px; font-size: 0.75rem; color: #8b5cf6;">✅ ${(book.cpData || []).length} CP Terverifikasi</p>` : ''}
          ${(book.distribusiPertemuan || []).length > 0 ? `<p style="font-size: 0.75rem; color: #059669;">📅 ${(book.distribusiPertemuan || []).length} Pertemuan</p>` : ''}
          <p style="margin-top: 20px; color: #555;">Kurikulum Merdeka ${new Date().getFullYear()}</p>
        </div>
      `;
    }

    if (settings.includeToc) {
      html += `<div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">`;
      html += `<h2 style="font-family: ${settings.headingFont}; text-align: center; margin-bottom: 12px;">DAFTAR ISI</h2>`;
      chapters.forEach((ch, idx) => {
        html += `<p style="font-size: 0.85rem; padding: 4px 0;">Bagian ${idx + 1}: ${escapeHtml(ch.title)}</p>`;
      });
      html += `</div>`;
    }

    // Show all chapters with rendered markdown
    chapters.forEach((ch, idx) => {
      const text = content[ch.id]?.text || '(belum di-generate)';
      const renderedContent = this.markdownToHtml(text, settings);
      html += `
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <p style="color: #8b5cf6; font-size: 0.7rem; font-weight: 700;">BAGIAN ${idx + 1}</p>
          <h2 style="font-family: ${settings.headingFont}; font-size: 1.1rem; margin-bottom: 8px;">${escapeHtml(ch.title)}</h2>
          <div style="font-size: 0.78rem; line-height: 1.7; color: var(--text-secondary);">${renderedContent}</div>
        </div>
      `;
    });

    return html;
  },

  /**
   * Convert markdown text to HTML for preview display
   */
  markdownToHtml(text, settings) {
    if (!text || text === '(belum di-generate)') return '<em style="color:var(--text-tertiary);">(belum di-generate)</em>';
    
    return text
      .split('\n')
      .map(line => {
        // Skip empty lines
        if (!line.trim()) return '<br/>';
        
        // H4
        if (line.startsWith('#### ')) {
          const t = line.replace(/^####\s*/, '').replace(/\*\*/g, '');
          return `<h5 style="font-family:${settings.headingFont}; font-size:0.8rem; font-weight:700; margin:8px 0 4px; color:var(--text-primary);">${escapeHtml(t)}</h5>`;
        }
        // H3
        if (line.startsWith('### ')) {
          const t = line.replace(/^###\s*/, '').replace(/\*\*/g, '');
          return `<h4 style="font-family:${settings.headingFont}; font-size:0.85rem; font-weight:700; margin:10px 0 4px; color:var(--text-primary);">${escapeHtml(t)}</h4>`;
        }
        // H2
        if (line.startsWith('## ')) {
          const t = line.replace(/^##\s*/, '').replace(/\*\*/g, '');
          return `<h3 style="font-family:${settings.headingFont}; font-size:0.95rem; font-weight:700; margin:12px 0 6px; color:var(--text-primary);">${escapeHtml(t)}</h3>`;
        }
        // Bullet
        if (line.match(/^\s*[-*]\s/)) {
          const indent = line.match(/^\s*/)[0].length > 1 ? 'margin-left:20px;' : 'margin-left:10px;';
          const bullet = line.match(/^\s*/)[0].length > 1 ? '◦' : '•';
          const t = line.replace(/^\s*[-*]\s*/, '');
          return `<div style="font-size:0.78rem; ${indent} padding:1px 0;">${bullet} ${this.inlineFormat(t)}</div>`;
        }
        // Numbered
        if (line.match(/^\d+\.\s/)) {
          const t = line.replace(/^(\d+\.)\s*/, '<strong>$1</strong> ');
          return `<div style="font-size:0.78rem; margin-left:10px; padding:1px 0;">${this.inlineFormat(t)}</div>`;
        }
        // Table row — render as simple grid
        if (line.trim().startsWith('|')) {
          if (line.trim().match(/^\|[\s:-]+\|/)) return ''; // separator row
          const cells = line.split('|').slice(1, -1).map(c => `<td style="padding:2px 6px; border:1px solid rgba(255,255,255,0.1); font-size:0.72rem;">${this.inlineFormat(c.trim())}</td>`);
          return `<tr>${cells.join('')}</tr>`;
        }
        // Regular paragraph
        return `<p style="font-size:0.78rem; margin:2px 0; line-height:1.6;">${this.inlineFormat(line)}</p>`;
      })
      .join('')
      // Wrap table rows
      .replace(/(<tr>[\s\S]*?<\/tr>)/g, (match, p1, offset, str) => {
        // Check if already inside a table
        const before = str.substring(0, offset);
        if (before.lastIndexOf('<table') > before.lastIndexOf('</table>')) return match;
        // Find consecutive tr blocks
        return `<table style="width:100%; border-collapse:collapse; margin:8px 0;">${match}</table>`;
      });
  },

  /**
   * Format inline markdown: **bold**, *italic*, `code`
   */
  inlineFormat(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:rgba(139,92,246,0.15); padding:1px 4px; border-radius:3px; font-size:0.72rem;">$1</code>');
  },

  init() {
    document.getElementById('btn-download')?.addEventListener('click', () => this.handleDownload());

    const settingsInputs = [
      'export-body-font', 'export-heading-font', 'export-body-size',
      'export-heading-size', 'export-spacing', 'export-cover',
      'export-toc', 'export-page-numbers', 'export-headers',
    ];

    settingsInputs.forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => {
        this.saveSettings();
        this.updatePreview();
      });
    });
  },

  saveSettings() {
    state.set('exportSettings.bodyFont', document.getElementById('export-body-font')?.value || 'Times New Roman');
    state.set('exportSettings.headingFont', document.getElementById('export-heading-font')?.value || 'Arial');
    state.set('exportSettings.bodySize', parseInt(document.getElementById('export-body-size')?.value || 12));
    state.set('exportSettings.headingSize', parseInt(document.getElementById('export-heading-size')?.value || 16));
    state.set('exportSettings.spacing', parseFloat(document.getElementById('export-spacing')?.value || 1.5));
    state.set('exportSettings.includeCover', document.getElementById('export-cover')?.checked ?? true);
    state.set('exportSettings.includeToc', document.getElementById('export-toc')?.checked ?? true);
    state.set('exportSettings.includePageNumbers', document.getElementById('export-page-numbers')?.checked ?? true);
    state.set('exportSettings.includeHeaders', document.getElementById('export-headers')?.checked ?? true);
  },

  updatePreview() {
    const preview = document.getElementById('export-preview');
    if (!preview) return;
    const book = state.get('book');
    const chapters = state.get('outline.chapters') || [];
    const content = state.get('content') || {};
    const settings = state.get('exportSettings');
    preview.innerHTML = this.renderPreview(book, chapters, content, settings);
  },

  async handleDownload() {
    this.saveSettings();
    const btn = document.getElementById('btn-download');
    btn.disabled = true;
    btn.innerHTML = `<div class="loading-spinner" style="width:18px; height:18px; border-width:2px;"></div><span>Membuat dokumen...</span>`;

    try {
      const book = state.get('book');
      const outline = state.get('outline');
      const content = state.get('content');
      const exportSettings = state.get('exportSettings');
      const profile = state.get('profile') || {};
      const filename = await buildAndDownload(book, outline, content, exportSettings, profile);
      showToast(`Dokumen berhasil diunduh: "${filename}" 🎉`, 'success');
    } catch (err) {
      console.error('Export error:', err);
      showToast(`Gagal mengekspor: ${err.message}`, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download .docx`;
    }
  },

  validate() { return true; },
  getData() { this.saveSettings(); },
};
