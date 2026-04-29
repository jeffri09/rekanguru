// ============================================================
// KKTP & Asesmen Module — Step 3: Backward Design
// Pedagogis Tahap 3: Perencanaan Mikro (KKTP) + Tahap 4: Alat Ukur
//
// Features:
//   - Per-TP KKTP formulation (auto-generate or manual)
//   - Rubrik kualitatif: Baru Berkembang / Layak / Cakap / Mahir
//   - Asesmen alignment preview
//   - "Backward Design" mindset enforcement
// ============================================================

import { state } from '../state.js';
import { showToast, uid } from '../utils/helpers.js';
import { generateText, parseJsonResponse } from '../services/gemini.js';

let isGenerating = false;

export default {
  render() {
    const book = state.get('book');
    const atp = state.get('atp') || { tujuanPembelajaran: [] };
    const kktp = state.get('kktp') || { items: [], reviewed: false };
    const tpList = atp.tujuanPembelajaran || [];
    const kktpItems = kktp.items || [];

    return `
      <h2 class="step-title">📏 Rumuskan KKTP & Asesmen</h2>
      <p class="step-subtitle">
        <strong>Backward Design:</strong> Tentukan <em>"Bagaimana saya tahu siswa sudah berhasil?"</em> <strong>sebelum</strong> merancang kegiatan belajar.
        Rumuskan Kriteria Ketercapaian TP (KKTP) untuk setiap TP.
      </p>

      <!-- Backward Design Reminder -->
      <div class="card kktp-backward-card" style="margin-bottom: var(--space-lg);">
        <div class="kktp-backward-content">
          <div class="kktp-backward-icon">🔄</div>
          <div class="kktp-backward-text">
            <strong>Prinsip Backward Design (Understanding by Design):</strong><br>
            <span style="color: var(--text-secondary); font-size: 0.85rem;">
              Langkah 1: Tetapkan tujuan (TP) ✅ → 
              Langkah 2: <strong style="color: var(--accent-primary);">Tentukan bukti keberhasilan (KKTP & Asesmen)</strong> 👈 Anda di sini → 
              Langkah 3: Rancang kegiatan belajar (nanti)
            </span>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar" style="margin-bottom: var(--space-lg);">
        <div class="stat-item">
          <span class="stat-value" id="kktp-total-tp">${tpList.length}</span>
          <span class="stat-label">Total TP</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="kktp-completed">${kktpItems.filter(k => k.criteria && k.criteria.length > 0).length}</span>
          <span class="stat-label">KKTP Selesai</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="kktp-progress-pct">${tpList.length > 0 ? Math.round((kktpItems.filter(k => k.criteria && k.criteria.length > 0).length / tpList.length) * 100) : 0}%</span>
          <span class="stat-label">Progress</span>
        </div>
        <div style="flex:1;"></div>
        <div style="display: flex; gap: var(--space-sm);">
          <button class="btn btn-primary btn-sm" id="btn-kktp-auto-all" ${isGenerating ? 'disabled' : ''}>
            ${isGenerating ? '⏳ Generating...' : '✨ Auto-Generate Semua KKTP'}
          </button>
        </div>
      </div>

      <!-- KKTP Per TP -->
      <div id="kktp-items-container">
        ${tpList.length > 0 ? this.renderKKTPItems(tpList, kktpItems) : this.renderEmptyState()}
      </div>

      <!-- Konfigurasi Sumatif (Moved from Step 1) -->
      <div class="card" style="margin-top: var(--space-lg); margin-bottom: var(--space-lg);" id="sumatif-config-card">
        <div class="card-header">
          <h3 class="card-title">📝 Konfigurasi Instrumen Asesmen</h3>
          <span class="badge badge-green">Opsional</span>
        </div>
        <p class="form-hint" style="margin-bottom: var(--space-md);">
          Atur komposisi soal untuk asesmen sumatif. AI akan menyesuaikan instrumen berdasarkan level Bloom pada TP.
        </p>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Jenis & Jumlah Soal</label>
            ${[
              { key: 'pilihan_ganda', label: 'Pilihan Ganda', icon: '🔘' },
              { key: 'isian_singkat', label: 'Isian Singkat', icon: '✏️' },
              { key: 'esai', label: 'Esai/Uraian', icon: '📝' },
              { key: 'mencocokkan', label: 'Mencocokkan', icon: '🔗' },
            ].map(t => `
              <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
                <label class="checkbox-label" style="min-width: 160px;">
                  <input type="checkbox" class="sumatif-type-toggle" data-type="${t.key}" 
                    ${(book.sumatifConfig || {}).enabledTypes?.[t.key] ? 'checked' : ''} />
                  ${t.icon} ${t.label}
                </label>
                <input type="number" class="form-input sumatif-count-input" data-type="${t.key}" 
                  min="1" max="50" value="${(book.sumatifConfig || {}).questionCount?.[t.key] || 5}"
                  style="width: 70px; padding: 6px 8px; text-align: center;" />
                <span style="font-size: var(--fs-xs); color: var(--text-tertiary);">soal</span>
              </div>
            `).join('')}
          </div>
          <div class="form-group">
            <label class="form-label" for="input-pg-options">Opsi PG (A-...)</label>
            <select class="form-select" id="input-pg-options" style="margin-bottom: var(--space-md);">
              <option value="3" ${(book.sumatifConfig || {}).pgOptionCount === 3 ? 'selected' : ''}>3 Opsi (A-C)</option>
              <option value="4" ${(book.sumatifConfig || {}).pgOptionCount === 4 || !(book.sumatifConfig || {}).pgOptionCount ? 'selected' : ''}>4 Opsi (A-D)</option>
              <option value="5" ${(book.sumatifConfig || {}).pgOptionCount === 5 ? 'selected' : ''}>5 Opsi (A-E)</option>
            </select>
            <label class="form-label">Level Kognitif</label>
            <div id="difficulty-level-grid">
              ${[
                { value: 'mudah', label: 'C1-C2 Dasar', icon: '🟢' },
                { value: 'sedang', label: 'C3-C4 Sedang', icon: '🟡' },
                { value: 'hots', label: 'C4-C6 HOTS', icon: '🔴' },
              ].map(d => `
                <label class="checkbox-item">
                  <input type="radio" name="difficulty-level" value="${d.value}" 
                    ${(book.sumatifConfig || {}).difficultyLevel === d.value || (!(book.sumatifConfig || {}).difficultyLevel && d.value === 'sedang') ? 'checked' : ''} />
                  <span>${d.icon} ${d.label}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Asesmen Alignment Preview -->
      ${kktpItems.filter(k => k.criteria && k.criteria.length > 0).length > 0 ? `
        <div class="card" style="margin-top: var(--space-lg);" id="asesmen-alignment-card">
          <div class="card-header">
            <h3 class="card-title">📊 Matriks Keselarasan TP ↔ KKTP ↔ Asesmen</h3>
            <span class="badge badge-cyan">Alignment Check</span>
          </div>
          <div id="asesmen-alignment-table">
            ${this.renderAlignmentTable(tpList, kktpItems)}
          </div>
        </div>
      ` : ''}
    `;
  },

  renderKKTPItems(tpList, kktpItems) {
    return tpList.map((tp, idx) => {
      const kktpItem = kktpItems.find(k => k.tpId === tp.id) || { tpId: tp.id, criteria: [], rubrikLevel: 'default' };
      const hasCriteria = kktpItem.criteria && kktpItem.criteria.length > 0;

      return `
        <div class="card kktp-tp-card ${hasCriteria ? 'kktp-completed' : ''}" style="margin-bottom: var(--space-md);" data-tp-id="${tp.id}">
          <div class="kktp-tp-header">
            <div class="kktp-tp-info">
              <span class="kktp-tp-order">${idx + 1}</span>
              <div>
                <div class="kktp-tp-title">${tp.tp || '(TP tanpa judul)'}</div>
                <div class="kktp-tp-meta">
                  <span class="atp-bloom-badge" style="background: ${this.getBloomColor(tp.levelBloom)}22; color: ${this.getBloomColor(tp.levelBloom)}; border: 1px solid ${this.getBloomColor(tp.levelBloom)}44;">
                    ${tp.levelBloom || '?'}
                  </span>
                  ${tp.lingkupMateri ? `<span class="atp-materi-badge">📚 ${tp.lingkupMateri}</span>` : ''}
                  ${hasCriteria ? '<span class="kktp-status-done">✅ KKTP Selesai</span>' : '<span class="kktp-status-pending">⏳ Belum ada KKTP</span>'}
                </div>
              </div>
            </div>
            <div class="kktp-tp-actions">
              <button class="btn btn-secondary btn-sm kktp-auto-btn" data-tp-id="${tp.id}" data-tp-idx="${idx}" ${isGenerating ? 'disabled' : ''}>
                ✨ Auto
              </button>
              <button class="btn btn-ghost btn-sm kktp-manual-btn" data-tp-id="${tp.id}" data-tp-idx="${idx}">
                ✏️ Manual
              </button>
            </div>
          </div>

          <!-- KKTP Content -->
          <div class="kktp-content" id="kktp-content-${tp.id}">
            ${hasCriteria ? this.renderKKTPContent(kktpItem) : `
              <div class="kktp-empty">
                <span style="color: var(--text-tertiary); font-size: var(--fs-sm);">
                  Klik "Auto" untuk generate KKTP otomatis, atau "Manual" untuk menulis sendiri.
                </span>
              </div>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  renderKKTPContent(kktpItem) {
    if (!kktpItem.criteria || kktpItem.criteria.length === 0) return '';

    return `
      <div class="kktp-criteria-section">
        <div class="kktp-criteria-title">📋 Kriteria Ketercapaian:</div>
        <div class="kktp-criteria-list">
          ${kktpItem.criteria.map((c, i) => `
            <div class="kktp-criteria-item">
              <span class="kktp-criteria-num">${i + 1}</span>
              <span class="kktp-criteria-text" contenteditable="true" data-tp-id="${kktpItem.tpId}" data-crit-idx="${i}">${c.text}</span>
            </div>
          `).join('')}
        </div>

        <!-- Rubrik Kualitatif -->
        <div class="kktp-rubrik">
          <div class="kktp-rubrik-title">📊 Rubrik Penilaian Kualitatif:</div>
          <div class="kktp-rubrik-grid">
            <div class="kktp-rubrik-level kktp-bb">
              <div class="kktp-rubrik-label">Baru Berkembang</div>
              <div class="kktp-rubrik-desc">Memenuhi ≤25% kriteria</div>
            </div>
            <div class="kktp-rubrik-level kktp-l">
              <div class="kktp-rubrik-label">Layak</div>
              <div class="kktp-rubrik-desc">Memenuhi 26-50% kriteria</div>
            </div>
            <div class="kktp-rubrik-level kktp-c">
              <div class="kktp-rubrik-label">Cakap</div>
              <div class="kktp-rubrik-desc">Memenuhi 51-75% kriteria</div>
            </div>
            <div class="kktp-rubrik-level kktp-m">
              <div class="kktp-rubrik-label">Mahir</div>
              <div class="kktp-rubrik-desc">Memenuhi 76-100% kriteria</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderAlignmentTable(tpList, kktpItems) {
    return `
      <div class="kktp-alignment-table">
        <table>
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Tujuan Pembelajaran</th>
              <th>Level</th>
              <th>Jumlah KKTP</th>
              <th>Status</th>
              <th>Jenis Asesmen</th>
            </tr>
          </thead>
          <tbody>
            ${tpList.map((tp, idx) => {
              const kktpItem = kktpItems.find(k => k.tpId === tp.id);
              const criteriaCount = kktpItem?.criteria?.length || 0;
              const levelSuggestion = this.suggestAssessmentType(tp.levelBloom);
              return `
                <tr>
                  <td style="text-align: center; font-weight: 700; color: var(--accent-primary);">${idx + 1}</td>
                  <td style="font-size: 0.8rem;">${tp.tp || ''}</td>
                  <td style="text-align: center;">
                    <span style="padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 700; background: ${this.getBloomColor(tp.levelBloom)}22; color: ${this.getBloomColor(tp.levelBloom)};">
                      ${tp.levelBloom || '?'}
                    </span>
                  </td>
                  <td style="text-align: center;">${criteriaCount > 0 ? criteriaCount : '—'}</td>
                  <td style="text-align: center;">${criteriaCount > 0 ? '✅' : '⏳'}</td>
                  <td style="font-size: 0.75rem; color: var(--text-secondary);">${levelSuggestion}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderEmptyState() {
    return `
      <div class="empty-state" style="padding: var(--space-xl) 0;">
        <div class="empty-state-icon">📏</div>
        <div class="empty-state-title">Belum ada Tujuan Pembelajaran</div>
        <div class="empty-state-text">
          Kembali ke langkah sebelumnya (Susun ATP) untuk menyusun TP terlebih dahulu.
        </div>
      </div>
    `;
  },

  suggestAssessmentType(level) {
    const map = {
      'C1': 'PG, Isian Singkat',
      'C2': 'PG, Isian, Mencocokkan',
      'C3': 'Isian, Praktik, Demonstrasi',
      'C4': 'Esai Analitis, Studi Kasus',
      'C5': 'Esai Evaluatif, Presentasi',
      'C6': 'Proyek, Portofolio, Produk',
    };
    return map[level] || 'Bervariasi';
  },

  getBloomColor(level) {
    const colors = {
      C1: '#6366f1', C2: '#8b5cf6', C3: '#3b82f6',
      C4: '#f59e0b', C5: '#ef4444', C6: '#10b981',
    };
    return colors[level] || '#888';
  },

  // ====== INIT ======

  init() {
    // Ensure KKTP items exist for all TPs
    this.syncKKTPWithTP();
    // Refresh UI to sync stats and cards with actual data
    this.refreshUI();
    document.getElementById('btn-kktp-auto-all')?.addEventListener('click', () => {
      this.autoGenerateAll();
    });

    // Per-TP auto generate
    document.querySelectorAll('.kktp-auto-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.autoGenerateSingle(btn.dataset.tpId, parseInt(btn.dataset.tpIdx));
      });
    });

    // Per-TP manual input
    document.querySelectorAll('.kktp-manual-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showManualInput(btn.dataset.tpId);
      });
    });

    // Editable criteria text
    document.querySelectorAll('.kktp-criteria-text[contenteditable]').forEach(el => {
      el.addEventListener('blur', () => {
        const tpId = el.dataset.tpId;
        const critIdx = parseInt(el.dataset.critIdx);
        this.updateCriteriaText(tpId, critIdx, el.textContent.trim());
      });
    });
  },

  // ====== SYNC ======

  syncKKTPWithTP() {
    const tpList = (state.get('atp') || {}).tujuanPembelajaran || [];
    const kktp = state.get('kktp') || { items: [], reviewed: false };
    const existing = kktp.items || [];

    // Add missing KKTP entries
    for (const tp of tpList) {
      if (!existing.find(k => k.tpId === tp.id)) {
        existing.push({
          tpId: tp.id,
          tpText: tp.tp,
          criteria: [],
          rubrikLevel: 'default',
        });
      }
    }

    // Remove KKTP entries for deleted TPs
    const validIds = new Set(tpList.map(t => t.id));
    kktp.items = existing.filter(k => validIds.has(k.tpId));
    state.set('kktp', kktp);
  },

  // ====== AUTO GENERATE ======

  async autoGenerateSingle(tpId, tpIdx) {
    const tpList = (state.get('atp') || {}).tujuanPembelajaran || [];
    const tp = tpList.find(t => t.id === tpId);
    if (!tp) return;

    const btn = document.querySelector(`.kktp-auto-btn[data-tp-id="${tpId}"]`);
    if (btn) { btn.disabled = true; btn.textContent = '⏳...'; }

    try {
      const prompt = this.buildKKTPPrompt([tp]);
      const response = await generateText(prompt);
      const data = parseJsonResponse(response);

      if (data.kktp && Array.isArray(data.kktp) && data.kktp.length > 0) {
        const kktpResult = data.kktp[0];
        this.saveKKTP(tpId, kktpResult.criteria || []);
        showToast(`KKTP untuk TP ${tpIdx + 1} berhasil di-generate!`, 'success');
      } else {
        throw new Error('Format respons tidak sesuai.');
      }
    } catch (err) {
      showToast(`Gagal generate KKTP: ${err.message}`, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '✨ Auto'; }
      this.refreshUI();
    }
  },

  async autoGenerateAll() {
    const tpList = (state.get('atp') || {}).tujuanPembelajaran || [];
    if (tpList.length === 0) {
      showToast('Belum ada TP. Susun ATP terlebih dahulu.', 'warning');
      return;
    }

    isGenerating = true;
    const btn = document.getElementById('btn-kktp-auto-all');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Generating...'; }

    try {
      const prompt = this.buildKKTPPrompt(tpList);
      const response = await generateText(prompt);
      const data = parseJsonResponse(response);

      if (data.kktp && Array.isArray(data.kktp)) {
        for (let i = 0; i < Math.min(data.kktp.length, tpList.length); i++) {
          const tp = tpList[i];
          const kktpResult = data.kktp[i];
          this.saveKKTP(tp.id, kktpResult.criteria || []);
        }
        state.set('kktp.reviewed', false);
        showToast(`✅ KKTP untuk ${data.kktp.length} TP berhasil di-generate!`, 'success');
      } else {
        throw new Error('Format respons tidak sesuai.');
      }
    } catch (err) {
      showToast(`Gagal generate KKTP: ${err.message}`, 'error');
    } finally {
      isGenerating = false;
      if (btn) { btn.disabled = false; btn.textContent = '✨ Auto-Generate Semua KKTP'; }
      this.refreshUI();
    }
  },

  buildKKTPPrompt(tpList) {
    const book = state.get('book');
    const mapel = book.subject || 'Umum';
    const fase = book.classPhase || '';
    const jenjang = book.jenjang || 'SMP';

    return `Kamu adalah pakar pendidikan Kurikulum Merdeka. Tugas: Rumuskan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) untuk setiap TP berikut.

KONTEKS:
- Mapel: ${mapel}
- Jenjang: ${jenjang}
- Fase: ${fase}

DAFTAR TP:
${tpList.map((tp, i) => `${i + 1}. [${tp.levelBloom}] ${tp.tp}`).join('\n')}

INSTRUKSI:
1. Untuk SETIAP TP, buat 2-4 kriteria ketercapaian yang SPESIFIK dan TERUKUR
2. Kriteria harus bisa diobservasi/diukur oleh guru
3. Gunakan kata kerja operasional yang sesuai level Bloom
4. Setiap kriteria harus mengarah ke rubrik kualitatif (BB/L/C/M)

FORMAT OUTPUT (JSON):
{
  "kktp": [
    {
      "tpIndex": 0,
      "criteria": [
        { "id": "k1", "text": "Peserta didik mampu ..." },
        { "id": "k2", "text": "Peserta didik dapat ..." }
      ]
    }
  ]
}

Hanya output JSON. Tanpa markdown code fence.`;
  },

  saveKKTP(tpId, criteria) {
    const kktp = state.get('kktp') || { items: [], reviewed: false };
    const items = kktp.items || [];
    const existing = items.find(k => k.tpId === tpId);

    const formattedCriteria = criteria.map((c, i) => ({
      id: c.id || uid(),
      text: typeof c === 'string' ? c : (c.text || ''),
    }));

    if (existing) {
      existing.criteria = formattedCriteria;
    } else {
      items.push({
        tpId,
        criteria: formattedCriteria,
        rubrikLevel: 'default',
      });
    }

    kktp.items = items;
    state.set('kktp', kktp);
  },

  // ====== MANUAL INPUT ======

  showManualInput(tpId) {
    const contentEl = document.getElementById(`kktp-content-${tpId}`);
    if (!contentEl) return;

    const kktp = state.get('kktp') || { items: [] };
    const kktpItem = kktp.items.find(k => k.tpId === tpId);
    const existingCriteria = kktpItem?.criteria?.map(c => c.text).join('\n') || '';

    contentEl.innerHTML = `
      <div class="kktp-manual-form">
        <label class="form-label" style="margin-bottom: var(--space-xs);">
          Tulis kriteria KKTP (satu per baris):
        </label>
        <textarea class="form-textarea kktp-manual-textarea" id="kktp-manual-${tpId}" 
          placeholder="Peserta didik mampu ...&#10;Peserta didik dapat ...&#10;Peserta didik menunjukkan ..."
          style="min-height: 100px;">${existingCriteria}</textarea>
        <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-sm);">
          <button class="btn btn-primary btn-sm kktp-save-manual" data-tp-id="${tpId}">💾 Simpan</button>
          <button class="btn btn-ghost btn-sm kktp-cancel-manual" data-tp-id="${tpId}">Batal</button>
        </div>
      </div>
    `;

    // Attach save/cancel
    contentEl.querySelector('.kktp-save-manual')?.addEventListener('click', () => {
      const textarea = document.getElementById(`kktp-manual-${tpId}`);
      const lines = textarea.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const criteria = lines.map((line, i) => ({ id: uid(), text: line }));
      this.saveKKTP(tpId, criteria);
      showToast('KKTP disimpan!', 'success');
      this.refreshUI();
    });

    contentEl.querySelector('.kktp-cancel-manual')?.addEventListener('click', () => {
      this.refreshUI();
    });

    // Focus textarea
    setTimeout(() => document.getElementById(`kktp-manual-${tpId}`)?.focus(), 50);
  },

  updateCriteriaText(tpId, critIdx, newText) {
    const kktp = state.get('kktp') || { items: [] };
    const item = kktp.items.find(k => k.tpId === tpId);
    if (item && item.criteria[critIdx]) {
      item.criteria[critIdx].text = newText;
      state.set('kktp', kktp);
    }
  },

  // ====== REFRESH ======

  refreshUI() {
    const container = document.getElementById('kktp-items-container');
    if (!container) return;

    const tpList = (state.get('atp') || {}).tujuanPembelajaran || [];
    const kktpItems = (state.get('kktp') || {}).items || [];

    container.innerHTML = tpList.length > 0 ? this.renderKKTPItems(tpList, kktpItems) : this.renderEmptyState();

    // Re-attach listeners
    document.querySelectorAll('.kktp-auto-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.autoGenerateSingle(btn.dataset.tpId, parseInt(btn.dataset.tpIdx));
      });
    });
    document.querySelectorAll('.kktp-manual-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showManualInput(btn.dataset.tpId);
      });
    });
    document.querySelectorAll('.kktp-criteria-text[contenteditable]').forEach(el => {
      el.addEventListener('blur', () => {
        this.updateCriteriaText(el.dataset.tpId, parseInt(el.dataset.critIdx), el.textContent.trim());
      });
    });

    // Update stats
    const completedCount = kktpItems.filter(k => k.criteria && k.criteria.length > 0).length;
    const totalEl = document.getElementById('kktp-total-tp');
    const completedEl = document.getElementById('kktp-completed');
    const progressEl = document.getElementById('kktp-progress-pct');
    if (totalEl) totalEl.textContent = tpList.length;
    if (completedEl) completedEl.textContent = completedCount;
    if (progressEl) progressEl.textContent = tpList.length > 0 ? Math.round((completedCount / tpList.length) * 100) + '%' : '0%';

    // Update alignment table
    const alignCard = document.getElementById('asesmen-alignment-card');
    const alignTable = document.getElementById('asesmen-alignment-table');
    if (alignCard && completedCount > 0) {
      alignCard.style.display = 'block';
      if (alignTable) alignTable.innerHTML = this.renderAlignmentTable(tpList, kktpItems);
    } else if (alignCard) {
      alignCard.style.display = 'none';
    }
  },

  // ====== WIZARD INTERFACE ======

  validate() {
    // KKTP is recommended but not strictly required
    const kktp = state.get('kktp') || { items: [] };
    const completed = (kktp.items || []).filter(k => k.criteria && k.criteria.length > 0).length;
    const total = ((state.get('atp') || {}).tujuanPembelajaran || []).length;

    if (total > 0 && completed === 0) {
      // Warn but allow skip
      const skip = confirm('Anda belum merumuskan KKTP satupun. Apakah Anda yakin ingin melanjutkan?\n\n(KKTP yang kosong akan di-generate otomatis oleh AI di langkah berikutnya)');
      return skip;
    }

    return true;
  },

  getData() {
    // Data already saved to state via real-time updates
  },

  destroy() {
    isGenerating = false;
  },
};
