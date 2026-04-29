// ============================================================
// Setup Module — Step 1: Data Input + CP Scanning
// ============================================================

import { state } from '../state.js';
import { showToast, uid } from '../utils/helpers.js';
import { generateText, parseJsonResponse } from '../services/gemini.js';
import { cpScanningPrompt } from '../utils/prompts.js';
import { getSubjectsForJenjang, getFasesForSubject, getCPList, jenjangMapping } from '../utils/cp-data.js';
import { analisisSemuaCP, formatAnalisisForPrompt } from '../utils/cp-analyzer.js';

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

        <div class="form-row" id="row-jenjang">
          <div class="form-group">
            <label class="form-label">Jenjang Sekolah <span class="required">*</span></label>
            <div class="school-level-grid" id="jenjang-grid">
              ${['PAUD', 'SD', 'SMP', 'SMA', 'Paket'].map(j => `
                <label class="school-level-card ${book.jenjang === j ? 'active' : ''}" style="padding: 10px 14px;">
                  <input type="radio" name="jenjang" value="${j}" ${book.jenjang === j ? 'checked' : ''} />
                  <div class="school-level-title" style="font-size: 0.85rem;">${j}</div>
                </label>
              `).join('')}
            </div>
            <small class="form-hint">Mempengaruhi pilihan mapel dan fase.</small>
          </div>
        </div>

        <div class="form-row" id="row-subject-phase">
          <div class="form-group">
            <label class="form-label" for="input-subject">Mata Pelajaran <span class="required">*</span></label>
            <select class="form-select" id="input-subject">
              <option value="">-- Pilih Jenjang Terlebih Dahulu --</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="input-classphase">Fase <span class="required">*</span></label>
            <select class="form-select" id="input-classphase">
              <option value="">-- Pilih Mapel Terlebih Dahulu --</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ====== CP SCANNING (Auto Load) ====== -->
      <div class="card cp-scanning-card" style="margin-bottom: var(--space-lg);" id="cp-scanning-card">
        <div class="card-header">
          <h3 class="card-title">📋 Data Capaian Pembelajaran (CP)</h3>
          <span class="badge badge-purple">Otomatis BSKAP 046/2025</span>
        </div>
        <p class="form-hint" style="margin-bottom: var(--space-md);">
          CP dimuat secara otomatis berdasarkan pilihan jenjang, mapel, dan fase. Anda dapat menambah atau mengedit CP secara manual jika diperlukan.
        </p>

        <div style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-md);">
          ${cpData.length > 0 ? `
            <button class="btn btn-ghost btn-sm" id="btn-clear-cp">🗑️ Hapus Semua CP</button>
          ` : ''}
        </div>

        <div id="cp-results-container">
          ${cpData.length > 0 ? this.renderCPResults(cpData) : `
            <div class="cp-empty-hint" style="text-align:center; padding: var(--space-lg); color: var(--text-tertiary); font-size: var(--fs-sm);">
              <div style="font-size: 2rem; margin-bottom: var(--space-xs);">📋</div>
              Belum ada CP. Pilih Jenjang, Mata Pelajaran, dan Fase di atas agar CP termuat otomatis.
            </div>
          `}
        </div>
      </div>

      <!-- ====== ANALISIS CP (Bedah Kalimat) ====== -->
      <div class="card" style="margin-bottom: var(--space-lg);" id="analisis-cp-card">
        <div class="card-header">
          <h3 class="card-title">🔬 Analisis Narasi CP</h3>
          <span class="badge badge-blue">Bedah Kalimat</span>
        </div>
        <p class="form-hint" style="margin-bottom: var(--space-md);">
          Bedah CP menjadi <strong>Kompetensi</strong> (Kata Kerja Operasional) dan <strong>Lingkup Materi</strong>. 
          Hasil analisis menjadi fondasi penyusunan TP, ATP, KKTP, Asesmen, dan Modul Ajar.
        </p>
        
        <div style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-md);">
          <button class="btn btn-primary btn-sm" id="btn-analisis-cp" ${cpData.length === 0 ? 'disabled' : ''}>
            🔍 Analisis CP Otomatis
          </button>
        </div>

        <div id="analisis-cp-container">
          ${(state.get('book.cpAnalisis') && state.get('book.cpAnalisis').length > 0) ? this.renderAnalisisCP(state.get('book.cpAnalisis')) : `
            <div style="text-align:center; padding: var(--space-lg); color: var(--text-tertiary); font-size: var(--fs-sm);">
              <div style="font-size: 2rem; margin-bottom: var(--space-xs);">🔬</div>
              Klik tombol "Analisis CP Otomatis" setelah CP dimuat untuk membedah narasi CP.
            </div>
          `}
        </div>
      </div>

      <!-- ====== SEMESTER & TAHUN AJARAN ====== -->
      <div class="card" style="margin-bottom: var(--space-lg);" id="jenjang-card">
        <div class="card-header">
          <h3 class="card-title">📅 Semester & Tahun Ajaran</h3>
          <span class="badge badge-purple">Penting</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="input-semester">Semester</label>
            <select class="form-select" id="input-semester">
              <option value="1" ${book.semester === '1' ? 'selected' : ''}>Semester 1 (Ganjil)</option>
              <option value="2" ${book.semester === '2' ? 'selected' : ''}>Semester 2 (Genap)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="input-tahun-ajaran">Tahun Ajaran</label>
            <input class="form-input" id="input-tahun-ajaran" type="text" placeholder="2025/2026" value="${book.tahunAjaran || ''}" />
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

  /**
   * Render hasil analisis CP
   */
  renderAnalisisCP(analisisResults) {
    if (!analisisResults || analisisResults.length === 0) return '';
    
    // Compute totals
    let totalKKO = 0, totalMateri = 0, totalTP = 0;
    const bloomCounts = {};
    for (const r of analisisResults) {
      totalKKO += r.analisis.kompetensi.length;
      totalMateri += r.analisis.lingkupMateri.length;
      totalTP += r.analisis.tujuanPembelajaran.length;
      for (const k of r.analisis.kompetensi) {
        bloomCounts[k.levelShort] = (bloomCounts[k.levelShort] || 0) + 1;
      }
    }
    
    const bloomColors = {
      C1: '#6366f1', C2: '#8b5cf6', C3: '#3b82f6',
      C4: '#f59e0b', C5: '#ef4444', C6: '#10b981',
    };

    return `
      <div class="analisis-cp-results">
        <!-- Summary Stats -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: var(--space-sm); margin-bottom: var(--space-md);">
          <div style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 12px; text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 700; color: #6366f1;">${totalKKO}</div>
            <div style="font-size: 0.7rem; color: var(--text-tertiary); text-transform: uppercase;">Kompetensi (KKO)</div>
          </div>
          <div style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); border-radius: 12px; padding: 12px; text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 700; color: #3b82f6;">${totalMateri}</div>
            <div style="font-size: 0.7rem; color: var(--text-tertiary); text-transform: uppercase;">Lingkup Materi</div>
          </div>
          <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; padding: 12px; text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 700; color: #10b981;">${totalTP}</div>
            <div style="font-size: 0.7rem; color: var(--text-tertiary); text-transform: uppercase;">Rumusan TP</div>
          </div>
          <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 12px; text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 700; color: #f59e0b;">${Object.keys(bloomCounts).sort().join(', ') || '-'}</div>
            <div style="font-size: 0.7rem; color: var(--text-tertiary); text-transform: uppercase;">Level Bloom</div>
          </div>
        </div>

        <!-- Bloom Taxonomy Bar -->
        ${Object.keys(bloomCounts).length > 0 ? `
          <div style="margin-bottom: var(--space-md);">
            <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">Distribusi Taksonomi Bloom</div>
            <div style="display: flex; height: 8px; border-radius: 8px; overflow: hidden; gap: 2px;">
              ${Object.entries(bloomCounts).sort().map(([level, count]) => `
                <div style="flex: ${count}; background: ${bloomColors[level] || '#888'}; position: relative;" title="${level}: ${count} KKO"></div>
              `).join('')}
            </div>
            <div style="display: flex; gap: var(--space-sm); margin-top: 6px; flex-wrap: wrap;">
              ${Object.entries(bloomCounts).sort().map(([level, count]) => `
                <span style="font-size: 0.65rem; display: flex; align-items: center; gap: 4px; color: var(--text-tertiary);">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: ${bloomColors[level] || '#888'};"></span>
                  ${level} (${count})
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Per-CP Detail -->
        ${analisisResults.map((result, rIdx) => `
          <details class="analisis-cp-detail" ${rIdx === 0 ? 'open' : ''} style="margin-bottom: var(--space-sm); background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden;">
            <summary style="padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: var(--space-sm); font-weight: 600; font-size: 0.85rem;">
              <span style="background: rgba(99,102,241,0.2); color: #a5b4fc; padding: 2px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700;">${result.cpCode}</span>
              <span style="flex: 1; color: var(--text-primary);">${result.cpDescription.substring(0, 80)}${result.cpDescription.length > 80 ? '...' : ''}</span>
              <span style="font-size: 0.7rem; color: var(--text-tertiary);">${result.analisis.statistik.totalKKO} KKO · ${result.analisis.statistik.totalMateri} Materi</span>
            </summary>
            <div style="padding: 0 16px 16px 16px;">
              <!-- Kompetensi -->
              ${result.analisis.kompetensi.length > 0 ? `
                <div style="margin-bottom: var(--space-sm);">
                  <div style="font-size: 0.7rem; font-weight: 700; color: #a78bfa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">📌 Kompetensi (Kata Kerja Operasional)</div>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${result.analisis.kompetensi.map(k => `
                      <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 600;
                        background: ${bloomColors[k.levelShort] || '#888'}22; color: ${bloomColors[k.levelShort] || '#888'}; border: 1px solid ${bloomColors[k.levelShort] || '#888'}44;">
                        ${k.kataKerja}
                        <span style="font-size: 0.6rem; opacity: 0.7;">[${k.levelShort}]</span>
                      </span>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Lingkup Materi -->
              ${result.analisis.lingkupMateri.length > 0 ? `
                <div style="margin-bottom: var(--space-sm);">
                  <div style="font-size: 0.7rem; font-weight: 700; color: #60a5fa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">📚 Lingkup Materi</div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${result.analisis.lingkupMateri.map((m, mIdx) => `
                      <div style="padding: 6px 12px; background: rgba(59,130,246,0.08); border-radius: 8px; font-size: 0.75rem; color: var(--text-secondary);">
                        <strong>${mIdx + 1}.</strong> ${m.topik}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Tujuan Pembelajaran -->
              ${result.analisis.tujuanPembelajaran.length > 0 ? `
                <div>
                  <div style="font-size: 0.7rem; font-weight: 700; color: #34d399; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">🎯 Rumusan Tujuan Pembelajaran (TP)</div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${result.analisis.tujuanPembelajaran.map((tp, tIdx) => `
                      <div style="padding: 8px 12px; background: rgba(16,185,129,0.08); border-left: 3px solid #10b981; border-radius: 0 8px 8px 0; font-size: 0.75rem;">
                        <div style="color: var(--text-primary); font-weight: 500;">TP ${tIdx + 1}: ${tp.tp}</div>
                        <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 2px;">Kompetensi: ${tp.kompetensi} [${tp.levelBloom}] · Materi: ${tp.lingkupMateri}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </details>
        `).join('')}
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
    };
    
    document.getElementById('input-role')?.addEventListener('change', updateDocOptions);
    updateDocOptions();

    // ====== JENJANG AUTO-SET & DROPDOWNS ======
    document.querySelectorAll('input[name="jenjang"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('#jenjang-grid .school-level-card').forEach(c => c.classList.remove('active'));
        radio.closest('.school-level-card').classList.add('active');
        
        const jenjang = radio.value;
        state.set('book.jenjang', jenjang);
        
        // Auto-set JP duration based on level
        const jpMap = { 'PAUD': 30, 'SD': 30, 'SMP': 40, 'SMA': 45, 'Paket': 40 };
        const durasiJP = jpMap[jenjang] || 40;
        const slider = document.getElementById('input-durasi-jp');
        if (slider) { slider.value = durasiJP; }
        const label = document.getElementById('durasi-jp-value');
        if (label) label.textContent = durasiJP;
        this.updateTotalMenit();

        // Populate Subjects Dropdown
        const subjectSelect = document.getElementById('input-subject');
        const subjects = getSubjectsForJenjang(jenjang);
        
        if (subjects.length > 0) {
          subjectSelect.innerHTML = '<option value="">-- Pilih Mata Pelajaran --</option>' + 
            subjects.map(s => `<option value="${s}">${s}</option>`).join('');
        } else {
          subjectSelect.innerHTML = '<option value="">-- Tidak Ada Data Mapel --</option>';
        }
        
        // Reset phase and CP
        document.getElementById('input-classphase').innerHTML = '<option value="">-- Pilih Mapel Terlebih Dahulu --</option>';
        state.set('book.subject', '');
        state.set('book.classPhase', '');
        state.set('book.cpData', []);
        this.refreshCPResults();
      });
    });

    // Subject selection -> Populate Phase
    document.getElementById('input-subject')?.addEventListener('change', (e) => {
      const subject = e.target.value;
      const jenjang = state.get('book.jenjang');
      state.set('book.subject', subject);
      
      const phaseSelect = document.getElementById('input-classphase');
      if (!subject) {
        phaseSelect.innerHTML = '<option value="">-- Pilih Mapel Terlebih Dahulu --</option>';
        return;
      }

      const fases = getFasesForSubject(jenjang, subject);
      if (fases.length > 0) {
        phaseSelect.innerHTML = '<option value="">-- Pilih Fase --</option>' + 
          fases.map(f => `<option value="${f}">Fase ${f}</option>`).join('');
      } else {
        phaseSelect.innerHTML = '<option value="">-- Tidak Ada Data Fase --</option>';
      }
      
      // Reset CP
      state.set('book.classPhase', '');
      state.set('book.cpData', []);
      this.refreshCPResults();
    });

    // Phase selection -> Load CP
    document.getElementById('input-classphase')?.addEventListener('change', (e) => {
      const fase = e.target.value;
      const jenjang = state.get('book.jenjang');
      const subject = state.get('book.subject');
      state.set('book.classPhase', fase);
      
      if (!fase) {
        state.set('book.cpData', []);
        this.refreshCPResults();
        return;
      }

      // Load CP directly from database
      const cplist = getCPList(jenjang, subject, fase);
      if (cplist && cplist.length > 0) {
        const cpData = cplist.map((cp, idx) => ({
          id: uid(),
          code: cp.code || `CP-${idx + 1}`,
          description: cp.description || '',
          elemen: cp.elemen || '',
          profilLulusan: cp.profilLulusan || [],
        }));
        state.set('book.cpData', cpData);
        state.set('book.cpScanned', true);

        // Auto-trigger CP analysis
        const analisisResults = analisisSemuaCP(cpData);
        state.set('book.cpAnalisis', analisisResults);
        this.refreshAnalisisCP(analisisResults);
        showToast(`✅ Berhasil memuat ${cpData.length} CP & analisis otomatis!`, 'success');
      } else {
        state.set('book.cpData', []);
        state.set('book.cpScanned', false);
        state.set('book.cpAnalisis', []);
        this.refreshAnalisisCP([]);
        showToast('Data CP belum tersedia untuk pilihan ini.', 'warning');
      }
      this.refreshCPResults();
    });

    // ====== CP SCANNING ======
    document.getElementById('btn-clear-cp')?.addEventListener('click', () => {
      state.set('book.cpData', []);
      state.set('book.cpScanned', false);
      state.set('book.cpAnalisis', []);
      this.refreshCPResults();
      this.refreshAnalisisCP([]);
      showToast('CP dihapus. Anda dapat mengisi kembali secara manual atau memilih ulang fase.', 'info');
    });

    // ====== ANALISIS CP ======
    document.getElementById('btn-analisis-cp')?.addEventListener('click', () => {
      const cpData = state.get('book.cpData') || [];
      if (cpData.length === 0) {
        showToast('Muat CP terlebih dahulu sebelum menganalisis.', 'warning');
        return;
      }
      const analisisResults = analisisSemuaCP(cpData);
      state.set('book.cpAnalisis', analisisResults);
      this.refreshAnalisisCP(analisisResults);
      
      const totalKKO = analisisResults.reduce((sum, r) => sum + r.analisis.kompetensi.length, 0);
      const totalTP = analisisResults.reduce((sum, r) => sum + r.analisis.tujuanPembelajaran.length, 0);
      showToast(`🔬 Analisis selesai! ${totalKKO} KKO & ${totalTP} TP ditemukan.`, 'success');
    });

    // CP item editing & deletion
    this.attachCPListeners();

    // School level card selection (Kota, Pinggiran, Pelosok)
    document.querySelectorAll('input[name="school-level"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('#school-level-grid .school-level-card').forEach(c => c.classList.remove('active'));
        radio.closest('.school-level-card').classList.add('active');
      });
    });
  },

  // ====== HELPER: Update total menit display ======
  updateTotalMenit() {
    const durasiJP = parseInt(document.getElementById('input-durasi-jp')?.value) || 40;
    const jpPerPertemuan = parseInt(document.getElementById('input-jp-per-pertemuan')?.value) || 2;
    const total = durasiJP * jpPerPertemuan;
    const display = document.getElementById('total-menit-display');
    if (display) display.textContent = `${total} menit`;
  },

  // ====== CP SCANNING HANDLER ======
  // Diganti menggunakan auto-load dari cp-data.js

  refreshCPResults() {
    const container = document.getElementById('cp-results-container');
    const cpData = state.get('book.cpData') || [];
    if (container) {
      container.innerHTML = cpData.length > 0 ? this.renderCPResults(cpData) : `
        <div class="cp-empty-hint" style="text-align:center; padding: var(--space-lg); color: var(--text-tertiary); font-size: var(--fs-sm);">
          <div style="font-size: 2rem; margin-bottom: var(--space-xs);">📋</div>
          Belum ada CP. Pilih Jenjang, Mata Pelajaran, dan Fase di atas agar CP termuat otomatis.
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

  /**
   * Refresh the Analisis CP container
   */
  refreshAnalisisCP(analisisResults) {
    const container = document.getElementById('analisis-cp-container');
    if (!container) return;
    
    if (analisisResults && analisisResults.length > 0) {
      container.innerHTML = this.renderAnalisisCP(analisisResults);
    } else {
      container.innerHTML = `
        <div style="text-align:center; padding: var(--space-lg); color: var(--text-tertiary); font-size: var(--fs-sm);">
          <div style="font-size: 2rem; margin-bottom: var(--space-xs);">🔬</div>
          Klik tombol "Analisis CP Otomatis" setelah CP dimuat untuk membedah narasi CP.
        </div>
      `;
    }
    
    // Update analisis button state
    const btn = document.getElementById('btn-analisis-cp');
    if (btn) {
      const cpData = state.get('book.cpData') || [];
      btn.disabled = cpData.length === 0;
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

  // ====== VALIDATION & DATA ======

  validate() {
    this.getData();
    const book = state.get('book');

    if (book.docTypes.length === 0) {
      showToast('Pilih minimal satu jenis dokumen.', 'warning');
      return false;
    }

    if (book.targetRole === 'guru') {
      if (!book.jenjang) {
        showToast('Pilih Jenjang Sekolah terlebih dahulu.', 'warning');
        return false;
      }
      if (!book.subject) {
        showToast('Pilih Mata Pelajaran terlebih dahulu.', 'warning');
        document.getElementById('input-subject')?.focus();
        return false;
      }
      if (!book.classPhase) {
        showToast('Pilih Fase terlebih dahulu.', 'warning');
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
    
    // Jenjang & Semester
    state.set('book.jenjang', document.querySelector('input[name="jenjang"]:checked')?.value || '');
    state.set('book.semester', document.getElementById('input-semester')?.value || '1');
    state.set('book.tahunAjaran', document.getElementById('input-tahun-ajaran')?.value || '');
  },
};
