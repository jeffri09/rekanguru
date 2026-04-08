// ============================================================
// Outline Module — Step 2: AI Outline Generation & Editing
// ============================================================

import { state } from '../state.js';
import { uid, showToast, escapeHtml, showModal, hideModal } from '../utils/helpers.js';
import { generateText, parseJsonResponse } from '../services/gemini.js';
import { outlinePrompt } from '../utils/prompts.js';

let dragSrcIdx = null;

export default {
  render() {
    const chapters = state.get('outline.chapters') || [];
    const book = state.get('book');

    return `
      <h2 class="step-title">📋 Kerangka Buku</h2>
      <p class="step-subtitle">Generate kerangka buku otomatis menggunakan AI, lalu edit sesuai keinginan Anda.</p>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value" id="stat-chapters">${chapters.length}</span>
          <span class="stat-label">Bab</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="stat-sections">${chapters.reduce((s, c) => s + (c.sections?.length || 0), 0)}</span>
          <span class="stat-label">Sub-bagian</span>
        </div>
        <div style="flex:1;"></div>
        <button class="btn btn-primary" id="btn-generate-outline">
          ✨ Generate Kerangka dengan AI
        </button>
      </div>

      <div id="outline-loading" style="display:none;">
        <div class="card" style="text-align:center; padding: var(--space-2xl);">
          <div class="loading-spinner" style="margin: 0 auto var(--space-md);"></div>
          <p style="color: var(--text-secondary);">AI sedang membuat kerangka buku<span class="loading-dots"></span></p>
        </div>
      </div>

      <div id="chapter-list-container">
        ${chapters.length > 0 ? this.renderChapterList(chapters) : this.renderEmptyState()}
      </div>

      <div style="margin-top: var(--space-lg); display: flex; gap: var(--space-sm);">
        <button class="btn btn-secondary" id="btn-add-chapter">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Bab
        </button>
        ${chapters.length > 0 ? '<button class="btn btn-danger btn-sm" id="btn-clear-outline">🗑️ Hapus Semua</button>' : ''}
      </div>
    `;
  },

  renderChapterList(chapters) {
    return `
      <div class="chapter-list" id="chapter-list">
        ${chapters
          .map(
            (ch, idx) => `
          <div class="chapter-item" data-idx="${idx}" data-id="${ch.id}" draggable="true">
            <div class="chapter-drag-handle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></svg>
            </div>
            <div class="chapter-number">${idx + 1}</div>
            <div style="flex:1;">
              <input class="chapter-title-input" data-id="${ch.id}" value="${escapeHtml(ch.title)}" placeholder="Judul bab..." />
              <div style="margin-top: 4px; font-size: 11px; color: var(--text-tertiary);">
                ${(ch.sections || []).map((s) => escapeHtml(s)).join(' · ')}
              </div>
            </div>
            <div class="chapter-actions">
              <button class="chapter-action-btn" data-action="edit-sections" data-id="${ch.id}" title="Edit sub-bagian">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="chapter-action-btn delete" data-action="delete" data-id="${ch.id}" title="Hapus bab">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  },

  renderEmptyState() {
    return `
      <div class="empty-state" id="outline-empty">
        <div class="empty-state-icon">📝</div>
        <div class="empty-state-title">Belum ada kerangka</div>
        <div class="empty-state-text">Klik tombol "Generate Kerangka dengan AI" untuk membuat kerangka buku secara otomatis, atau tambahkan bab secara manual.</div>
      </div>
    `;
  },

  init() {
    // Generate outline
    document.getElementById('btn-generate-outline')?.addEventListener('click', () => this.handleGenerate());

    // Add chapter
    document.getElementById('btn-add-chapter')?.addEventListener('click', () => this.addChapter());

    // Clear outline
    document.getElementById('btn-clear-outline')?.addEventListener('click', () => {
      state.set('outline.chapters', []);
      this.refreshList();
    });

    // Chapter actions (delete, edit sections)
    this.attachChapterListeners();

    // Drag and drop
    this.attachDragListeners();
  },

  attachChapterListeners() {
    // Title input changes
    document.querySelectorAll('.chapter-title-input').forEach((input) => {
      input.addEventListener('change', (e) => {
        const chapters = state.get('outline.chapters');
        const ch = chapters.find((c) => c.id === e.target.dataset.id);
        if (ch) {
          ch.title = e.target.value;
          state.set('outline.chapters', chapters);
        }
      });
    });

    // Action buttons
    document.querySelectorAll('.chapter-action-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === 'delete') {
          const chapters = state.get('outline.chapters').filter((c) => c.id !== id);
          state.set('outline.chapters', chapters);
          this.refreshList();
        }

        if (action === 'edit-sections') {
          this.editSections(id);
        }
      });
    });
  },

  attachDragListeners() {
    const items = document.querySelectorAll('.chapter-item');
    items.forEach((item) => {
      item.addEventListener('dragstart', (e) => {
        dragSrcIdx = parseInt(item.dataset.idx);
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        document.querySelectorAll('.chapter-item').forEach((i) => i.classList.remove('drag-over'));
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        item.classList.add('drag-over');
      });

      item.addEventListener('dragleave', () => {
        item.classList.remove('drag-over');
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetIdx = parseInt(item.dataset.idx);
        if (dragSrcIdx !== null && dragSrcIdx !== targetIdx) {
          const chapters = state.get('outline.chapters');
          const [moved] = chapters.splice(dragSrcIdx, 1);
          chapters.splice(targetIdx, 0, moved);
          state.set('outline.chapters', chapters);
          this.refreshList();
        }
      });
    });
  },

  async handleGenerate() {
    const loadingEl = document.getElementById('outline-loading');
    const btnEl = document.getElementById('btn-generate-outline');

    loadingEl.style.display = 'block';
    btnEl.disabled = true;
    btnEl.textContent = '⏳ Generating...';

    try {
      const book = state.get('book');
      const prompt = outlinePrompt(book);
      const response = await generateText(prompt);
      const data = parseJsonResponse(response);

      if (data.chapters && Array.isArray(data.chapters)) {
        const chapters = data.chapters.map((ch) => ({
          id: uid(),
          title: ch.title || 'Tanpa Judul',
          sections: ch.sections || [],
        }));
        state.set('outline.chapters', chapters);
        showToast(`Kerangka berhasil dibuat! ${chapters.length} bab.`, 'success');
      } else {
        throw new Error('Format respons AI tidak sesuai.');
      }
    } catch (err) {
      showToast(`Gagal generate outline: ${err.message}`, 'error');
    } finally {
      loadingEl.style.display = 'none';
      btnEl.disabled = false;
      btnEl.textContent = '✨ Generate Kerangka dengan AI';
      this.refreshList();
    }
  },

  addChapter() {
    const chapters = state.get('outline.chapters') || [];
    chapters.push({
      id: uid(),
      title: `Bab ${chapters.length + 1}`,
      sections: ['Sub-bagian 1'],
    });
    state.set('outline.chapters', chapters);
    this.refreshList();
  },

  editSections(chapterId) {
    const chapters = state.get('outline.chapters');
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    // Inline modal for editing sections
    const overlay = document.getElementById('modal-overlay');
    const header = document.getElementById('modal-header');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    header.innerHTML = `<h2>Sub-bagian: ${escapeHtml(chapter.title)}</h2>`;
    body.innerHTML = `
      <p class="form-hint" style="margin-bottom: var(--space-md);">Satu sub-bagian per baris.</p>
      <textarea class="form-textarea" id="modal-sections-input" style="min-height: 200px;">${(chapter.sections || []).join('\n')}</textarea>
    `;
    footer.innerHTML = '';

    const btnCancel = document.createElement('button');
    btnCancel.className = 'btn btn-ghost';
    btnCancel.textContent = 'Batal';
    btnCancel.onclick = () => overlay.classList.add('hidden');

    const btnSave = document.createElement('button');
    btnSave.className = 'btn btn-primary';
    btnSave.textContent = 'Simpan';
    btnSave.onclick = () => {
      const newSections = document.getElementById('modal-sections-input').value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      chapter.sections = newSections;
      state.set('outline.chapters', chapters);
      overlay.classList.add('hidden');
      this.refreshList();
    };

    footer.appendChild(btnCancel);
    footer.appendChild(btnSave);
    overlay.classList.remove('hidden');
  },

  refreshList() {
    const container = document.getElementById('chapter-list-container');
    const chapters = state.get('outline.chapters') || [];

    if (container) {
      container.innerHTML = chapters.length > 0 ? this.renderChapterList(chapters) : this.renderEmptyState();
    }

    // Update stats
    const statChapters = document.getElementById('stat-chapters');
    const statSections = document.getElementById('stat-sections');
    if (statChapters) statChapters.textContent = chapters.length;
    if (statSections) statSections.textContent = chapters.reduce((s, c) => s + (c.sections?.length || 0), 0);

    // Re-attach listeners
    this.attachChapterListeners();
    this.attachDragListeners();

    // Show/hide clear button
    const addArea = document.querySelector('#btn-clear-outline')?.parentElement;
    if (addArea && chapters.length === 0) {
      const clearBtn = document.getElementById('btn-clear-outline');
      if (clearBtn) clearBtn.remove();
    }
  },

  validate() {
    const chapters = state.get('outline.chapters') || [];
    if (chapters.length === 0) {
      showToast('Silakan buat kerangka buku terlebih dahulu.', 'warning');
      return false;
    }

    // Update titles from inputs
    document.querySelectorAll('.chapter-title-input').forEach((input) => {
      const ch = chapters.find((c) => c.id === input.dataset.id);
      if (ch) ch.title = input.value;
    });
    state.set('outline.chapters', chapters);

    return true;
  },

  getData() {
    // Data already saved in state during editing
  },
};
