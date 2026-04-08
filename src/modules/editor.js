// ============================================================
// Editor Module — Step 4: Chapter Content Editing
// ============================================================

import { state } from '../state.js';
import { showToast, wordCount, debounce, escapeHtml, formatNumber } from '../utils/helpers.js';
import { generateText } from '../services/gemini.js';
import { chapterPrompt } from '../utils/prompts.js';

let activeChapterId = null;

export default {
  render() {
    const chapters = state.get('outline.chapters') || [];
    const content = state.get('content') || {};
    const totalWords = Object.values(content).reduce((s, c) => s + (c?.wordCount || 0), 0);

    // Set first chapter as active if none selected
    if (!activeChapterId && chapters.length > 0) {
      activeChapterId = chapters[0].id;
    }

    const activeContent = content[activeChapterId]?.text || '';
    const activeChapter = chapters.find((c) => c.id === activeChapterId);
    const activeWc = wordCount(activeContent);

    return `
      <h2 class="step-title">✏️ Penyuntingan</h2>
      <p class="step-subtitle">Edit dan perbaiki konten setiap bab. Anda juga bisa regenerate bab tertentu.</p>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value">${chapters.length}</span>
          <span class="stat-label">Total Bab</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="editor-total-words">${formatNumber(totalWords)}</span>
          <span class="stat-label">Total Kata</span>
        </div>
      </div>

      <div class="editor-layout">
        <!-- Sidebar -->
        <div class="editor-sidebar">
          <div style="padding: var(--space-sm) var(--space-md); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-tertiary); font-weight: 600;">
            Daftar Bab
          </div>
          ${chapters
            .map((ch, idx) => {
              const chContent = content[ch.id];
              const wc = chContent?.wordCount || 0;
              const isActive = ch.id === activeChapterId;
              return `
              <div class="sidebar-chapter ${isActive ? 'active' : ''}" data-id="${ch.id}">
                <div class="sidebar-chapter-num">${idx + 1}</div>
                <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(ch.title)}</span>
                <span class="word-count">${wc > 0 ? formatNumber(wc) : '—'}</span>
              </div>
            `;
            })
            .join('')}
        </div>

        <!-- Editor Main -->
        <div class="editor-main">
          <div class="editor-toolbar">
            <div class="editor-toolbar-left">
              <span class="editor-chapter-title" id="editor-chapter-title">${activeChapter ? escapeHtml(activeChapter.title) : 'Pilih Bab'}</span>
            </div>
            <div class="editor-toolbar-right">
              <div class="editor-stats">
                <span id="editor-wc">${formatNumber(activeWc)} kata</span>
              </div>
              <button class="btn btn-secondary btn-sm" id="btn-regen-chapter" ${!activeChapterId ? 'disabled' : ''}>🔄 Regenerate</button>
            </div>
          </div>

          <textarea class="editor-textarea" id="editor-textarea" placeholder="Konten bab akan ditampilkan di sini...">${activeContent}</textarea>
        </div>
      </div>
    `;
  },

  init() {
    // Sidebar chapter click
    document.querySelectorAll('.sidebar-chapter').forEach((el) => {
      el.addEventListener('click', () => {
        this.saveCurrentChapter();
        activeChapterId = el.dataset.id;
        this.refreshEditor();
      });
    });

    // Auto-save on textarea change
    const textarea = document.getElementById('editor-textarea');
    if (textarea) {
      const debouncedSave = debounce(() => {
        this.saveCurrentChapter();
      }, 500);
      textarea.addEventListener('input', debouncedSave);
    }

    // Regenerate button
    document.getElementById('btn-regen-chapter')?.addEventListener('click', () => this.regenerateChapter());
  },

  saveCurrentChapter() {
    if (!activeChapterId) return;

    const textarea = document.getElementById('editor-textarea');
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

    // Update word count display
    const wcEl = document.getElementById('editor-wc');
    if (wcEl) wcEl.textContent = `${formatNumber(wc)} kata`;

    // Update sidebar word count
    const sidebarItem = document.querySelector(`.sidebar-chapter[data-id="${activeChapterId}"] .word-count`);
    if (sidebarItem) sidebarItem.textContent = wc > 0 ? formatNumber(wc) : '—';

    // Update total word count
    const totalWords = Object.values(content).reduce((s, c) => s + (c?.wordCount || 0), 0);
    const totalEl = document.getElementById('editor-total-words');
    if (totalEl) totalEl.textContent = formatNumber(totalWords);
  },

  refreshEditor() {
    const chapters = state.get('outline.chapters') || [];
    const content = state.get('content') || {};
    const activeChapter = chapters.find((c) => c.id === activeChapterId);
    const activeContent = content[activeChapterId]?.text || '';
    const activeWc = wordCount(activeContent);

    // Update active state in sidebar
    document.querySelectorAll('.sidebar-chapter').forEach((el) => {
      el.classList.toggle('active', el.dataset.id === activeChapterId);
    });

    // Update editor content
    const textarea = document.getElementById('editor-textarea');
    if (textarea) textarea.value = activeContent;

    const titleEl = document.getElementById('editor-chapter-title');
    if (titleEl) titleEl.textContent = activeChapter ? activeChapter.title : 'Pilih Bab';

    const wcEl = document.getElementById('editor-wc');
    if (wcEl) wcEl.textContent = `${formatNumber(activeWc)} kata`;
  },

  async regenerateChapter() {
    if (!activeChapterId) return;

    const chapters = state.get('outline.chapters') || [];
    const chapter = chapters.find((c) => c.id === activeChapterId);
    if (!chapter) return;

    const chapterIdx = chapters.indexOf(chapter);
    const book = state.get('book');

    const btn = document.getElementById('btn-regen-chapter');
    btn.disabled = true;
    btn.textContent = '⏳ Regenerating...';

    try {
      // Get previous chapter summary for context
      let prevSummary = '';
      if (chapterIdx > 0) {
        const prevChapter = chapters[chapterIdx - 1];
        const prevContent = state.get('content')?.[prevChapter.id]?.text;
        if (prevContent) {
          prevSummary = prevContent.substring(0, 500);
        }
      }

      const prompt = chapterPrompt(book, chapter, chapterIdx, prevSummary, chapters.length);
      const text = await generateText(prompt);
      const wc = wordCount(text);

      // Update content
      const content = state.get('content') || {};
      content[activeChapterId] = { text, wordCount: wc, generated: true };
      state.set('content', content);

      this.refreshEditor();
      showToast(`Bab "${chapter.title}" berhasil di-regenerate! (${wc} kata)`, 'success');
    } catch (err) {
      showToast(`Gagal regenerate: ${err.message}`, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '🔄 Regenerate';
    }
  },

  validate() {
    this.saveCurrentChapter();
    return true;
  },

  getData() {
    this.saveCurrentChapter();
  },

  destroy() {
    this.saveCurrentChapter();
  },
};
