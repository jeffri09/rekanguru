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

      <!-- ====== JENJANG & SEMESTER (Phase 1) ====== -->
      <div class="card" style="margin-bottom: var(--space-lg);" id="jenjang-card">
        <div class="card-header">
          <h3 class="card-title">🎓 Jenjang & Semester</h3>
          <span class="badge badge-purple">Penting</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Jenjang Sekolah</label>
            <div class="school-level-grid" id="jenjang-grid">
              ${['SD', 'SMP', 'SMA', 'SMK', 'MA'].map(j => `
                <label class="school-level-card ${book.jenjang === j ? 'active' : ''}" style="padding: 10px 14px;">
                  <input type="radio" name="jenjang" value="${j}" ${book.jenjang === j ? 'checked' : ''} />
                  <div class="school-level-title" style="font-size: 0.85rem;">${j}</div>
                </label>
              `).join('')}
            </div>
            <small class="form-hint">Mempengaruhi durasi JP: SD=30, SMP=40, SMA/SMK/MA=45 menit</small>
          </div>
          <div class="form-group">
            <label class="form-label" for="input-semester">Semester</label>
            <select class="form-select" id="input-semester">
              <option value="1" ${book.semester === '1' ? 'selected' : ''}>Semester 1 (Ganjil)</option>
              <option value="2" ${book.semester === '2' ? 'selected' : ''}>Semester 2 (Genap)</option>
            </select>
            <div class="form-group" style="margin-top: var(--space-sm);">
              <label class="form-label" for="input-tahun-ajaran">Tahun Ajaran</label>
              <input class="form-input" id="input-tahun-ajaran" type="text" placeholder="2025/2026" value="${book.tahunAjaran || ''}" />
            </div>
          </div>
        </div>
      </div>

      <!-- ====== ALOKASI WAKTU (Phase 2) ====== -->
      <div class="card" style="margin-bottom: var(--space-lg);" id="alokasi-waktu-card">
        <div class="card-header">
          <h3 class="card-title">⏱️ Alokasi Waktu Pembelajaran</h3>
          <span class="badge badge-cyan">Penting</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="input-durasi-jp">Durasi per JP: <strong id="durasi-jp-value">${(book.alokasiWaktu || {}).durasiJP || 40}</strong> menit</label>
            <input type="range" class="form-range" id="input-durasi-jp" min="25" max="50" step="5" value="${(book.alokasiWaktu || {}).durasiJP || 40}" />
            <div class="range-labels"><span>25</span><span>30 (SD)</span><span>40 (SMP)</span><span>45 (SMA)</span><span>50</span></div>
          </div>
          <div class="form-group">
            <label class="form-label" for="input-jp-per-pertemuan">JP per Pertemuan: <strong id="jp-per-pertemuan-value">${(book.alokasiWaktu || {}).jpPerPertemuan || 2}</strong></label>
            <input type="range" class="form-range" id="input-jp-per-pertemuan" min="1" max="6" value="${(book.alokasiWaktu || {}).jpPerPertemuan || 2}" />
            <div class="range-labels"><span>1 JP</span><span>6 JP</span></div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="input-jp-per-minggu">JP per Minggu: <strong id="jp-per-minggu-value">${(book.alokasiWaktu || {}).jpPerMinggu || 4}</strong></label>
            <input type="range" class="form-range" id="input-jp-per-minggu" min="1" max="12" value="${(book.alokasiWaktu || {}).jpPerMinggu || 4}" />
            <div class="range-labels"><span>1</span><span>12</span></div>
          </div>
          <div class="form-group">
            <label class="form-label">Total Menit per Pertemuan</label>
            <div id="total-menit-display" style="font-size: 1.5rem; font-weight: 700; color: var(--accent-primary);">
              ${((book.alokasiWaktu || {}).jpPerPertemuan || 2) * ((book.alokasiWaktu || {}).durasiJP || 40)} menit
            </div>
          </div>
        </div>
      </div>

      <!-- ====== SUMATIF CONFIG (Phase 3) ====== -->
      <div class="card" style="margin-bottom: var(--space-lg);" id="sumatif-config-card">
        <div class="card-header">
          <h3 class="card-title">📝 Konfigurasi Sumatif dalam Modul Ajar</h3>
          <span class="badge badge-green">Opsional</span>
        </div>
        <p class="form-hint" style="margin-bottom: var(--space-md);">
          Atur komposisi soal untuk pertemuan sumatif harian di dalam modul ajar. Konfigurasi ini berlaku untuk SEMUA pertemuan sumatif.
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

      <!-- ====== MODEL PEMBELAJARAN (Phase 5) ====== -->
      <div class="card" style="margin-bottom: var(--space-lg);" id="model-pembelajaran-card">
        <div class="card-header">
          <h3 class="card-title">🧪 Model/Metode Pembelajaran</h3>
          <span class="badge badge-green">Opsional</span>
        </div>
        <p class="form-hint" style="margin-bottom: var(--space-md);">Pilih 1-3 model. AI akan menyesuaikan langkah pembelajaran dan asesmen.</p>
        <div class="school-level-grid" id="model-pembelajaran-grid" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">
          ${[
            { value: 'pbl', icon: '🔬', label: 'Problem Based Learning' },
            { value: 'pjbl', icon: '📐', label: 'Project Based Learning' },
            { value: 'discovery', icon: '🔍', label: 'Discovery Learning' },
            { value: 'inquiry', icon: '❓', label: 'Inquiry Based Learning' },
            { value: 'cooperative', icon: '🤝', label: 'Cooperative Learning' },
            { value: 'direct', icon: '📚', label: 'Direct Instruction' },
            { value: 'differentiated', icon: '🎯', label: 'Differentiated Instruction' },
          ].map(m => `
            <label class="school-level-card ${(book.modelPembelajaran || []).includes(m.value) ? 'active' : ''}" style="padding: 10px;">
              <input type="checkbox" name="model-pembelajaran" value="${m.value}" 
                ${(book.modelPembelajaran || []).includes(m.value) ? 'checked' : ''} hidden />
              <div class="school-level-icon">${m.icon}</div>
              <div class="school-level-title" style="font-size: 0.75rem;">${m.label}</div>
            </label>
          `).join('')}
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

    // ====== JENJANG AUTO-SET JP DURATION (Phase 1) ======
    document.querySelectorAll('input[name="jenjang"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('#jenjang-grid .school-level-card').forEach(c => c.classList.remove('active'));
        radio.closest('.school-level-card').classList.add('active');
        // Auto-set JP duration based on level
        const jpMap = { 'SD': 30, 'SMP': 40, 'SMA': 45, 'SMK': 45, 'MA': 45 };
        const durasiJP = jpMap[radio.value] || 40;
        const slider = document.getElementById('input-durasi-jp');
        if (slider) { slider.value = durasiJP; }
        const label = document.getElementById('durasi-jp-value');
        if (label) label.textContent = durasiJP;
        this.updateTotalMenit();
      });
    });

    // ====== ALOKASI WAKTU SLIDERS (Phase 2) ======
    ['input-durasi-jp', 'input-jp-per-pertemuan', 'input-jp-per-minggu'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        const labelId = id.replace('input-', '') + '-value';
        const label = document.getElementById(labelId);
        if (label) label.textContent = e.target.value;
        this.updateTotalMenit();
      });
    });

    // ====== MODEL PEMBELAJARAN TOGGLE (Phase 5) ======
    document.querySelectorAll('#model-pembelajaran-grid .school-level-card').forEach(card => {
      card.addEventListener('click', () => {
        const cb = card.querySelector('input[type="checkbox"]');
        cb.checked = !cb.checked;
        card.classList.toggle('active', cb.checked);
        // Limit to 3
        const checked = document.querySelectorAll('#model-pembelajaran-grid input[type="checkbox"]:checked');
        if (checked.length > 3) {
          cb.checked = false;
          card.classList.remove('active');
          showToast('Maksimal 3 model pembelajaran.', 'warning');
        }
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
    
    // Jenjang & Semester (Phase 1)
    state.set('book.jenjang', document.querySelector('input[name="jenjang"]:checked')?.value || '');
    state.set('book.semester', document.getElementById('input-semester')?.value || '1');
    state.set('book.tahunAjaran', document.getElementById('input-tahun-ajaran')?.value || '');

    // Alokasi Waktu (Phase 2)
    state.set('book.alokasiWaktu', {
      durasiJP: parseInt(document.getElementById('input-durasi-jp')?.value) || 40,
      jpPerPertemuan: parseInt(document.getElementById('input-jp-per-pertemuan')?.value) || 2,
      jpPerMinggu: parseInt(document.getElementById('input-jp-per-minggu')?.value) || 4,
      mingguEfektif: 18,
    });

    // Sumatif Config (Phase 3)
    const enabledTypes = {};
    const questionCount = {};
    document.querySelectorAll('.sumatif-type-toggle').forEach(cb => {
      enabledTypes[cb.dataset.type] = cb.checked;
    });
    document.querySelectorAll('.sumatif-count-input').forEach(input => {
      questionCount[input.dataset.type] = parseInt(input.value) || 5;
    });
    state.set('book.sumatifConfig', {
      enabledTypes,
      questionCount,
      pgOptionCount: parseInt(document.getElementById('input-pg-options')?.value) || 4,
      difficultyLevel: document.querySelector('input[name="difficulty-level"]:checked')?.value || 'sedang',
    });

    // Model Pembelajaran (Phase 5)
    const selectedModels = Array.from(document.querySelectorAll('input[name="model-pembelajaran"]:checked')).map(cb => cb.value);
    state.set('book.modelPembelajaran', selectedModels);

    // Modul ajar settings
    const modulMode = document.querySelector('input[name="modul-ajar-mode"]:checked')?.value || null;
    state.set('book.modulAjarMode', modulMode || null);
    if (modulMode) {
      state.set('book.totalPertemuan', parseInt(document.getElementById('input-total-pertemuan')?.value) || 12);
      state.set('book.jumlahSumatif', parseInt(document.getElementById('input-jumlah-sumatif')?.value) || 0);
    }
  },
};
