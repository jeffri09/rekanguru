import { state } from '../state.js';
import { showToast, escapeHtml } from '../utils/helpers.js';
import { generateText, parseJsonResponse } from '../services/gemini.js';
import { lccSoalPrompt, generatePosterPrompt } from '../utils/lcc-prompt.js';
import { buildLccDocx } from '../services/lcc-docx.js';

let generatedSoalData = null; // Array of results

export function renderLccPage() {
  const lcc = state.get('lcc');
  const activeTab = lcc.activeTab || 'soal';

  return `
    <div class="step-container">
      <div style="display:flex; align-items:center; gap: var(--space-md); margin-bottom: var(--space-sm);">
        <button class="btn btn-ghost btn-sm" id="btn-lcc-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Menu Utama
        </button>
      </div>

      <h2 class="step-title">🏆 Lomba Cerdas Cermat</h2>
      <p class="step-subtitle">Buat soal kompetisi cerdas cermat dari fase Playoff hingga Final, dan hasilkan prompt poster AI untuk publikasi lomba.</p>

      <div class="lcc-tabs" style="display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); border-bottom: 1px solid var(--border-subtle); padding-bottom: var(--space-sm);">
        <button class="btn ${activeTab === 'soal' ? 'btn-primary' : 'btn-ghost'} btn-tab" data-tab="soal">📝 Pembuat Soal Lomba</button>
        <button class="btn ${activeTab === 'poster' ? 'btn-primary' : 'btn-ghost'} btn-tab" data-tab="poster">🖼️ Prompt Poster Lomba</button>
      </div>

      <div class="lcc-tab-content">
        ${activeTab === 'soal' ? renderSoalTab(lcc) : renderPosterTab(lcc)}
      </div>
    </div>
  `;
}

function renderSoalTab(lcc) {
  const isPlayoff = lcc.phase === 'playoff';

  return `
    <div class="sm-layout">
      <!-- Left Panel: Form -->
      <div class="sm-form-panel">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">📋 Pengaturan Soal LCC</h3>
          </div>

          <div class="form-group">
            <label class="form-label">Babak / Fase Lomba</label>
            <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap;">
              ${['playoff', '8besar', '4besar', 'final'].map(p => `
                <label class="toggle-chip ${lcc.phase === p ? 'active' : ''}">
                  <input type="radio" name="lcc-phase" value="${p}" ${lcc.phase === p ? 'checked' : ''} hidden>
                  ${p === 'playoff' ? 'Playoff' : p === '8besar' ? '8 Besar' : p === '4besar' ? '4 Besar' : 'Final'}
                </label>
              `).join('')}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="lcc-participants">Jumlah Team/Peserta ${!isPlayoff ? '(Otomatis)' : ''}</label>
            <input class="form-input" id="lcc-participants" type="number" min="2" max="50" value="${lcc.participants}" ${!isPlayoff ? 'disabled' : ''} />
            <p class="form-hint">Diinput manual hanya pada babak playoff.</p>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="lcc-question-count">Jumlah Soal per Regu (tiap mapel)</label>
              <input class="form-input" id="lcc-question-count" type="number" min="1" max="20" value="${lcc.questionCount}" />
            </div>
            <div class="form-group">
              <label class="form-label">Tingkat Kesulitan</label>
              <select class="form-select" id="lcc-difficulty">
                <option value="mudah" ${lcc.difficulty === 'mudah' ? 'selected' : ''}>Mudah</option>
                <option value="sedang" ${lcc.difficulty === 'sedang' ? 'selected' : ''}>Sedang</option>
                <option value="sulit" ${lcc.difficulty === 'sulit' ? 'selected' : ''}>Sulit</option>
                <option value="sangat_sulit" ${lcc.difficulty === 'sangat_sulit' ? 'selected' : ''}>Sangat Sulit (HOTS)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Mata Pelajaran (Centang untuk mengaktifkan)</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm);">
              ${Object.entries(lcc.subjects).map(([k, v]) => `
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
                  <input type="checkbox" class="lcc-subject-cb" data-key="${k}" ${v ? 'checked' : ''} />
                  ${k === 'pkn' ? 'PKN' : k === 'ipa' ? 'IPA' : k === 'ips' ? 'IPS' : k.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
              `).join('')}
            </div>
          </div>

          <div style="margin-top: var(--space-lg);">
            <button class="btn btn-primary" id="btn-lcc-generate-soal" style="width: 100%;">✨ Generate Paket Soal</button>
          </div>
        </div>

        <!-- Download area -->
        <div id="lcc-download-area" style="margin-top: var(--space-lg); display: ${generatedSoalData ? 'block' : 'none'};">
          <button class="btn btn-success btn-lg" id="btn-lcc-download" style="width: 100%;">
            📥 Download Word (.docx)
          </button>
        </div>
      </div>

      <!-- Right Panel: Preview -->
      <div class="sm-preview-panel">
        <div class="card" style="padding: 0; overflow: hidden; height: 100%;">
          <div style="padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
            <h3 class="card-title" style="font-size: var(--fs-sm);">📄 Preview Hasil Soal</h3>
          </div>
          <div id="lcc-preview-content" class="sm-preview-area">
            ${generatedSoalData ? renderSoalPreview(generatedSoalData) : `
              <div class="empty-state" style="padding: var(--space-2xl);">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-title">Belum ada soal</div>
                <div class="empty-state-text">Atur pengaturan di sebelah kiri lalu klik Generate.</div>
              </div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPosterTab(lcc) {
  const poster = lcc.poster;

  return `
    <div class="sm-layout">
      <!-- Left Panel: Form -->
      <div class="sm-form-panel">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">🖼️ Pengaturan Poster Lomba</h3>
          </div>

          <div class="form-group" style="margin-bottom: var(--space-md);">
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
              <input type="checkbox" id="lcc-poster-sponsor" ${poster.sponsor ? 'checked' : ''} />
              Ada Sponsor? (Logo di footer)
            </label>
          </div>

          <div class="form-group">
            <label class="form-label" for="lcc-poster-organizer">Nama Penyelenggara</label>
            <input class="form-input" id="lcc-poster-organizer" type="text" placeholder="Contoh: OSIS SMP Negeri 1" value="${poster.organizerName}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="lcc-poster-date">Kapan Dilaksanakan?</label>
            <input class="form-input" id="lcc-poster-date" type="text" placeholder="Contoh: 15-17 Agustus 2026" value="${poster.date}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="lcc-poster-venue">Tempat Pelaksanaan</label>
            <input class="form-input" id="lcc-poster-venue" type="text" placeholder="Contoh: Aula Sekolah" value="${poster.venue}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="lcc-poster-prizes">Hadiah Lomba</label>
            <input class="form-input" id="lcc-poster-prizes" type="text" value="${poster.prizes}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="lcc-poster-terms">Syarat dan Ketentuan</label>
            <textarea class="form-textarea" id="lcc-poster-terms" rows="4">${poster.terms}</textarea>
          </div>

          <div style="margin-top: var(--space-lg);">
            <button class="btn btn-primary" id="btn-lcc-generate-poster" style="width: 100%;">✨ Hasilkan Prompt</button>
          </div>
        </div>
      </div>

      <!-- Right Panel: Preview -->
      <div class="sm-preview-panel">
        <div class="card" style="padding: 0; overflow: hidden; height: 100%;">
          <div style="padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
            <h3 class="card-title" style="font-size: var(--fs-sm);">📄 Hasil Prompt</h3>
            <button class="btn btn-secondary btn-sm" id="btn-lcc-copy-prompt" style="display: none;">📋 Copy Prompt</button>
          </div>
          <div style="padding: var(--space-md);">
            <textarea class="form-textarea" id="lcc-prompt-result" readonly style="height: 400px; font-family: monospace; font-size: 13px; display: none;"></textarea>
            <div id="lcc-prompt-empty" class="empty-state" style="padding: var(--space-2xl);">
              <div class="empty-state-icon">🤖</div>
              <div class="empty-state-title">Prompt belum dibuat</div>
              <div class="empty-state-text">Isi form di samping lalu klik "Hasilkan Prompt" untuk mendapatkan deskripsi gambar.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSoalPreview(dataArray) {
  if (!dataArray || dataArray.length === 0) return '<p>Belum ada data.</p>';
  
  let html = '';
  dataArray.forEach(res => {
    html += `<div class="sm-preview-section">
      <h4 class="sm-preview-section-title">Mapel: ${res.subject.toUpperCase()}</h4>`;
    
    (res.teams || []).forEach(team => {
      html += `<div style="margin-bottom: var(--space-md); padding: var(--space-sm); background: var(--bg-secondary); border-radius: 8px;">
        <h5 style="margin-bottom: var(--space-sm); font-size: 0.95rem;">${escapeHtml(team.team_name)}</h5>`;
      
      (team.questions || []).forEach(q => {
        html += `<div class="sm-preview-question" style="margin-bottom: var(--space-sm);">
          <div class="sm-preview-q-num" style="font-size: 0.85rem; width: 24px; height: 24px; line-height: 24px;">${q.number}</div>
          <div class="sm-preview-q-body">
            <p style="font-size: 0.9rem;">${escapeHtml(q.question)}</p>
            <div class="sm-preview-answer-hint" style="font-size: 0.8rem; margin-top: 4px;">
              Jawaban: <em>${escapeHtml(q.answer)}</em>
            </div>
          </div>
        </div>`;
      });
      html += `</div>`;
    });
    html += `</div>`;
  });

  return html;
}

export function initLccPage() {
  document.getElementById('btn-lcc-back')?.addEventListener('click', () => {
    state.set('currentView', 'dashboard');
    window.dispatchEvent(new Event('viewchange'));
  });

  document.querySelectorAll('.btn-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.set('lcc.activeTab', btn.dataset.tab);
      window.dispatchEvent(new Event('viewchange'));
    });
  });

  const activeTab = state.get('lcc.activeTab');
  if (activeTab === 'soal') {
    initSoalEvents();
  } else {
    initPosterEvents();
  }
}

function initSoalEvents() {
  const phaseRadios = document.querySelectorAll('input[name="lcc-phase"]');
  phaseRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      state.set('lcc.phase', radio.value);
      let p = state.get('lcc.participants');
      if (radio.value === '8besar') p = 8;
      else if (radio.value === '4besar') p = 4;
      else if (radio.value === 'final') p = 3;
      state.set('lcc.participants', p);
      window.dispatchEvent(new Event('viewchange'));
    });
  });

  document.getElementById('lcc-participants')?.addEventListener('change', (e) => {
    state.set('lcc.participants', parseInt(e.target.value) || 10);
  });

  document.getElementById('lcc-question-count')?.addEventListener('change', (e) => {
    state.set('lcc.questionCount', parseInt(e.target.value) || 5);
  });

  document.getElementById('lcc-difficulty')?.addEventListener('change', (e) => {
    state.set('lcc.difficulty', e.target.value);
  });

  document.querySelectorAll('.lcc-subject-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      state.set(`lcc.subjects.${cb.dataset.key}`, cb.checked);
    });
  });

  document.getElementById('btn-lcc-generate-soal')?.addEventListener('click', handleGenerateSoal);
  document.getElementById('btn-lcc-download')?.addEventListener('click', handleDownloadSoal);
}

function initPosterEvents() {
  document.getElementById('btn-lcc-generate-poster')?.addEventListener('click', () => {
    const data = {
      sponsor: document.getElementById('lcc-poster-sponsor')?.checked || false,
      organizerName: document.getElementById('lcc-poster-organizer')?.value || '',
      date: document.getElementById('lcc-poster-date')?.value || '',
      venue: document.getElementById('lcc-poster-venue')?.value || '',
      prizes: document.getElementById('lcc-poster-prizes')?.value || '',
      terms: document.getElementById('lcc-poster-terms')?.value || '',
    };
    state.set('lcc.poster', data);

    const promptText = generatePosterPrompt(data);
    const textarea = document.getElementById('lcc-prompt-result');
    const empty = document.getElementById('lcc-prompt-empty');
    const copyBtn = document.getElementById('btn-lcc-copy-prompt');

    if (textarea && empty && copyBtn) {
      textarea.value = promptText;
      textarea.style.display = 'block';
      empty.style.display = 'none';
      copyBtn.style.display = 'block';
    }
  });

  document.getElementById('btn-lcc-copy-prompt')?.addEventListener('click', () => {
    const text = document.getElementById('lcc-prompt-result')?.value;
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Prompt berhasil disalin!', 'success');
      });
    }
  });
}

async function handleGenerateSoal() {
  const lcc = state.get('lcc');
  const activeSubjects = Object.entries(lcc.subjects).filter(([_, v]) => v).map(([k]) => {
    return k === 'pkn' ? 'PKN' : k === 'ipa' ? 'IPA' : k === 'ips' ? 'IPS' : k.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  });

  if (activeSubjects.length === 0) {
    showToast('Pilih minimal satu mata pelajaran!', 'warning');
    return;
  }

  const btn = document.getElementById('btn-lcc-generate-soal');
  const previewArea = document.getElementById('lcc-preview-content');
  btn.disabled = true;
  btn.innerHTML = '<div class="loading-spinner" style="width:16px; height:16px; border-width:2px;"></div> <span>Generating...</span>';

  const results = [];
  try {
    for (let i = 0; i < activeSubjects.length; i++) {
      const subject = activeSubjects[i];
      previewArea.innerHTML = `
        <div class="empty-state" style="padding: var(--space-2xl);">
          <div class="loading-spinner" style="margin: 0 auto var(--space-md);"></div>
          <div class="empty-state-title">Membuat Soal ${subject}...</div>
          <div class="empty-state-text">Proses ${i + 1} dari ${activeSubjects.length} mata pelajaran</div>
        </div>
      `;

      const prompt = lccSoalPrompt(subject, lcc.phase, lcc.participants, lcc.questionCount, lcc.difficulty);
      const response = await generateText(prompt);
      const parsed = parseJsonResponse(response);
      results.push(parsed);
      showToast(`Soal ${subject} berhasil dibuat ✅`, 'info');
    }

    generatedSoalData = results;
    previewArea.innerHTML = renderSoalPreview(results);
    document.getElementById('lcc-download-area').style.display = 'block';
    showToast('Semua soal LCC berhasil dibuat! 🎉', 'success');

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
    btn.innerHTML = '✨ Generate Paket Soal';
  }
}

async function handleDownloadSoal() {
  if (!generatedSoalData) return;

  const btn = document.getElementById('btn-lcc-download');
  btn.disabled = true;
  btn.innerHTML = '<div class="loading-spinner" style="width:16px; height:16px; border-width:2px;"></div> <span>Membuat Word...</span>';

  try {
    const config = { phase: state.get('lcc.phase') };
    const filename = await buildLccDocx(generatedSoalData, config);
    showToast(`File berhasil diunduh: "${filename}" 🎉`, 'success');
  } catch (err) {
    showToast(`Gagal download: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '📥 Download Word (.docx)';
  }
}
