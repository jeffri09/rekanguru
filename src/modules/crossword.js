// ============================================================
// Crossword Module — Teka-Teki Silang Generator
// ============================================================

import { state } from '../state.js';
import { showToast, escapeHtml } from '../utils/helpers.js';
import { generateText, parseJsonResponse } from '../services/gemini.js';
import { crosswordPrompt } from '../utils/crossword-prompt.js';
import { buildCrossword } from '../utils/crossword-engine.js';
import { buildCrosswordExcel } from '../services/excel-builder.js';

let crosswordResult = null;

export function renderCrosswordPage() {
  const cw = state.get('crossword');

  return `
    <div class="step-container">
      <div style="display:flex; align-items:center; gap: var(--space-md); margin-bottom: var(--space-sm);">
        <button class="btn btn-ghost btn-sm" id="btn-cw-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Menu Utama
        </button>
      </div>

      <h2 class="step-title">🧩 Generator Teka-Teki Silang</h2>
      <p class="step-subtitle">Buat TTS edukatif dari materi pelajaran. AI akan membuat kata-kata dan petunjuk, lalu menyusunnya menjadi TTS yang bisa di-download sebagai Excel.</p>

      <div class="cw-layout">
        <!-- Form -->
        <div class="cw-form-panel">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">📋 Pengaturan TTS</h3>
            </div>

            <div class="form-group">
              <label class="form-label" for="cw-topic">Ruang Lingkup Materi <span class="required">*</span></label>
              <textarea class="form-textarea" id="cw-topic" placeholder="Contoh: Sistem tata surya, planet-planet, satelit, matahari, orbit, dan gravitasi..."
                style="min-height: 120px;">${cw.topic || ''}</textarea>
              <p class="form-hint">Jelaskan topik atau materi yang ingin dijadikan TTS. Semakin detail, semakin relevan hasilnya.</p>
            </div>

            <div class="form-group">
              <label class="form-label" for="cw-wordcount">Jumlah Soal</label>
              <input class="form-input" id="cw-wordcount" type="number" min="3" max="30" value="${cw.wordCount || 10}" placeholder="10" />
              <p class="form-hint">Jumlah soal/kata dalam TTS (3-30 soal).</p>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="cw-clue-lang">🗣️ Bahasa Petunjuk</label>
                <select class="form-select" id="cw-clue-lang">
                  <option value="id" ${cw.clueLang === 'id' ? 'selected' : ''}>🇮🇩 Indonesia</option>
                  <option value="en" ${cw.clueLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                  <option value="ar" ${cw.clueLang === 'ar' ? 'selected' : ''}>🇸🇦 Arab (tanpa harakat)</option>
                  <option value="ar_h" ${cw.clueLang === 'ar_h' ? 'selected' : ''}>🇸🇦 Arab (dengan harakat)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="cw-answer-lang">✏️ Bahasa Jawaban</label>
                <select class="form-select" id="cw-answer-lang">
                  <option value="id" ${cw.answerLang === 'id' ? 'selected' : ''}>🇮🇩 Indonesia</option>
                  <option value="en" ${cw.answerLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                  <option value="ar" ${cw.answerLang === 'ar' ? 'selected' : ''}>🇸🇦 Arab (tanpa harakat)</option>
                  <option value="ar_h" ${cw.answerLang === 'ar_h' ? 'selected' : ''}>🇸🇦 Arab (dengan harakat)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="cw-difficulty">Tingkat Kesulitan Petunjuk</label>
              <div class="difficulty-grid" id="cw-difficulty-grid">
                <label class="difficulty-chip ${cw.difficulty === 'sangat_mudah' ? 'active' : ''}">
                  <input type="radio" name="cw-difficulty" value="sangat_mudah" ${cw.difficulty === 'sangat_mudah' ? 'checked' : ''}>
                  <span class="difficulty-emoji">🟢</span>
                  <span>Sangat Mudah</span>
                  <small>Petunjuk sangat jelas</small>
                </label>
                <label class="difficulty-chip ${cw.difficulty === 'mudah' ? 'active' : ''}">
                  <input type="radio" name="cw-difficulty" value="mudah" ${cw.difficulty === 'mudah' ? 'checked' : ''}>
                  <span class="difficulty-emoji">🔵</span>
                  <span>Mudah</span>
                  <small>Definisi langsung</small>
                </label>
                <label class="difficulty-chip ${cw.difficulty === 'sedang' ? 'active' : ''}">
                  <input type="radio" name="cw-difficulty" value="sedang" ${cw.difficulty === 'sedang' ? 'checked' : ''}>
                  <span class="difficulty-emoji">🟡</span>
                  <span>Sedang</span>
                  <small>Perlu berpikir</small>
                </label>
                <label class="difficulty-chip ${cw.difficulty === 'sulit' ? 'active' : ''}">
                  <input type="radio" name="cw-difficulty" value="sulit" ${cw.difficulty === 'sulit' ? 'checked' : ''}>
                  <span class="difficulty-emoji">🟠</span>
                  <span>Sulit</span>
                  <small>Perlu penalaran</small>
                </label>
                <label class="difficulty-chip ${cw.difficulty === 'sangat_sulit' ? 'active' : ''}">
                  <input type="radio" name="cw-difficulty" value="sangat_sulit" ${cw.difficulty === 'sangat_sulit' ? 'checked' : ''}>
                  <span class="difficulty-emoji">🔴</span>
                  <span>Sangat Sulit</span>
                  <small>Abstrak & kiasan</small>
                </label>
              </div>
            </div>

            <div style="display:flex; gap: var(--space-sm);">
              <button class="btn btn-primary" id="btn-cw-generate" style="flex:1;">
                ✨ Generate TTS
              </button>
            </div>
          </div>

          <!-- Download button (appears after generation) -->
          <div id="cw-download-area" style="margin-top: var(--space-lg); display: ${crosswordResult ? 'block' : 'none'};">
            <button class="btn btn-success btn-lg" id="btn-cw-download" style="width: 100%;">
              📥 Download Excel (.xlsx)
            </button>
            <p style="text-align:center; margin-top: var(--space-sm); font-size: var(--fs-xs); color: var(--text-tertiary);">
              Berisi 3 sheet: Soal, Kunci Jawaban, dan Petunjuk
            </p>
          </div>
        </div>

        <!-- Preview -->
        <div class="cw-preview-panel">
          <div class="card" style="padding: 0; overflow: hidden;">
            <div style="padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
              <h3 class="card-title" style="font-size: var(--fs-sm);">🧩 Preview TTS</h3>
            </div>
            <div id="cw-preview-content" class="cw-preview-area">
              ${crosswordResult ? renderCrosswordPreview(crosswordResult) : `
                <div class="empty-state" style="padding: var(--space-2xl);">
                  <div class="empty-state-icon">🧩</div>
                  <div class="empty-state-title">Belum ada TTS</div>
                  <div class="empty-state-text">Isi ruang lingkup materi, pilih kesulitan, lalu klik Generate.</div>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCrosswordPreview(result) {
  const { grid, placedWords, rows, cols, title } = result;

  // Build number map
  const numberMap = new Map();
  for (const pw of placedWords) {
    const key = `${pw.row},${pw.col}`;
    if (!numberMap.has(key)) numberMap.set(key, pw.number);
  }

  let gridHtml = `<div class="cw-grid-title">${escapeHtml(title || 'Teka-Teki Silang')}</div>`;
  gridHtml += `<div class="cw-grid-wrapper"><div class="cw-grid" style="grid-template-columns: repeat(${cols}, 1fr);">`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '') {
        const num = numberMap.get(`${r},${c}`);
        gridHtml += `<div class="cw-cell active">${num ? `<span class="cw-cell-num">${num}</span>` : ''}<span class="cw-cell-letter">${grid[r][c]}</span></div>`;
      } else {
        gridHtml += `<div class="cw-cell blocked"></div>`;
      }
    }
  }
  gridHtml += `</div></div>`;

  // Clues
  const acrossWords = placedWords.filter(w => w.direction === 'across').sort((a, b) => a.number - b.number);
  const downWords = placedWords.filter(w => w.direction === 'down').sort((a, b) => a.number - b.number);

  gridHtml += `<div class="cw-clues">`;
  gridHtml += `<div class="cw-clue-group"><h4>➡️ Mendatar</h4>`;
  for (const w of acrossWords) {
    gridHtml += `<div class="cw-clue-item"><strong>${w.number}.</strong> ${escapeHtml(w.clue)} <small>(${w.word.length} huruf)</small></div>`;
  }
  gridHtml += `</div>`;
  gridHtml += `<div class="cw-clue-group"><h4>⬇️ Menurun</h4>`;
  for (const w of downWords) {
    gridHtml += `<div class="cw-clue-item"><strong>${w.number}.</strong> ${escapeHtml(w.clue)} <small>(${w.word.length} huruf)</small></div>`;
  }
  gridHtml += `</div></div>`;

  gridHtml += `<div style="text-align:center; margin-top: var(--space-md); font-size: var(--fs-xs); color: var(--text-tertiary);">${placedWords.length} soal berhasil disusun</div>`;

  // === KUNCI JAWABAN ===
  gridHtml += `<div class="section-divider" style="margin-top: var(--space-xl);">🔑 KUNCI JAWABAN</div>`;
  gridHtml += `<div class="cw-grid-wrapper"><div class="cw-grid" style="grid-template-columns: repeat(${cols}, 1fr);">`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== '') {
        gridHtml += `<div class="cw-cell active" style="background: rgba(16,185,129,0.15);"><span class="cw-cell-letter" style="opacity:1; color: var(--accent-success);">${grid[r][c]}</span></div>`;
      } else {
        gridHtml += `<div class="cw-cell blocked"></div>`;
      }
    }
  }
  gridHtml += `</div></div>`;

  // Answer list
  gridHtml += `<div style="margin-top: var(--space-md); font-size: var(--fs-xs); color: var(--text-secondary);">`;
  gridHtml += `<div style="margin-bottom: 4px;"><strong>Mendatar:</strong> ${acrossWords.map(w => `${w.number}. ${w.word}`).join(' &nbsp;|&nbsp; ')}</div>`;
  gridHtml += `<div><strong>Menurun:</strong> ${downWords.map(w => `${w.number}. ${w.word}`).join(' &nbsp;|&nbsp; ')}</div>`;
  gridHtml += `</div>`;

  return gridHtml;
}

export function initCrosswordPage() {
  // Back button
  document.getElementById('btn-cw-back')?.addEventListener('click', () => {
    state.set('currentView', 'dashboard');
    window.dispatchEvent(new Event('viewchange'));
  });

  // Difficulty selection
  document.querySelectorAll('input[name="cw-difficulty"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.difficulty-chip').forEach(c => c.classList.remove('active'));
      radio.closest('.difficulty-chip').classList.add('active');
    });
  });

  // Generate button
  document.getElementById('btn-cw-generate')?.addEventListener('click', handleGenerate);

  // Download button
  document.getElementById('btn-cw-download')?.addEventListener('click', handleDownload);
}

async function handleGenerate() {
  const topic = document.getElementById('cw-topic')?.value?.trim();
  if (!topic) {
    showToast('Ruang lingkup materi wajib diisi!', 'warning');
    document.getElementById('cw-topic')?.focus();
    return;
  }

  const difficulty = document.querySelector('input[name="cw-difficulty"]:checked')?.value || 'sedang';
  const wordCount = parseInt(document.getElementById('cw-wordcount')?.value) || 10;
  const clueLang = document.getElementById('cw-clue-lang')?.value || 'id';
  const answerLang = document.getElementById('cw-answer-lang')?.value || 'id';

  // API key check removed — server proxy will be used if no user key is set

  const btn = document.getElementById('btn-cw-generate');
  btn.disabled = true;
  btn.innerHTML = '<div class="loading-spinner" style="width:16px; height:16px; border-width:2px;"></div> <span>Generating...</span>';

  const previewArea = document.getElementById('cw-preview-content');
  previewArea.innerHTML = `
    <div class="empty-state" style="padding: var(--space-2xl);">
      <div class="loading-spinner" style="margin: 0 auto var(--space-md);"></div>
      <div class="empty-state-title">AI sedang membuat TTS...</div>
      <div class="empty-state-text">Menghasilkan kata-kata dan petunjuk dari materi Anda.</div>
    </div>
  `;

  try {
    // Step 1: AI generates words + clues
    const prompt = crosswordPrompt(topic, difficulty, wordCount, clueLang, answerLang);
    const response = await generateText(prompt);
    const data = parseJsonResponse(response);

    if (!data.words || !Array.isArray(data.words) || data.words.length === 0) {
      throw new Error('AI tidak menghasilkan kata-kata yang valid.');
    }

    showToast(`${data.words.length} kata didapat dari AI. Menyusun grid...`, 'info');

    // Step 2: Build crossword grid
    const result = buildCrossword(data.words);
    if (!result || result.totalPlaced < 2) {
      throw new Error('Gagal menyusun grid TTS. Coba generate ulang.');
    }

    result.title = data.title || 'Teka-Teki Silang';
    crosswordResult = result;

    // Save state
    state.set('crossword.topic', topic);
    state.set('crossword.difficulty', difficulty);
    state.set('crossword.wordCount', wordCount);
    state.set('crossword.clueLang', clueLang);
    state.set('crossword.answerLang', answerLang);

    // Update preview
    previewArea.innerHTML = renderCrosswordPreview(result);

    // Show download area
    document.getElementById('cw-download-area').style.display = 'block';

    showToast(`TTS berhasil! ${result.totalPlaced} dari ${result.totalAttempted} kata tersusun.`, 'success');

  } catch (err) {
    showToast(`Gagal: ${err.message}`, 'error');
    previewArea.innerHTML = `
      <div class="empty-state" style="padding: var(--space-2xl);">
        <div class="empty-state-icon">❌</div>
        <div class="empty-state-title">Gagal Generate</div>
        <div class="empty-state-text">${escapeHtml(err.message)}</div>
      </div>
    `;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '✨ Generate TTS';
  }
}

async function handleDownload() {
  if (!crosswordResult) {
    showToast('Generate TTS terlebih dahulu.', 'warning');
    return;
  }

  const btn = document.getElementById('btn-cw-download');
  btn.disabled = true;
  btn.innerHTML = '<div class="loading-spinner" style="width:16px; height:16px; border-width:2px;"></div> <span>Membuat Excel...</span>';

  try {
    const filename = await buildCrosswordExcel(crosswordResult);
    showToast(`TTS berhasil diunduh sebagai "${filename}" 🎉`, 'success');
  } catch (err) {
    showToast(`Gagal download: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '📥 Download Excel (.xlsx)';
  }
}
