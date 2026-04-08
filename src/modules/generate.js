// ============================================================
// Generate Module — Step 3: AI Content Generation
// ============================================================

import { state } from '../state.js';
import { showToast, wordCount, sleep } from '../utils/helpers.js';
import { generateText } from '../services/gemini.js';
import { chapterPrompt, summaryPrompt } from '../utils/prompts.js';

let isGenerating = false;
let shouldStop = false;

export default {
  render() {
    const chapters = state.get('outline.chapters') || [];
    const content = state.get('content') || {};
    const generatedCount = chapters.filter((ch) => content[ch.id]?.generated).length;
    const totalWords = Object.values(content).reduce((s, c) => s + (c?.wordCount || 0), 0);

    return `
      <h2 class="step-title">⚡ Generate Konten</h2>
      <p class="step-subtitle">AI akan menulis konten setiap bab secara berurutan. Proses ini membutuhkan waktu beberapa menit tergantung jumlah bab.</p>

      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value" id="gen-stat-progress">${generatedCount}/${chapters.length}</span>
          <span class="stat-label">Bab Selesai</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="gen-stat-words">${totalWords.toLocaleString('id-ID')}</span>
          <span class="stat-label">Total Kata</span>
        </div>
        <div style="flex:1;"></div>
        <div style="display:flex; gap: var(--space-sm);">
          <button class="btn btn-primary" id="btn-start-generate" ${isGenerating ? 'disabled' : ''}>
            ${generatedCount > 0 && generatedCount < chapters.length ? '▶️ Lanjutkan Generate' : '✨ Mulai Generate'}
          </button>
          <button class="btn btn-danger btn-sm" id="btn-stop-generate" style="display:${isGenerating ? 'flex' : 'none'};">
            ⏹️ Stop
          </button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="card" style="margin-bottom: var(--space-lg);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-md);">
          <span style="font-size: var(--fs-sm); font-weight: 600;">Progress</span>
          <span style="font-size: var(--fs-sm); color: var(--text-secondary);" id="gen-percent">${chapters.length > 0 ? Math.round((generatedCount / chapters.length) * 100) : 0}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" id="gen-progress-fill" style="width: ${chapters.length > 0 ? (generatedCount / chapters.length) * 100 : 0}%;"></div>
        </div>
      </div>

      <!-- Generation Log -->
      <div class="generation-log" id="gen-log">
        ${chapters
          .map((ch, idx) => {
            const chContent = content[ch.id];
            let status = 'pending';
            let icon = '⏳';
            let detail = '';

            if (chContent?.generated) {
              status = 'done';
              icon = '✅';
              detail = `${chContent.wordCount.toLocaleString('id-ID')} kata`;
            }

            return `
            <div class="gen-log-entry" data-id="${ch.id}">
              <span class="gen-log-icon ${status}" id="gen-icon-${ch.id}">${icon}</span>
              <span style="flex:1;">Bab ${idx + 1}: ${ch.title}</span>
              <span style="font-size: 11px; color: var(--text-tertiary);" id="gen-detail-${ch.id}">${detail}</span>
            </div>
          `;
          })
          .join('')}
      </div>

      <!-- Current Generation Preview -->
      <div class="card" id="gen-preview-card" style="margin-top: var(--space-lg); display: none;">
        <div class="card-header">
          <h3 class="card-title" id="gen-preview-title">Generating...</h3>
          <span class="badge badge-purple" id="gen-preview-badge">Sedang menulis</span>
        </div>
        <div id="gen-preview-content" style="font-family: var(--font-serif); font-size: var(--fs-sm); color: var(--text-secondary); line-height: 1.8; max-height: 200px; overflow-y: auto;">
        </div>
      </div>
    `;
  },

  init() {
    document.getElementById('btn-start-generate')?.addEventListener('click', () => this.startGeneration());
    document.getElementById('btn-stop-generate')?.addEventListener('click', () => {
      shouldStop = true;
      showToast('Menghentikan generasi setelah bab saat ini selesai...', 'warning');
    });
  },

  async startGeneration() {
    if (isGenerating) return;

    isGenerating = true;
    shouldStop = false;

    const btnStart = document.getElementById('btn-start-generate');
    const btnStop = document.getElementById('btn-stop-generate');
    const previewCard = document.getElementById('gen-preview-card');

    btnStart.disabled = true;
    btnStart.textContent = '⏳ Sedang generate...';
    btnStop.style.display = 'flex';
    previewCard.style.display = 'block';

    const chapters = state.get('outline.chapters') || [];
    const book = state.get('book');
    let content = state.get('content') || {};
    let prevSummary = '';

    for (let i = 0; i < chapters.length; i++) {
      if (shouldStop) break;

      const chapter = chapters[i];

      // Skip already generated chapters
      if (content[chapter.id]?.generated) {
        // But still get summary for context
        if (content[chapter.id]?.text) {
          try {
            prevSummary = await this.generateSummary(chapter.title, content[chapter.id].text);
          } catch {
            prevSummary = content[chapter.id].text.substring(0, 500);
          }
        }
        continue;
      }

      // Update UI
      this.updateLogEntry(chapter.id, 'loading', '⌛', 'Menulis...');
      document.getElementById('gen-preview-title').textContent = `Bab ${i + 1}: ${chapter.title}`;
      document.getElementById('gen-preview-badge').textContent = 'Sedang menulis';
      document.getElementById('gen-preview-content').textContent = 'AI sedang menulis bab ini...';

      try {
        // Generate chapter content
        const prompt = chapterPrompt(book, chapter, i, prevSummary, chapters.length);
        const text = await generateText(prompt);

        // Save content
        const wc = wordCount(text);
        content[chapter.id] = {
          text: text,
          wordCount: wc,
          generated: true,
        };
        state.set('content', { ...content });

        // Update UI
        this.updateLogEntry(chapter.id, 'done', '✅', `${wc.toLocaleString('id-ID')} kata`);
        this.updateProgress(chapters, content);

        // Show preview
        document.getElementById('gen-preview-content').textContent = text.substring(0, 500) + '...';
        document.getElementById('gen-preview-badge').textContent = 'Selesai';

        // Generate summary for next chapter's context
        try {
          prevSummary = await this.generateSummary(chapter.title, text);
        } catch {
          prevSummary = text.substring(0, 500);
        }

        showToast(`Bab ${i + 1} selesai! (${wc} kata)`, 'success');
      } catch (err) {
        this.updateLogEntry(chapter.id, 'error', '❌', err.message);
        showToast(`Gagal generate Bab ${i + 1}: ${err.message}`, 'error');

        // Wait before continuing
        await sleep(5000);
      }
    }

    isGenerating = false;
    shouldStop = false;
    btnStart.disabled = false;

    const generatedCount = chapters.filter((ch) => content[ch.id]?.generated).length;
    if (generatedCount === chapters.length) {
      btnStart.textContent = '✅ Semua Bab Selesai';
      btnStart.disabled = true;
      previewCard.style.display = 'none';
      showToast('Semua bab berhasil di-generate! Lanjut ke Penyuntingan.', 'success');
    } else {
      btnStart.textContent = '▶️ Lanjutkan Generate';
    }

    btnStop.style.display = 'none';
  },

  async generateSummary(title, text) {
    const prompt = summaryPrompt(title, text);
    return await generateText(prompt);
  },

  updateLogEntry(id, status, icon, detail) {
    const iconEl = document.getElementById(`gen-icon-${id}`);
    const detailEl = document.getElementById(`gen-detail-${id}`);
    if (iconEl) {
      iconEl.className = `gen-log-icon ${status}`;
      iconEl.textContent = icon;
    }
    if (detailEl) detailEl.textContent = detail;
  },

  updateProgress(chapters, content) {
    const generatedCount = chapters.filter((ch) => content[ch.id]?.generated).length;
    const totalWords = Object.values(content).reduce((s, c) => s + (c?.wordCount || 0), 0);
    const percent = Math.round((generatedCount / chapters.length) * 100);

    const statProgress = document.getElementById('gen-stat-progress');
    const statWords = document.getElementById('gen-stat-words');
    const progressFill = document.getElementById('gen-progress-fill');
    const percentEl = document.getElementById('gen-percent');

    if (statProgress) statProgress.textContent = `${generatedCount}/${chapters.length}`;
    if (statWords) statWords.textContent = totalWords.toLocaleString('id-ID');
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (percentEl) percentEl.textContent = `${percent}%`;
  },

  validate() {
    const chapters = state.get('outline.chapters') || [];
    const content = state.get('content') || {};
    const generatedCount = chapters.filter((ch) => content[ch.id]?.generated).length;

    if (generatedCount === 0) {
      showToast('Silakan generate konten minimal 1 bab terlebih dahulu.', 'warning');
      return false;
    }

    return true;
  },

  getData() {},

  destroy() {
    shouldStop = true;
    isGenerating = false;
  },
};
