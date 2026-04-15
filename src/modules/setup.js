// ============================================================
// Setup Module — Step 1: Data Input + CP Scanning + Modul Ajar
// ============================================================

import { state } from '../state.js';
import { showToast, uid } from '../utils/helpers.js';
import { generateText, parseJsonResponse } from '../services/gemini.js';
import { cpScanningPrompt, distribusiPertemuanPrompt } from '../utils/prompts.js';

let isScanningCP = false;
let isDistributing = false;

export default {
  render() {
    const book = state.get('book');
    const cpData = book.cpData || [];
    const distribusi = book.distribusiPertemuan || [];

    return `
      <h2 class="step-title">📝 Isi Data Dokumen</h2>
      <p class="step-subtitle">Lengkapi informasi berikut. AI akan menyesuaikan konten sesuai kurikulum, level sekolah, dan konteks Anda.</p>

      <div class="card" style="margin-bottom: var(--space-lg);">
        <div class="card-header">
          <h3 class="card-title">👤 Identitas & Dokumen</h3>
          <span class="badge badge-purple">Wajib</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="input-role">Peran Pendidik <span class="required">*</span></label>
            <select class="form-select" id="input-role">
              <option value="guru" ${book.targetRole === 'guru' ? 'selected' : ''}>👨‍🏫 Guru / Pendidik</option>
              <option value="kepsek" ${book.targetRole === 'kepsek' ? 'selected' : ''}>🏢 Kepala Sekolah</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Jenis Dokumen <span class="required">*</span></label>
            <div id="input-doctype-container" class="doctype-grid"></div>
          </div>
        </div>

        <div class="form-row" id="row-subject-phase">
          <div class="form-group">
            <label class="form-label" for="input-subject">Mata Pelajaran <span class="required">*</span></label>
            <input class="form-input" id="input-subject" type="text" placeholder="Contoh: Bahasa Inggris" value="${book.subject || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label" for="input-classphase">Fase / Kelas <span class="required">*</span></label>
            <input class="form-input" id="input-classphase" type="text" placeholder="Contoh: Fase D / Kelas 7" value="${book.classPhase || ''}" />
          </div>
        </div>
      </div>

      <!-- ====== CP SCANNING (Optional) ====== -->
      <div class="card cp-scanning-card" style="margin-bottom: var(--space-lg);" id="cp-scanning-card">
        <div class="card-header">
          <h3 class="card-title">🔬 Scanning CP (Capaian Pembelajaran)</h3>
          <span class="badge badge-cyan">Opsional</span>
        </div>
        <p class="form-hint" style="margin-bottom: var(--space-md);">
          AI akan meriset Capaian Pembelajaran resmi dari Kurikulum Merdeka berdasarkan mata pelajaran & fase.
          CP yang ditemukan menjadi <strong>sumber utama</strong> untuk generate semua dokumen.
        </p>

        <div style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-md);">
          <button class="btn btn-primary" id="btn-scan-cp" ${isScanningCP ? 'disabled' : ''}>
            ${isScanningCP ? '⏳ Scanning...' : cpData.length > 0 ? '🔄 Scan Ulang CP' : '🔬 Mulai Scanning CP'}
          </button>
          ${cpData.length > 0 ? `
            <button class="btn btn-ghost btn-sm" id="btn-clear-cp">🗑️ Hapus CP</button>
          ` : ''}
        </div>

        <div id="cp-scanning-loading" style="display:none;">
          <div class="card" style="text-align:center; padding: var(--space-xl); background: rgba(139,92,246,0.05); border: 1px dashed rgba(139,92,246,0.3);">
            <div class="loading-spinner" style="margin: 0 auto var(--space-md);"></div>
            <p style="color: var(--text-secondary);">AI sedang meriset CP dari Kurikulum Merdeka<span class="loading-dots"></span></p>
            <p style="font-size: 11px; color: var(--text-tertiary); margin-top: var(--space-xs);">Proses ini membutuhkan waktu 10-30 detik</p>
          </div>
        </div>

        <div id="cp-results-container">
          ${cpData.length > 0 ? this.renderCPResults(cpData) : `
            <div class="cp-empty-hint" style="text-align:center; padding: var(--space-lg); color: var(--text-tertiary); font-size: var(--fs-sm);">
              <div style="font-size: 2rem; margin-bottom: var(--space-xs);">📋</div>
              Belum ada CP. Isi mata pelajaran & fase di atas, lalu klik "Mulai Scanning CP".
            </div>
          `}
        </div>
      </div>

      <!-- ====== MODUL AJAR MULTI-PERTEMUAN (Optional) ====== -->
      <div class="card modul-ajar-card" style="margin-bottom: var(--space-lg);" id="modul-ajar-card">
        <div class="card-header">
          <h3 class="card-title">📅 Modul Ajar Multi-Pertemuan</h3>
          <span class="badge badge-green">Opsional</span>
        </div>
        <p class="form-hint" style="margin-bottom: var(--space-md);">
          Buat modul ajar lengkap untuk 1 tahun atau 1 semester. CP akan didistribusikan ke setiap pertemuan secara proporsional.
        </p>

        <div class="form-group">
          <label class="form-label">Mode Modul Ajar</label>
          <div class="modul-ajar-mode-grid" id="modul-ajar-mode-grid">
            <label class="school-level-card ${!book.modulAjarMode ? 'active' : ''}">
              <input type="radio" name="modul-ajar-mode" value="" ${!book.modulAjarMode ? 'checked' : ''} />
              <div class="school-level-icon">❌</div>
              <div class="school-level-title">Nonaktif</div>
              <div class="school-level-desc">Tidak membuat modul multi-pertemuan</div>
            </label>
            <label class="school-level-card ${book.modulAjarMode === 'tahunan' ? 'active' : ''}">
              <input type="radio" name="modul-ajar-mode" value="tahunan" ${book.modulAjarMode === 'tahunan' ? 'checked' : ''} />
              <div class="school-level-icon">📆</div>
              <div class="school-level-title">1 Tahun</div>
              <div class="school-level-desc">12-16 pertemuan</div>
            </label>
            <label class="school-level-card ${book.modulAjarMode === 'semester' ? 'active' : ''}">
              <input type="radio" name="modul-ajar-mode" value="semester" ${book.modulAjarMode === 'semester' ? 'checked' : ''} />
              <div class="school-level-icon">📅</div>
              <div class="school-level-title">1 Semester</div>
              <div class="school-level-desc">6-8 pertemuan</div>
            </label>
          </div>
        </div>

        <div id="modul-ajar-settings" style="display: ${book.modulAjarMode ? 'block' : 'none'};">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="input-total-pertemuan">
                Jumlah Pertemuan: <strong id="pertemuan-value">${book.totalPertemuan || 12}</strong>
              </label>
              <input type="range" class="form-range" id="input-total-pertemuan" 
                min="${book.modulAjarMode === 'semester' ? 6 : 12}" 
                max="${book.modulAjarMode === 'semester' ? 8 : 16}" 
                value="${book.totalPertemuan || 12}" />
              <div class="range-labels">
                <span>${book.modulAjarMode === 'semester' ? '6' : '12'}</span>
                <span>${book.modulAjarMode === 'semester' ? '8' : '16'}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="input-jumlah-sumatif">
                Sumatif Harian: <strong id="sumatif-value">${book.jumlahSumatif || 0}</strong>x
              </label>
              <input type="range" class="form-range" id="input-jumlah-sumatif" 
                min="0" max="6" 
                value="${book.jumlahSumatif || 0}" />
              <div class="range-labels">
                <span>0 (tanpa sumatif)</span>
                <span>6</span>
              </div>
            </div>
          </div>

          <!-- Sumatif Position Config -->
          <div id="sumatif-position-config" style="display: ${(book.jumlahSumatif || 0) > 0 ? 'block' : 'none'};">
            <div class="form-group">
              <label class="form-label">Posisi Pertemuan Sumatif</label>
              <div style="display: flex; gap: var(--space-sm); align-items: center; margin-bottom: var(--space-sm);">
                <label class="checkbox-item" style="flex: none;">
                  <input type="radio" name="sumatif-pos-mode" value="auto" ${(!book.sumatifPositions || book.sumatifPositions.length === 0) ? 'checked' : ''} />
                  <span>Otomatis (merata)</span>
                </label>
                <label class="checkbox-item" style="flex: none;">
                  <input type="radio" name="sumatif-pos-mode" value="custom" ${(book.sumatifPositions && book.sumatifPositions.length > 0) ? 'checked' : ''} />
                  <span>Custom</span>
                </label>
              </div>
              <div id="sumatif-custom-positions" style="display: ${(book.sumatifPositions && book.sumatifPositions.length > 0) ? 'block' : 'none'};">
                <input class="form-input" id="input-sumatif-positions" type="text" 
                  placeholder="Contoh: 3, 6, 9, 12"
                  value="${(book.sumatifPositions || []).join(', ')}" />
                <small class="form-hint">Masukkan nomor pertemuan sumatif, pisahkan dengan koma</small>
              </div>
              <div id="sumatif-auto-preview" style="display: ${(!book.sumatifPositions || book.sumatifPositions.length === 0) ? 'block' : 'none'};">
                <small class="form-hint" id="sumatif-auto-text">
                  ${this.getAutoSumatifText(book.totalPertemuan || 12, book.jumlahSumatif || 0)}
                </small>
              </div>
            </div>
          </div>

          <!-- Distribution Preview -->
          <div id="distribusi-preview" style="margin-top: var(--space-md);">
            ${distribusi.length > 0 ? this.renderDistribusiPreview(distribusi) : ''}
          </div>

          <div style="margin-top: var(--space-md); display: flex; gap: var(--space-sm);">
            <button class="btn btn-secondary" id="btn-generate-distribusi" ${isDistributing ? 'disabled' : ''} ${cpData.length === 0 ? 'disabled title="Scan CP terlebih dahulu"' : ''}>
              ${isDistributing ? '⏳ Membuat distribusi...' : '📊 Generate Distribusi Pertemuan'}
            </button>
          </div>
        </div>
      </div>

      <!-- School Level -->
      <div class="card" style="margin-bottom: var(--space-lg);">
        <div class="card-header">
          <h3 class="card-title">🏫 Level Sekolah</h3>
          <span class="badge badge-cyan">Penting</span>
        </div>
        <p class="form-hint" style="margin-bottom: var(--space-md);">Pilih level sekolah agar AI menyesuaikan metode, media, dan aktivitas yang realistis untuk konteks Anda.</p>
        
        <div class="school-level-grid" id="school-level-grid">
          <label class="school-level-card ${book.schoolLevel === 'kota' ? 'active' : ''}">
            <input type="radio" name="school-level" value="kota" ${book.schoolLevel === 'kota' ? 'checked' : ''} />
            <div class="school-level-icon">🏙️</div>
            <div class="school-level-title">Kota / Maju</div>
            <div class="school-level-desc">Internet, proyektor, lab komputer, siswa punya gawai</div>
          </label>
          <label class="school-level-card ${book.schoolLevel === 'pinggiran' ? 'active' : ''}">
            <input type="radio" name="school-level" value="pinggiran" ${book.schoolLevel === 'pinggiran' ? 'checked' : ''} />
            <div class="school-level-icon">🏘️</div>
            <div class="school-level-title">Pinggiran / Peralihan</div>
            <div class="school-level-desc">Internet kadang-kadang, proyektor terbatas, campuran digital & manual</div>
          </label>
          <label class="school-level-card ${book.schoolLevel === 'pelosok' ? 'active' : ''}">
            <input type="radio" name="school-level" value="pelosok" ${book.schoolLevel === 'pelosok' ? 'checked' : ''} />
            <div class="school-level-icon">🌾</div>
            <div class="school-level-title">Pelosok / Daerah 3T</div>
            <div class="school-level-desc">Tanpa internet, tanpa proyektor, media dari alam & bahan sederhana</div>
          </label>
        </div>
      </div>

      <!-- Topic & Details -->
      <div class="card" style="margin-bottom: var(--space-lg);">
        <div class="card-header">
          <h3 class="card-title">📋 Detail Materi</h3>
          <span class="badge badge-green">Opsional</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="input-topic">Topik / Materi <small style="color:#6b7280; font-weight:normal;">(Kosongkan agar AI menentukan otomatis)</small></label>
          <input class="form-input" id="input-topic" type="text" placeholder="Contoh: Sistem Pernapasan Manusia..." value="${book.topic || ''}" />
        </div>

        <div class="form-group">
          <label class="form-label" for="input-desc">Catatan Khusus <small style="color:#6b7280; font-weight:normal;">(Opsional)</small></label>
          <textarea class="form-textarea" id="input-desc" placeholder="Contoh: Fokus pada siswa inklusi, tambahkan kegiatan outdoor...">${book.description || ''}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label" for="input-length">Kedalaman Penjabaran</label>
          <select class="form-select" id="input-length">
            <option value="pendek" ${book.chapterLength === 'pendek' ? 'selected' : ''}>📄 Singkat / Poin-poin</option>
            <option value="sedang" ${book.chapterLength === 'sedang' ? 'selected' : ''}>📑 Sedang / Cukup Detail</option>
            <option value="panjang" ${book.chapterLength === 'panjang' ? 'selected' : ''}>📚 Sangat Detail & Komprehensif</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" for="input-reference">Material Referensi <small style="color:#6b7280; font-weight:normal;">(Opsional — paste silabus, CP, dll.)</small></label>
          <textarea class="form-textarea" id="input-reference" placeholder="Paste copy dokumen referensi di sini..." style="min-height: 100px;">${book.referenceText || ''}</textarea>
        </div>
      </div>
    `;
  },

  // ====== RENDER HELPERS ======

  renderCPResults(cpData) {
    return `
      <div class="cp-results">
        <div class="cp-results-header">
          <span class="badge badge-green" style="font-size: 12px; padding: 6px 12px;">
            ✅ ${cpData.length} CP Ditemukan
          </span>
          <button class="btn btn-ghost btn-sm" id="btn-add-cp-manual">+ Tambah CP Manual</button>
        </div>
        <div class="cp-list" id="cp-list">
          ${cpData.map((cp, idx) => `
            <div class="cp-item" data-idx="${idx}">
              <div class="cp-item-header">
                <span class="cp-item-number">CP-${idx + 1}</span>
                ${cp.code ? `<span class="cp-item-code">${cp.code}</span>` : ''}
                <div style="flex:1;"></div>
                <button class="cp-item-delete" data-idx="${idx}" title="Hapus CP">✕</button>
              </div>
              <textarea class="cp-item-desc" data-idx="${idx}" rows="2">${cp.description || ''}</textarea>
              ${cp.profilLulusan && cp.profilLulusan.length > 0 ? `
                <div class="cp-profil-tags">
                  ${cp.profilLulusan.map(p => `<span class="cp-profil-tag">${p}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderDistribusiPreview(distribusi) {
    return `
      <div class="distribusi-preview">
        <div style="font-size: 12px; font-weight: 600; margin-bottom: var(--space-sm); color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">
          📅 Preview Distribusi Pertemuan
        </div>
        <div class="distribusi-timeline">
          ${distribusi.map(p => `
            <div class="distribusi-item ${p.type === 'sumatif' ? 'distribusi-sumatif' : 'distribusi-cp'}">
              <div class="distribusi-num">P${p.pertemuan}</div>
              <div class="distribusi-info">
                <span class="distribusi-badge ${p.type === 'sumatif' ? 'badge-sumatif' : 'badge-cp'}">
                  ${p.type === 'sumatif' ? '📝 Sumatif' : '📚 CP'}
                </span>
                <span class="distribusi-title">${p.title || ''}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  getAutoSumatifText(total, jumlahSumatif) {
    if (jumlahSumatif <= 0) return '';
    const positions = this.calculateAutoSumatifPositions(total, jumlahSumatif);
    return `Default: Pertemuan ke-${positions.join(', ')}`;
  },

  calculateAutoSumatifPositions(total, jumlahSumatif) {
    if (jumlahSumatif <= 0) return [];
    const positions = [];
    const interval = Math.floor(total / jumlahSumatif);
    for (let i = 1; i <= jumlahSumatif; i++) {
      const pos = Math.min(i * interval, total);
      positions.push(pos);
    }
    // Ensure last one is the total if not already
    if (positions.length > 0 && positions[positions.length - 1] !== total) {
      positions[positions.length - 1] = total;
    }
    return positions;
  },

  // ====== INIT ======

  init() {
    // Dynamic doc type options based on role
    const updateDocOptions = () => {
      const role = document.getElementById('input-role').value;
      const container = document.getElementById('input-doctype-container');
      const subjectPhaseRow = document.getElementById('row-subject-phase');
      const cpCard = document.getElementById('cp-scanning-card');
      const modulCard = document.getElementById('modul-ajar-card');
      const currentDocTypes = state.get('book.docTypes') || [];

      container.innerHTML = '';
      const options = role === 'guru' 
        ? [
            {v:"modul_ajar", l:"📄 Modul Ajar / RPP", icon:"📄"},
            {v:"atp", l:"🎯 ATP", icon:"🎯"},
            {v:"prota", l:"📅 Prota", icon:"📅"},
            {v:"promes", l:"📆 Promes", icon:"📆"},
            {v:"assesmen", l:"📝 Asesmen", icon:"📝"},
            {v:"jurnal", l:"📓 Jurnal Harian", icon:"📓"},
          ]
        : [
            {v:"rkt", l:"📋 RKT", icon:"📋"},
            {v:"rkas", l:"💰 RKAS", icon:"💰"},
            {v:"eds", l:"📊 EDS", icon:"📊"},
            {v:"supervisi", l:"👁️ Supervisi", icon:"👁️"},
            {v:"pengembangan", l:"🚀 Pengembangan", icon:"🚀"},
          ];

      container.innerHTML = options.map(o => `
        <label class="doctype-chip ${currentDocTypes.includes(o.v) ? 'active' : ''}">
          <input type="checkbox" name="doctype" value="${o.v}" ${currentDocTypes.includes(o.v) ? "checked" : ""}>
          <span>${o.l}</span>
        </label>
      `).join('');

      // Toggle active class on click
      container.querySelectorAll('.doctype-chip input').forEach(cb => {
        cb.addEventListener('change', () => {
          cb.closest('.doctype-chip').classList.toggle('active', cb.checked);
        });
      });

      subjectPhaseRow.style.display = role === 'guru' ? 'grid' : 'none';
      if (cpCard) cpCard.style.display = role === 'guru' ? 'block' : 'none';
      if (modulCard) modulCard.style.display = role === 'guru' ? 'block' : 'none';
    };
    
    document.getElementById('input-role')?.addEventListener('change', updateDocOptions);
    updateDocOptions();

    // School level card selection
    document.querySelectorAll('input[name="school-level"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.school-level-card').forEach(c => c.classList.remove('active'));
        radio.closest('.school-level-card').classList.add('active');
      });
    });

    // ====== CP SCANNING ======
    document.getElementById('btn-scan-cp')?.addEventListener('click', () => this.handleScanCP());
    document.getElementById('btn-clear-cp')?.addEventListener('click', () => {
      state.set('book.cpData', []);
      state.set('book.cpScanned', false);
      this.refreshCPResults();
      showToast('CP dihapus.', 'info');
    });

    // CP item editing & deletion
    this.attachCPListeners();

    // ====== MODUL AJAR MODE ======
    document.querySelectorAll('input[name="modul-ajar-mode"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('#modul-ajar-mode-grid .school-level-card').forEach(c => c.classList.remove('active'));
        radio.closest('.school-level-card').classList.add('active');
        
        const mode = radio.value || null;
        state.set('book.modulAjarMode', mode);
        
        const settingsDiv = document.getElementById('modul-ajar-settings');
        settingsDiv.style.display = mode ? 'block' : 'none';

        if (mode) {
          const slider = document.getElementById('input-total-pertemuan');
          if (mode === 'semester') {
            slider.min = 6; slider.max = 8; slider.value = 6;
            state.set('book.totalPertemuan', 6);
          } else {
            slider.min = 12; slider.max = 16; slider.value = 12;
            state.set('book.totalPertemuan', 12);
          }
          document.getElementById('pertemuan-value').textContent = slider.value;
          // Update range labels
          const labels = slider.parentElement.querySelector('.range-labels');
          if (labels) {
            labels.children[0].textContent = slider.min;
            labels.children[1].textContent = slider.max;
          }
          this.updateAutoSumatifPreview();
        }
      });
    });

    // Pertemuan slider
    document.getElementById('input-total-pertemuan')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      document.getElementById('pertemuan-value').textContent = val;
      state.set('book.totalPertemuan', val);
      this.updateAutoSumatifPreview();
    });

    // Sumatif slider
    document.getElementById('input-jumlah-sumatif')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      document.getElementById('sumatif-value').textContent = val;
      state.set('book.jumlahSumatif', val);
      
      const posConfig = document.getElementById('sumatif-position-config');
      posConfig.style.display = val > 0 ? 'block' : 'none';
      this.updateAutoSumatifPreview();
    });

    // Sumatif position mode
    document.querySelectorAll('input[name="sumatif-pos-mode"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const isCustom = radio.value === 'custom';
        document.getElementById('sumatif-custom-positions').style.display = isCustom ? 'block' : 'none';
        document.getElementById('sumatif-auto-preview').style.display = isCustom ? 'none' : 'block';
        if (!isCustom) {
          state.set('book.sumatifPositions', []);
        }
      });
    });

    // Generate distribusi
    document.getElementById('btn-generate-distribusi')?.addEventListener('click', () => this.handleGenerateDistribusi());
  },

  // ====== CP SCANNING HANDLER ======

  async handleScanCP() {
    const subject = document.getElementById('input-subject')?.value?.trim();
    const classPhase = document.getElementById('input-classphase')?.value?.trim();

    if (!subject) {
      showToast('Isi Mata Pelajaran terlebih dahulu.', 'warning');
      document.getElementById('input-subject')?.focus();
      return;
    }
    if (!classPhase) {
      showToast('Isi Fase / Kelas terlebih dahulu.', 'warning');
      document.getElementById('input-classphase')?.focus();
      return;
    }

    isScanningCP = true;
    const btn = document.getElementById('btn-scan-cp');
    const loading = document.getElementById('cp-scanning-loading');
    btn.disabled = true;
    btn.textContent = '⏳ Scanning...';
    loading.style.display = 'block';

    try {
      const prompt = cpScanningPrompt(subject, classPhase);
      const response = await generateText(prompt);
      const data = parseJsonResponse(response);

      if (data.cpList && Array.isArray(data.cpList)) {
        const cpData = data.cpList.map((cp, idx) => ({
          id: uid(),
          code: cp.code || `CP-${idx + 1}`,
          description: cp.description || '',
          elemen: cp.elemen || '',
          profilLulusan: cp.profilLulusan || [],
        }));

        state.set('book.cpData', cpData);
        state.set('book.cpScanned', true);
        showToast(`✅ Ditemukan ${cpData.length} Capaian Pembelajaran!`, 'success');
        this.refreshCPResults();
      } else {
        throw new Error('Format respons AI tidak sesuai.');
      }
    } catch (err) {
      showToast(`Gagal scanning CP: ${err.message}`, 'error');
    } finally {
      isScanningCP = false;
      btn.disabled = false;
      btn.textContent = state.get('book.cpData')?.length > 0 ? '🔄 Scan Ulang CP' : '🔬 Mulai Scanning CP';
      loading.style.display = 'none';
    }
  },

  refreshCPResults() {
    const container = document.getElementById('cp-results-container');
    const cpData = state.get('book.cpData') || [];
    if (container) {
      container.innerHTML = cpData.length > 0 ? this.renderCPResults(cpData) : `
        <div class="cp-empty-hint" style="text-align:center; padding: var(--space-lg); color: var(--text-tertiary); font-size: var(--fs-sm);">
          <div style="font-size: 2rem; margin-bottom: var(--space-xs);">📋</div>
          Belum ada CP. Isi mata pelajaran & fase di atas, lalu klik "Mulai Scanning CP".
        </div>
      `;
      this.attachCPListeners();
    }
    // Update distribusi button state
    const distBtn = document.getElementById('btn-generate-distribusi');
    if (distBtn) {
      distBtn.disabled = cpData.length === 0;
      if (cpData.length === 0) distBtn.title = 'Scan CP terlebih dahulu';
      else distBtn.title = '';
    }
  },

  attachCPListeners() {
    // Delete CP
    document.querySelectorAll('.cp-item-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        const cpData = state.get('book.cpData') || [];
        cpData.splice(idx, 1);
        state.set('book.cpData', cpData);
        this.refreshCPResults();
      });
    });

    // Edit CP description
    document.querySelectorAll('.cp-item-desc').forEach(textarea => {
      textarea.addEventListener('change', () => {
        const idx = parseInt(textarea.dataset.idx);
        const cpData = state.get('book.cpData') || [];
        if (cpData[idx]) {
          cpData[idx].description = textarea.value;
          state.set('book.cpData', cpData);
        }
      });
    });

    // Add CP manual
    document.getElementById('btn-add-cp-manual')?.addEventListener('click', () => {
      const cpData = state.get('book.cpData') || [];
      cpData.push({
        id: uid(),
        code: `CP-CUSTOM-${cpData.length + 1}`,
        description: '',
        elemen: '',
        profilLulusan: [],
      });
      state.set('book.cpData', cpData);
      this.refreshCPResults();
      // Focus the new textarea
      setTimeout(() => {
        const textareas = document.querySelectorAll('.cp-item-desc');
        if (textareas.length > 0) textareas[textareas.length - 1].focus();
      }, 100);
    });
  },

  // ====== DISTRIBUSI PERTEMUAN ======

  updateAutoSumatifPreview() {
    const total = parseInt(document.getElementById('input-total-pertemuan')?.value) || 12;
    const jumlahSumatif = parseInt(document.getElementById('input-jumlah-sumatif')?.value) || 0;
    const textEl = document.getElementById('sumatif-auto-text');
    if (textEl) {
      textEl.textContent = this.getAutoSumatifText(total, jumlahSumatif);
    }
  },

  async handleGenerateDistribusi() {
    const cpData = state.get('book.cpData') || [];
    if (cpData.length === 0) {
      showToast('Scan CP terlebih dahulu sebelum membuat distribusi.', 'warning');
      return;
    }

    const totalPertemuan = parseInt(document.getElementById('input-total-pertemuan')?.value) || 12;
    const jumlahSumatif = parseInt(document.getElementById('input-jumlah-sumatif')?.value) || 0;
    const mode = state.get('book.modulAjarMode');

    // Get sumatif positions
    let sumatifPositions = [];
    const posMode = document.querySelector('input[name="sumatif-pos-mode"]:checked')?.value;
    if (posMode === 'custom') {
      const customInput = document.getElementById('input-sumatif-positions')?.value || '';
      sumatifPositions = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= totalPertemuan);
      if (sumatifPositions.length !== jumlahSumatif && jumlahSumatif > 0) {
        showToast(`Masukkan tepat ${jumlahSumatif} posisi sumatif.`, 'warning');
        return;
      }
    } else {
      sumatifPositions = this.calculateAutoSumatifPositions(totalPertemuan, jumlahSumatif);
    }

    state.set('book.sumatifPositions', sumatifPositions);
    state.set('book.totalPertemuan', totalPertemuan);
    state.set('book.jumlahSumatif', jumlahSumatif);

    isDistributing = true;
    const btn = document.getElementById('btn-generate-distribusi');
    btn.disabled = true;
    btn.textContent = '⏳ Membuat distribusi...';

    try {
      const prompt = distribusiPertemuanPrompt(cpData, totalPertemuan, jumlahSumatif, sumatifPositions, mode);
      const response = await generateText(prompt);
      const data = parseJsonResponse(response);

      if (data.distribusi && Array.isArray(data.distribusi)) {
        state.set('book.distribusiPertemuan', data.distribusi);
        showToast(`✅ Distribusi ${data.distribusi.length} pertemuan berhasil!`, 'success');
        
        const previewContainer = document.getElementById('distribusi-preview');
        if (previewContainer) {
          previewContainer.innerHTML = this.renderDistribusiPreview(data.distribusi);
        }
      } else {
        throw new Error('Format respons distribusi tidak sesuai.');
      }
    } catch (err) {
      showToast(`Gagal membuat distribusi: ${err.message}`, 'error');
    } finally {
      isDistributing = false;
      btn.disabled = false;
      btn.textContent = '📊 Generate Distribusi Pertemuan';
    }
  },

  // ====== VALIDATION & DATA ======

  validate() {
    this.getData();
    const book = state.get('book');

    if (book.docTypes.length === 0) {
      showToast('Pilih minimal satu jenis dokumen.', 'warning');
      return false;
    }

    if (book.targetRole === 'guru') {
      if (!book.subject.trim()) {
        showToast('Mata Pelajaran wajib diisi.', 'warning');
        document.getElementById('input-subject')?.focus();
        return false;
      }
      if (!book.classPhase.trim()) {
        showToast('Fase / Kelas wajib diisi.', 'warning');
        document.getElementById('input-classphase')?.focus();
        return false;
      }
    }

    // Check API settings — Gemini uses server proxy if no user key
    const settings = state.get('settings');
    const provider = settings.apiProvider;
    if (provider === 'qwen' && !settings.qwenKey.trim()) {
      showToast('Qwen API Key belum diisi. Klik ⚙️ di header untuk mengatur.', 'warning');
      return false;
    }

    // Validate modul ajar multi-pertemuan
    if (book.modulAjarMode && book.cpData.length > 0 && book.distribusiPertemuan.length === 0) {
      showToast('Mode Modul Ajar aktif tapi distribusi belum dibuat. Klik "Generate Distribusi Pertemuan" atau nonaktifkan mode.', 'warning');
      return false;
    }

    // Update project name
    let projName = book.docTypes.join('_').toUpperCase() + (book.topic ? ' - ' + book.topic : '');
    if (projName.length > 30) projName = projName.substring(0, 30) + '...';
    document.getElementById('project-name').textContent = projName;

    return true;
  },

  getData() {
    state.set('book.targetRole', document.getElementById('input-role')?.value || 'guru');
    const checkedDocs = Array.from(document.querySelectorAll('input[name="doctype"]:checked')).map(cb => cb.value);
    state.set('book.docTypes', checkedDocs.length > 0 ? checkedDocs : ['modul_ajar']);
    state.set('book.subject', document.getElementById('input-subject')?.value || '');
    state.set('book.classPhase', document.getElementById('input-classphase')?.value || '');
    state.set('book.schoolLevel', document.querySelector('input[name="school-level"]:checked')?.value || 'kota');
    state.set('book.topic', document.getElementById('input-topic')?.value || '');
    state.set('book.description', document.getElementById('input-desc')?.value || '');
    state.set('book.chapterLength', document.getElementById('input-length')?.value || 'sedang');
    state.set('book.referenceText', document.getElementById('input-reference')?.value || '');
    
    // Modul ajar settings
    const modulMode = document.querySelector('input[name="modul-ajar-mode"]:checked')?.value || null;
    state.set('book.modulAjarMode', modulMode || null);
    if (modulMode) {
      state.set('book.totalPertemuan', parseInt(document.getElementById('input-total-pertemuan')?.value) || 12);
      state.set('book.jumlahSumatif', parseInt(document.getElementById('input-jumlah-sumatif')?.value) || 0);
    }
  },
};
