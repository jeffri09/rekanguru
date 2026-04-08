// ============================================================
// Setup Module — Step 1: Data Input (Simplified)
// ============================================================

import { state } from '../state.js';
import { showToast } from '../utils/helpers.js';

export default {
  render() {
    const book = state.get('book');

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

  init() {
    // Dynamic doc type options based on role
    const updateDocOptions = () => {
      const role = document.getElementById('input-role').value;
      const container = document.getElementById('input-doctype-container');
      const subjectPhaseRow = document.getElementById('row-subject-phase');
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
  },

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
  },
};
