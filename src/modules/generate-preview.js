// ============================================================
// Generate & Preview Module — Step 2: Combined Outline+Generate+Edit
// ============================================================

import { state } from '../state.js';
import { uid, showToast, escapeHtml, wordCount, sleep, formatNumber } from '../utils/helpers.js';
import { generateText, parseJsonResponse } from '../services/gemini.js';
import { outlinePrompt, chapterPrompt, summaryPrompt } from '../utils/prompts.js';

let isGenerating = false;
let shouldStop = false;
let activeChapterId = null;

export default {
  render() {
    const chapters = state.get('outline.chapters') || [];
    const content = state.get('content') || {};
    const generatedCount = chapters.filter(ch => content[ch.id]?.generated).length;
    const totalWords = Object.values(content).reduce((s, c) => s + (c?.wordCount || 0), 0);
    const allDone = chapters.length > 0 && generatedCount === chapters.length;

    if (!activeChapterId && chapters.length > 0) {
      activeChapterId = chapters[0].id;
    }

    return `
      <h2 class="step-title">⚡ Generate & Preview</h2>
      <p class="step-subtitle">AI akan membuat kerangka dan menulis semua konten secara otomatis. Anda bisa mengedit hasilnya.</p>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value" id="gp-stat-chapters">${generatedCount}/${chapters.length || '?'}</span>
          <span class="stat-label">Komponen</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="gp-stat-words">${formatNumber(totalWords)}</span>
          <span class="stat-label">Total Kata</span>
        </div>
        <div style="flex:1;"></div>
        <div style="display:flex; gap: var(--space-sm); align-items:center;">
          ${!allDone ? `
            <button class="btn btn-primary" id="btn-generate-all" ${isGenerating ? 'disabled' : ''}>
              ${chapters.length === 0 ? '✨ Generate Semua' : generatedCount > 0 ? '▶️ Lanjutkan' : '✨ Generate Semua'}
            </button>
          ` : `
            <span class="badge badge-green" style="padding: 8px 16px; font-size: 13px;">✅ Semua Selesai</span>
          `}
          <button class="btn btn-danger btn-sm" id="btn-stop-gen" style="display:${isGenerating ? 'flex' : 'none'};">⏹️ Stop</button>
        </div>
      </div>

      <!-- Progress -->
      <div class="card" style="margin-bottom: var(--space-lg);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-sm);">
          <span style="font-size: var(--fs-sm); font-weight: 600;" id="gp-status-text">
            ${chapters.length === 0 ? 'Siap generate...' : allDone ? 'Semua komponen selesai!' : `${generatedCount} dari ${chapters.length} selesai`}
          </span>
          <span style="font-size: var(--fs-sm); color: var(--text-secondary);" id="gp-percent">${chapters.length > 0 ? Math.round((generatedCount / chapters.length) * 100) : 0}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" id="gp-progress-fill" style="width: ${chapters.length > 0 ? (generatedCount / chapters.length) * 100 : 0}%;"></div>
        </div>
      </div>

      <!-- Editor Layout -->
      ${chapters.length > 0 ? this.renderEditorLayout(chapters, content) : `
        <div class="empty-state" id="gp-empty">
          <div class="empty-state-icon">⚡</div>
          <div class="empty-state-title">Belum ada konten</div>
          <div class="empty-state-text">Klik "Generate Semua" untuk membuat kerangka dan konten dokumen secara otomatis.</div>
        </div>
      `}
    `;
  },

  renderEditorLayout(chapters, content) {
    const activeContent = content[activeChapterId]?.text || '';
    const activeChapter = chapters.find(c => c.id === activeChapterId);
    const activeWc = wordCount(activeContent);

    return `
      <div class="editor-layout">
        <div class="editor-sidebar">
          <div style="padding: var(--space-sm) var(--space-md); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-tertiary); font-weight: 600;">
            Komponen Dokumen
          </div>
          ${chapters.map((ch, idx) => {
            const chContent = content[ch.id];
            const wc = chContent?.wordCount || 0;
            const isActive = ch.id === activeChapterId;
            const isDone = chContent?.generated;
            return `
              <div class="sidebar-chapter ${isActive ? 'active' : ''}" data-id="${ch.id}">
                <div class="sidebar-chapter-num">${isDone ? '✅' : (idx + 1)}</div>
                <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(ch.title)}</span>
                <span class="word-count">${wc > 0 ? formatNumber(wc) : '—'}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="editor-main">
          <div class="editor-toolbar">
            <div class="editor-toolbar-left">
              <span class="editor-chapter-title" id="gp-chapter-title">${activeChapter ? escapeHtml(activeChapter.title) : 'Pilih Komponen'}</span>
            </div>
            <div class="editor-toolbar-right">
              <div class="editor-stats">
                <span id="gp-wc">${formatNumber(activeWc)} kata</span>
              </div>
              <button class="btn btn-secondary btn-sm" id="btn-regen-section" ${!activeChapterId ? 'disabled' : ''}>🔄 Regenerate</button>
            </div>
          </div>

          <textarea class="editor-textarea" id="gp-textarea" placeholder="Konten komponen akan ditampilkan di sini...">${activeContent}</textarea>
        </div>
      </div>
    `;
  },

  init() {
    // Generate All button
    document.getElementById('btn-generate-all')?.addEventListener('click', () => this.generateAll());

    // Stop button
    document.getElementById('btn-stop-gen')?.addEventListener('click', () => {
      shouldStop = true;
      showToast('Menghentikan setelah bagian saat ini selesai...', 'warning');
    });

    // Sidebar clicks
    this.attachSidebarListeners();

    // Textarea auto-save
    const textarea = document.getElementById('gp-textarea');
    if (textarea) {
      let saveTimer;
      textarea.addEventListener('input', () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => this.saveCurrentSection(), 500);
      });
    }

    // Regenerate button
    document.getElementById('btn-regen-section')?.addEventListener('click', () => this.regenerateSection());
  },

  attachSidebarListeners() {
    document.querySelectorAll('.sidebar-chapter').forEach(el => {
      el.addEventListener('click', () => {
        this.saveCurrentSection();
        activeChapterId = el.dataset.id;
        this.refreshEditor();
      });
    });
  },

  saveCurrentSection() {
    if (!activeChapterId) return;
    const textarea = document.getElementById('gp-textarea');
    if (!textarea) return;

    const text = textarea.value;
    const wc = wordCount(text);
    const content = state.get('content') || {};
    content[activeChapterId] = {
      ...(content[activeChapterId] || {}),
      text,
      wordCount: wc,
      generated: true,
    };
    state.set('content', content);

    // Update word count in UI
    const wcEl = document.getElementById('gp-wc');
    if (wcEl) wcEl.textContent = `${formatNumber(wc)} kata`;

    const sidebarItem = document.querySelector(`.sidebar-chapter[data-id="${activeChapterId}"] .word-count`);
    if (sidebarItem) sidebarItem.textContent = wc > 0 ? formatNumber(wc) : '—';

    // Update total
    const totalWords = Object.values(content).reduce((s, c) => s + (c?.wordCount || 0), 0);
    const totalEl = document.getElementById('gp-stat-words');
    if (totalEl) totalEl.textContent = formatNumber(totalWords);
  },

  refreshEditor() {
    const chapters = state.get('outline.chapters') || [];
    const content = state.get('content') || {};
    const activeChapter = chapters.find(c => c.id === activeChapterId);
    const activeContent = content[activeChapterId]?.text || '';
    const activeWc = wordCount(activeContent);

    // Update sidebar active state
    document.querySelectorAll('.sidebar-chapter').forEach(el => {
      el.classList.toggle('active', el.dataset.id === activeChapterId);
    });

    // Update editor
    const textarea = document.getElementById('gp-textarea');
    if (textarea) textarea.value = activeContent;

    const titleEl = document.getElementById('gp-chapter-title');
    if (titleEl) titleEl.textContent = activeChapter ? activeChapter.title : 'Pilih Komponen';

    const wcEl = document.getElementById('gp-wc');
    if (wcEl) wcEl.textContent = `${formatNumber(activeWc)} kata`;
  },

  async generateAll() {
    if (isGenerating) return;
    isGenerating = true;
    shouldStop = false;

    const btnStart = document.getElementById('btn-generate-all');
    const btnStop = document.getElementById('btn-stop-gen');
    if (btnStart) { btnStart.disabled = true; btnStart.textContent = '⏳ Generating...'; }
    if (btnStop) btnStop.style.display = 'flex';

    const book = state.get('book');
    let chapters = state.get('outline.chapters') || [];

    try {
      // PHASE 1: Generate outline if no chapters yet
      if (chapters.length === 0) {
        this.updateStatus('Membuat kerangka dokumen...');
        const prompt = outlinePrompt(book);
        const response = await generateText(prompt);
        const data = parseJsonResponse(response);

        if (data.chapters && Array.isArray(data.chapters)) {
          chapters = data.chapters.map(ch => ({
            id: uid(),
            title: ch.title || 'Tanpa Judul',
            sections: ch.sections || [],
          }));
          state.set('outline.chapters', chapters);
          showToast(`Kerangka berhasil! ${chapters.length} komponen.`, 'success');
        } else {
          throw new Error('Format respons AI tidak sesuai.');
        }

        // Re-render to show the editor layout
        const container = document.getElementById('wizard-content');
        if (container) {
          container.innerHTML = `<div class="step-container">${this.render()}</div>`;
          setTimeout(() => this.init(), 50);
        }
      }

      // PHASE 2: Generate content for each chapter
      let content = state.get('content') || {};
      let prevSummary = '';

      for (let i = 0; i < chapters.length; i++) {
        if (shouldStop) break;

        const chapter = chapters[i];

        // Skip already generated
        if (content[chapter.id]?.generated) {
          if (content[chapter.id]?.text) {
            try {
              prevSummary = await this.genSummary(chapter.title, content[chapter.id].text);
            } catch { prevSummary = content[chapter.id].text.substring(0, 500); }
          }
          continue;
        }

        this.updateStatus(`Menulis komponen ${i + 1}/${chapters.length}: ${chapter.title}`);
        this.updateSidebarIcon(chapter.id, '⏳');

        try {
          const prompt = chapterPrompt(book, chapter, i, prevSummary, chapters.length);
          const text = await generateText(prompt);
          const wc = wordCount(text);

          content[chapter.id] = { text, wordCount: wc, generated: true };
          state.set('content', { ...content });

          this.updateSidebarIcon(chapter.id, '✅');
          this.updateProgress(chapters, content);

          // Auto-select first completed chapter
          if (!activeChapterId || !content[activeChapterId]?.generated) {
            activeChapterId = chapter.id;
            this.refreshEditor();
          }

          try {
            prevSummary = await this.genSummary(chapter.title, text);
          } catch { prevSummary = text.substring(0, 500); }

          showToast(`Komponen ${i + 1} selesai! (${wc} kata)`, 'success');
        } catch (err) {
          this.updateSidebarIcon(chapter.id, '❌');
          showToast(`Gagal komponen ${i + 1}: ${err.message}`, 'error');
          await sleep(5000);
        }
      }

      // Check completion
      const generatedCount = chapters.filter(ch => content[ch.id]?.generated).length;
      if (generatedCount === chapters.length) {
        this.updateStatus('Semua komponen selesai!');
        showToast('Semua komponen berhasil di-generate! Lanjut ke Download.', 'success');
      }

    } catch (err) {
      showToast(`Gagal: ${err.message}`, 'error');
    } finally {
      isGenerating = false;
      shouldStop = false;

      // Re-render to update button states
      const container = document.getElementById('wizard-content');
      if (container) {
        container.innerHTML = `<div class="step-container">${this.render()}</div>`;
        setTimeout(() => this.init(), 50);
      }
    }
  },

  async genSummary(title, text) {
    const prompt = summaryPrompt(title, text);
    return await generateText(prompt);
  },

  async regenerateSection() {
    if (!activeChapterId) return;
    const chapters = state.get('outline.chapters') || [];
    const chapter = chapters.find(c => c.id === activeChapterId);
    if (!chapter) return;

    const chapterIdx = chapters.indexOf(chapter);
    const book = state.get('book');

    const btn = document.getElementById('btn-regen-section');
    btn.disabled = true;
    btn.textContent = '⏳ Regenerating...';

    try {
      let prevSummary = '';
      if (chapterIdx > 0) {
        const prevCh = chapters[chapterIdx - 1];
        const prevContent = state.get('content')?.[prevCh.id]?.text;
        if (prevContent) prevSummary = prevContent.substring(0, 500);
      }

      const prompt = chapterPrompt(book, chapter, chapterIdx, prevSummary, chapters.length);
      const text = await generateText(prompt);
      const wc = wordCount(text);

      const content = state.get('content') || {};
      content[activeChapterId] = { text, wordCount: wc, generated: true };
      state.set('content', content);

      this.refreshEditor();
      showToast(`"${chapter.title}" berhasil di-regenerate! (${wc} kata)`, 'success');
    } catch (err) {
      showToast(`Gagal: ${err.message}`, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '🔄 Regenerate';
    }
  },

  updateStatus(text) {
    const el = document.getElementById('gp-status-text');
    if (el) el.textContent = text;
  },

  updateSidebarIcon(id, icon) {
    const numEl = document.querySelector(`.sidebar-chapter[data-id="${id}"] .sidebar-chapter-num`);
    if (numEl) numEl.textContent = icon;
  },

  updateProgress(chapters, content) {
    const generatedCount = chapters.filter(ch => content[ch.id]?.generated).length;
    const totalWords = Object.values(content).reduce((s, c) => s + (c?.wordCount || 0), 0);
    const percent = Math.round((generatedCount / chapters.length) * 100);

    const el1 = document.getElementById('gp-stat-chapters');
    const el2 = document.getElementById('gp-stat-words');
    const el3 = document.getElementById('gp-progress-fill');
    const el4 = document.getElementById('gp-percent');

    if (el1) el1.textContent = `${generatedCount}/${chapters.length}`;
    if (el2) el2.textContent = formatNumber(totalWords);
    if (el3) el3.style.width = `${percent}%`;
    if (el4) el4.textContent = `${percent}%`;
  },

  validate() {
    this.saveCurrentSection();
    const chapters = state.get('outline.chapters') || [];
    const content = state.get('content') || {};
    const generatedCount = chapters.filter(ch => content[ch.id]?.generated).length;

    if (generatedCount === 0) {
      showToast('Silakan generate konten terlebih dahulu.', 'warning');
      return false;
    }
    return true;
  },

  getData() {
    this.saveCurrentSection();
  },

  destroy() {
    this.saveCurrentSection();
    shouldStop = true;
    isGenerating = false;
  },
};
