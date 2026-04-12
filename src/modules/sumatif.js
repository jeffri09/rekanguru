// ============================================================
// Sumatif Module — Pembuatan Soal Sumatif
// ============================================================

import { state } from '../state.js';
import { showToast, escapeHtml } from '../utils/helpers.js';
import { generateText, parseJsonResponse } from '../services/gemini.js';
import { pgPrompt, isianPrompt, esaiPrompt, mencocokkanPrompt } from '../utils/sumatif-prompt.js';
import { buildSumatifDocx } from '../services/sumatif-docx.js';

let generatedData = null; // { pilihan_ganda, isian_singkat, esai, mencocokkan }

const TYPE_CONFIG = {
  pilihan_ganda: { label: 'Pilihan Ganda', icon: '🔘', desc: 'Soal dengan pilihan jawaban A-E' },
  isian_singkat: { label: 'Isian Singkat', icon: '✏️', desc: 'Soal dengan jawaban singkat 1-3 kata' },
  esai: { label: 'Esai / Uraian', icon: '📝', desc: 'Soal uraian memerlukan penjelasan panjang' },
  mencocokkan: { label: 'Mencocokkan', icon: '🔗', desc: 'Menjodohkan pernyataan dengan jawaban' },
};

const DIFFICULTY_LEVELS = [
  { value: 'sangat_mudah', label: 'Sangat Mudah', emoji: '🟢', desc: 'Hafalan dasar' },
  { value: 'mudah', label: 'Mudah', emoji: '🔵', desc: 'Pemahaman' },
  { value: 'sedang', label: 'Sedang', emoji: '🟡', desc: 'Penerapan' },
  { value: 'sulit', label: 'Sulit', emoji: '🟠', desc: 'Analisis' },
  { value: 'sangat_sulit', label: 'Sangat Sulit', emoji: '🔴', desc: 'HOTS' },
];

export function renderSumatifPage() {
  const sm = state.get('sumatif');

  return `
    <div class="step-container">
      <div style="display:flex; align-items:center; gap: var(--space-md); margin-bottom: var(--space-sm);">
        <button class="btn btn-ghost btn-sm" id="btn-sm-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Menu Utama
        </button>
      </div>

      <h2 class="step-title">📝 Pembuatan Soal Sumatif</h2>
      <p class="step-subtitle">Buat soal ujian sumatif dengan AI. Pilih jenis soal, atur tingkat kesulitan & jumlah soal, lalu generate dan download sebagai file Word (.docx).</p>

      <div class="sm-layout">
        <!-- Left Panel: Form -->
        <div class="sm-form-panel">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">📋 Pengaturan Soal</h3>
            </div>

            <!-- IDENTITAS -->
            <div class="form-group">
              <label class="form-label" for="sm-topic">Topik / Materi Soal <span class="required">*</span></label>
              <textarea class="form-textarea" id="sm-topic" placeholder="Contoh: Sistem peredaran darah manusia, jantung, pembuluh darah, sel darah..."
                style="min-height: 100px;">${sm.topic || ''}</textarea>
              <p class="form-hint">Jelaskan topik/materi yang ingin dijadikan soal. Semakin detail, semakin relevan hasilnya.</p>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="sm-subject">Mata Pelajaran</label>
                <input class="form-input" id="sm-subject" type="text" placeholder="Contoh: IPA, Matematika..." value="${sm.subject || ''}" />
              </div>
              <div class="form-group">
                <label class="form-label" for="sm-class">Fase / Kelas</label>
                <input class="form-input" id="sm-class" type="text" placeholder="Contoh: Fase D / Kelas 7" value="${sm.classPhase || ''}" />
              </div>
            </div>

            <!-- JENIS SOAL -->
            <div class="form-group">
              <label class="form-label">Aktifkan Jenis Soal</label>
              <p class="form-hint" style="margin-bottom: var(--space-md);">Pilih jenis soal yang ingin dibuat. Anda bisa mengaktifkan lebih dari satu.</p>
              
              <div class="soal-types-list">
                ${Object.entries(TYPE_CONFIG).map(([key, cfg]) => `
                  <div class="soal-type-card ${sm.enabledTypes[key] ? 'active' : ''}" data-type="${key}">
                    <div class="soal-type-header">
                      <label class="soal-type-toggle">
                        <input type="checkbox" class="soal-type-checkbox" data-type="${key}" ${sm.enabledTypes[key] ? 'checked' : ''} />
                        <span class="soal-type-switch"></span>
                      </label>
                      <span class="soal-type-icon">${cfg.icon}</span>
                      <div class="soal-type-info">
                        <span class="soal-type-label">${cfg.label}</span>
                        <small class="soal-type-desc">${cfg.desc}</small>
                      </div>
                    </div>

                    <div class="soal-type-options" style="display: ${sm.enabledTypes[key] ? 'block' : 'none'};">
                      ${key === 'pilihan_ganda' ? `
                        <div class="form-group" style="margin-top: var(--space-md);">
                          <label class="form-label">Jumlah Pilihan Jawaban</label>
                          <div class="pg-option-chips">
                            <label class="pg-option-chip ${sm.pgOptionCount === 3 ? 'active' : ''}">
                              <input type="radio" name="pg-options" value="3" ${sm.pgOptionCount === 3 ? 'checked' : ''}>
                              <span>A – C</span>
                            </label>
                            <label class="pg-option-chip ${sm.pgOptionCount === 4 ? 'active' : ''}">
                              <input type="radio" name="pg-options" value="4" ${sm.pgOptionCount === 4 ? 'checked' : ''}>
                              <span>A – D</span>
                            </label>
                            <label class="pg-option-chip ${sm.pgOptionCount === 5 ? 'active' : ''}">
                              <input type="radio" name="pg-options" value="5" ${sm.pgOptionCount === 5 ? 'checked' : ''}>
                              <span>A – E</span>
                            </label>
                          </div>
                        </div>
                      ` : ''}

                      <div class="form-group" style="margin-top: var(--space-md);">
                        <label class="form-label">Tingkat Kesulitan</label>
                        <div class="difficulty-grid" id="diff-grid-${key}">
                          ${DIFFICULTY_LEVELS.map(d => `
                            <label class="difficulty-chip ${sm.difficulty[key] === d.value ? 'active' : ''}">
                              <input type="radio" name="diff-${key}" value="${d.value}" ${sm.difficulty[key] === d.value ? 'checked' : ''}>
                              <span class="difficulty-emoji">${d.emoji}</span>
                              <span>${d.label}</span>
                              <small>${d.desc}</small>
                            </label>
                          `).join('')}
                        </div>
                      </div>

                      <div class="form-group" style="margin-top: var(--space-md);">
                        <label class="form-label" for="sm-count-${key}">Jumlah Soal</label>
                        <input class="form-input sm-count-input" id="sm-count-${key}" type="number" min="1" max="50" value="${sm.questionCount[key] || 5}" data-type="${key}" />
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- GENERATE BUTTON -->
            <div style="display:flex; gap: var(--space-sm); margin-top: var(--space-lg);">
              <button class="btn btn-primary" id="btn-sm-generate" style="flex:1;">
                ✨ Generate Soal
              </button>
            </div>
          </div>

          <!-- Download area -->
          <div id="sm-download-area" style="margin-top: var(--space-lg); display: ${generatedData ? 'block' : 'none'};">
            <button class="btn btn-success btn-lg" id="btn-sm-download" style="width: 100%;">
              📥 Download Word (.docx)
            </button>
            <p style="text-align:center; margin-top: var(--space-sm); font-size: var(--fs-xs); color: var(--text-tertiary);">
              Soal lengkap + kunci jawaban di halaman terakhir
            </p>
          </div>
        </div>

        <!-- Right Panel: Preview -->
        <div class="sm-preview-panel">
          <div class="card" style="padding: 0; overflow: hidden;">
            <div style="padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
              <h3 class="card-title" style="font-size: var(--fs-sm);">📄 Preview Soal</h3>
            </div>
            <div id="sm-preview-content" class="sm-preview-area">
              ${generatedData ? renderPreview(generatedData, state.get('sumatif')) : `
                <div class="empty-state" style="padding: var(--space-2xl);">
                  <div class="empty-state-icon">📝</div>
                  <div class="empty-state-title">Belum ada soal</div>
                  <div class="empty-state-text">Pilih jenis soal, atur kesulitan & jumlah, lalu klik Generate.</div>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ====== PREVIEW RENDERER ======
function renderPreview(data, config) {
  let html = '';
  const enabledTypes = config.enabledTypes || {};
  let sectionNum = 1;

  // PG Preview
  if (enabledTypes.pilihan_ganda && data.pilihan_ganda?.questions) {
    html += `<div class="sm-preview-section">
      <h4 class="sm-preview-section-title">${sectionNum}. Pilihan Ganda</h4>`;
    for (const q of data.pilihan_ganda.questions) {
      html += `<div class="sm-preview-question">
        <div class="sm-preview-q-num">${q.number}</div>
        <div class="sm-preview-q-body">
          <p>${escapeHtml(q.question)}</p>
          <div class="sm-preview-options">`;
      for (const [letter, text] of Object.entries(q.options || {})) {
        const isCorrect = q.answer === letter;
        html += `<div class="sm-preview-option ${isCorrect ? 'correct' : ''}">
          <span class="sm-option-letter">${letter}</span>
          <span>${escapeHtml(text)}</span>
        </div>`;
      }
      html += `</div></div></div>`;
    }
    html += `</div>`;
    sectionNum++;
  }

  // Isian Preview
  if (enabledTypes.isian_singkat && data.isian_singkat?.questions) {
    html += `<div class="sm-preview-section">
      <h4 class="sm-preview-section-title">${sectionNum}. Isian Singkat</h4>`;
    for (const q of data.isian_singkat.questions) {
      html += `<div class="sm-preview-question">
        <div class="sm-preview-q-num">${q.number}</div>
        <div class="sm-preview-q-body">
          <p>${escapeHtml(q.question)}</p>
          <div class="sm-preview-answer-hint">Jawaban: <em>${escapeHtml(q.answer)}</em></div>
        </div>
      </div>`;
    }
    html += `</div>`;
    sectionNum++;
  }

  // Esai Preview
  if (enabledTypes.esai && data.esai?.questions) {
    html += `<div class="sm-preview-section">
      <h4 class="sm-preview-section-title">${sectionNum}. Esai / Uraian</h4>`;
    for (const q of data.esai.questions) {
      html += `<div class="sm-preview-question">
        <div class="sm-preview-q-num">${q.number}</div>
        <div class="sm-preview-q-body">
          <p>${escapeHtml(q.question)}</p>
          ${q.points ? `<span class="sm-preview-points">${q.points} poin</span>` : ''}
          <div class="sm-preview-answer-hint" style="margin-top:8px;">
            <strong>Kunci:</strong> ${escapeHtml((q.answer || '').substring(0, 150))}${(q.answer || '').length > 150 ? '...' : ''}
          </div>
        </div>
      </div>`;
    }
    html += `</div>`;
    sectionNum++;
  }

  // Mencocokkan Preview
  if (enabledTypes.mencocokkan && data.mencocokkan?.pairs) {
    html += `<div class="sm-preview-section">
      <h4 class="sm-preview-section-title">${sectionNum}. Mencocokkan</h4>
      <div class="sm-preview-matching">
        <div class="sm-matching-col">
          <div class="sm-matching-col-title">Pernyataan</div>`;
    for (const p of data.mencocokkan.pairs) {
      html += `<div class="sm-matching-item">${p.number}. ${escapeHtml(p.left)}</div>`;
    }
    html += `</div><div class="sm-matching-col">
          <div class="sm-matching-col-title">Jawaban</div>`;
    // Shuffle answers for preview
    const allAnswers = [
      ...(data.mencocokkan.pairs || []).map(p => p.right),
      ...(data.mencocokkan.distractors || []),
    ];
    const shuffled = [...allAnswers].sort(() => Math.random() - 0.5);
    const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'];
    shuffled.forEach((ans, i) => {
      html += `<div class="sm-matching-item">${letters[i] || (i+1)}. ${escapeHtml(ans)}</div>`;
    });
    html += `</div></div></div>`;
  }

  // Stats
  let totalQ = 0;
  if (data.pilihan_ganda?.questions) totalQ += data.pilihan_ganda.questions.length;
  if (data.isian_singkat?.questions) totalQ += data.isian_singkat.questions.length;
  if (data.esai?.questions) totalQ += data.esai.questions.length;
  if (data.mencocokkan?.pairs) totalQ += data.mencocokkan.pairs.length;
  html += `<div style="text-align:center; padding: var(--space-lg); font-size: var(--fs-xs); color: var(--text-tertiary);">
    Total: ${totalQ} soal berhasil di-generate ✅
  </div>`;

  return html;
}


// ====== INIT ======
export function initSumatifPage() {
  // Back button
  document.getElementById('btn-sm-back')?.addEventListener('click', () => {
    state.set('currentView', 'dashboard');
    window.dispatchEvent(new Event('viewchange'));
  });

  // Toggle type checkboxes
  document.querySelectorAll('.soal-type-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const type = cb.dataset.type;
      const card = cb.closest('.soal-type-card');
      const options = card?.querySelector('.soal-type-options');

      if (cb.checked) {
        card?.classList.add('active');
        if (options) options.style.display = 'block';
      } else {
        card?.classList.remove('active');
        if (options) options.style.display = 'none';
      }
    });
  });

  // PG option count radios
  document.querySelectorAll('input[name="pg-options"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.pg-option-chip').forEach(c => c.classList.remove('active'));
      radio.closest('.pg-option-chip')?.classList.add('active');
    });
  });

  // Difficulty chip selections per type
  Object.keys(TYPE_CONFIG).forEach(type => {
    document.querySelectorAll(`input[name="diff-${type}"]`).forEach(radio => {
      radio.addEventListener('change', () => {
        const grid = document.getElementById(`diff-grid-${type}`);
        grid?.querySelectorAll('.difficulty-chip').forEach(c => c.classList.remove('active'));
        radio.closest('.difficulty-chip')?.classList.add('active');
      });
    });
  });

  // Generate button
  document.getElementById('btn-sm-generate')?.addEventListener('click', handleGenerate);

  // Download button
  document.getElementById('btn-sm-download')?.addEventListener('click', handleDownload);
}


// ====== GENERATE ======
async function handleGenerate() {
  const topic = document.getElementById('sm-topic')?.value?.trim();
  if (!topic) {
    showToast('Topik/materi soal wajib diisi!', 'warning');
    document.getElementById('sm-topic')?.focus();
    return;
  }

  const subject = document.getElementById('sm-subject')?.value?.trim() || '';
  const classPhase = document.getElementById('sm-class')?.value?.trim() || '';

  // Gather enabled types
  const enabledTypes = {};
  document.querySelectorAll('.soal-type-checkbox').forEach(cb => {
    enabledTypes[cb.dataset.type] = cb.checked;
  });

  const anyEnabled = Object.values(enabledTypes).some(v => v);
  if (!anyEnabled) {
    showToast('Aktifkan minimal 1 jenis soal!', 'warning');
    return;
  }

  // Gather difficulties
  const difficulty = {};
  Object.keys(TYPE_CONFIG).forEach(type => {
    const checked = document.querySelector(`input[name="diff-${type}"]:checked`);
    difficulty[type] = checked?.value || 'sedang';
  });

  // Gather counts
  const questionCount = {};
  Object.keys(TYPE_CONFIG).forEach(type => {
    const input = document.getElementById(`sm-count-${type}`);
    questionCount[type] = parseInt(input?.value) || 5;
  });

  // PG option count
  const pgOptionCount = parseInt(document.querySelector('input[name="pg-options"]:checked')?.value) || 4;

  // Save state
  state.set('sumatif.topic', topic);
  state.set('sumatif.subject', subject);
  state.set('sumatif.classPhase', classPhase);
  state.set('sumatif.enabledTypes', enabledTypes);
  state.set('sumatif.difficulty', difficulty);
  state.set('sumatif.questionCount', questionCount);
  state.set('sumatif.pgOptionCount', pgOptionCount);

  // UI feedback
  const btn = document.getElementById('btn-sm-generate');
  btn.disabled = true;
  btn.innerHTML = '<div class="loading-spinner" style="width:16px; height:16px; border-width:2px;"></div> <span>Generating...</span>';

  const previewArea = document.getElementById('sm-preview-content');
  previewArea.innerHTML = `
    <div class="empty-state" style="padding: var(--space-2xl);">
      <div class="loading-spinner" style="margin: 0 auto var(--space-md);"></div>
      <div class="empty-state-title">AI sedang membuat soal...</div>
      <div class="empty-state-text">Menghasilkan soal sesuai pengaturan Anda.</div>
    </div>
  `;

  const results = {};
  const typesToGenerate = Object.entries(enabledTypes).filter(([, v]) => v).map(([k]) => k);

  try {
    for (let i = 0; i < typesToGenerate.length; i++) {
      const type = typesToGenerate[i];
      const typeLabel = TYPE_CONFIG[type]?.label || type;

      // Update progress
      previewArea.innerHTML = `
        <div class="empty-state" style="padding: var(--space-2xl);">
          <div class="loading-spinner" style="margin: 0 auto var(--space-md);"></div>
          <div class="empty-state-title">Membuat ${typeLabel}...</div>
          <div class="empty-state-text">Proses ${i + 1} dari ${typesToGenerate.length} jenis soal</div>
        </div>
      `;

      let prompt;
      switch (type) {
        case 'pilihan_ganda':
          prompt = pgPrompt(topic, subject, classPhase, difficulty[type], questionCount[type], pgOptionCount);
          break;
        case 'isian_singkat':
          prompt = isianPrompt(topic, subject, classPhase, difficulty[type], questionCount[type]);
          break;
        case 'esai':
          prompt = esaiPrompt(topic, subject, classPhase, difficulty[type], questionCount[type]);
          break;
        case 'mencocokkan':
          prompt = mencocokkanPrompt(topic, subject, classPhase, difficulty[type], questionCount[type]);
          break;
      }

      const response = await generateText(prompt);
      const parsed = parseJsonResponse(response);
      results[type] = parsed;

      showToast(`${typeLabel}: ${type === 'mencocokkan' ? (parsed.pairs?.length || 0) : (parsed.questions?.length || 0)} soal ✅`, 'info');
    }

    generatedData = results;

    // Update preview
    previewArea.innerHTML = renderPreview(results, { enabledTypes });

    // Show download area
    document.getElementById('sm-download-area').style.display = 'block';

    showToast('Semua soal berhasil di-generate! 🎉', 'success');

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
    btn.innerHTML = '✨ Generate Soal';
  }
}


// ====== DOWNLOAD ======
async function handleDownload() {
  if (!generatedData) {
    showToast('Generate soal terlebih dahulu.', 'warning');
    return;
  }

  const btn = document.getElementById('btn-sm-download');
  btn.disabled = true;
  btn.innerHTML = '<div class="loading-spinner" style="width:16px; height:16px; border-width:2px;"></div> <span>Membuat Word...</span>';

  try {
    const sm = state.get('sumatif');
    const filename = await buildSumatifDocx(generatedData, {
      topic: sm.topic,
      subject: sm.subject,
      classPhase: sm.classPhase,
      enabledTypes: sm.enabledTypes,
    });
    showToast(`File berhasil diunduh: "${filename}" 🎉`, 'success');
  } catch (err) {
    showToast(`Gagal download: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '📥 Download Word (.docx)';
  }
}
