// ============================================================
// Analisis ATP Module — Step 2: Alur Tujuan Pembelajaran
// Pedagogis Tahap 2: Konstruksi Jembatan (Perumusan TP & ATP)
//
// Features:
//   - Visualize all TP from CP analysis
//   - Drag-and-drop ordering (concrete → abstract)
//   - Semester assignment (Semester 1 / Semester 2)
//   - Auto-sort by Bloom level
//   - Manual reorder with move up/down
// ============================================================

import { state } from '../state.js';
import { showToast, uid } from '../utils/helpers.js';
import { analisisSemuaCP } from '../utils/cp-analyzer.js';

let dragSrcIdx = null;

export default {
  render() {
    const book = state.get('book');
    const alokasi = book.alokasiWaktu || {};
    const atp = state.get('atp') || { tujuanPembelajaran: [], ordered: false };
    const tpList = atp.tujuanPembelajaran || [];
    const semester = book.semester || '1';

    return `
      <h2 class="step-title">🎯 Susun Alur Tujuan Pembelajaran (ATP)</h2>
      <p class="step-subtitle">Urutkan Tujuan Pembelajaran (TP) dari <strong>konkret → abstrak</strong>. Anda bisa drag-and-drop atau gunakan tombol panah untuk mengatur urutan.</p>

      <!-- ATP Stats -->
      <div class="stats-bar" style="margin-bottom: var(--space-lg);">
        <div class="stat-item">
          <span class="stat-value" id="atp-total-tp">${tpList.length}</span>
          <span class="stat-label">Total TP</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="atp-sem1-count">${tpList.filter(t => t.semester === '1' || t.semester === 1).length}</span>
          <span class="stat-label">Semester 1</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="atp-sem2-count">${tpList.filter(t => t.semester === '2' || t.semester === 2).length}</span>
          <span class="stat-label">Semester 2</span>
        </div>
        <div style="flex:1;"></div>
        <div style="display:flex; gap: var(--space-sm);">
          <button class="btn btn-secondary btn-sm" id="btn-atp-auto-sort" title="Urutkan otomatis berdasarkan level Bloom (C1→C6)">
            🔄 Auto Urutkan
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-atp-reload" title="Muat ulang TP dari hasil analisis CP">
            🔃 Reload dari CP
          </button>
        </div>
      </div>

      <!-- ====== ALOKASI WAKTU (Moved from Step 1) ====== -->
      <div class="card" style="margin-bottom: var(--space-lg);" id="alokasi-waktu-card">
        <div class="card-header">
          <h3 class="card-title">⏱️ Alokasi Waktu Pembelajaran</h3>
          <span class="badge badge-cyan">Penting</span>
        </div>
        <p class="form-hint" style="margin-bottom: var(--space-md);">Tentukan alokasi waktu agar distribusi TP ke pertemuan tepat sasaran.</p>
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

      <!-- ====== KALENDER & DISTRIBUSI PERTEMUAN ====== -->
      <div class="card" style="margin-bottom: var(--space-lg);" id="distribusi-pertemuan-card">
        <div class="card-header">
          <h3 class="card-title">📅 Kalender & Distribusi Pertemuan</h3>
          <span class="badge badge-purple">Penting</span>
        </div>
        <p class="form-hint" style="margin-bottom: var(--space-md);">
          Sesuaikan dengan kalender pendidikan sekolah Anda. Sistem akan menghitung total pertemuan dan mendistribusikan TP secara otomatis.
        </p>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="input-minggu-efektif">Minggu Efektif: <strong id="minggu-efektif-value">${alokasi.mingguEfektif || 16}</strong> minggu</label>
            <input type="range" class="form-range" id="input-minggu-efektif" min="10" max="22" value="${alokasi.mingguEfektif || 16}" />
            <div class="range-labels"><span>10</span><span>Semester (16-18)</span><span>22</span></div>
          </div>
          <div class="form-group">
            <label class="form-label" for="input-jumlah-sumatif">Pertemuan Asesmen Sumatif: <strong id="jumlah-sumatif-value">${book.jumlahSumatif || 2}</strong></label>
            <input type="range" class="form-range" id="input-jumlah-sumatif" min="0" max="6" value="${book.jumlahSumatif || 2}" />
            <div class="range-labels"><span>0</span><span>6</span></div>
          </div>
        </div>

        <!-- Auto-Calculated Summary -->
        <div class="stats-bar" style="margin-top: var(--space-md); margin-bottom: var(--space-md);" id="distribusi-summary">
          ${this.renderDistribusiSummary(tpList, alokasi, book.jumlahSumatif || 2)}
        </div>

        <!-- Distribusi Preview Grid -->
        <div id="distribusi-preview-container">
          ${this.renderDistribusiPreview(tpList, alokasi, book.jumlahSumatif || 2)}
        </div>
      </div>

      <!-- ATP Info Card -->
      <div class="card atp-info-card" style="margin-bottom: var(--space-lg);">
        <div class="card-header">
          <h3 class="card-title">📚 Prinsip Penyusunan ATP</h3>
          <span class="badge badge-blue">Panduan</span>
        </div>
        <div class="atp-info-content">
          <div class="atp-info-grid">
            <div class="atp-info-item">
              <div class="atp-info-icon">1️⃣</div>
              <div class="atp-info-text"><strong>Konkret → Abstrak:</strong> Mulai dari konsep yang bisa dilihat/dipegang, lalu naik ke konsep abstrak.</div>
            </div>
            <div class="atp-info-item">
              <div class="atp-info-icon">2️⃣</div>
              <div class="atp-info-text"><strong>Sederhana → Kompleks:</strong> Dari keterampilan dasar (C1-C2) ke keterampilan tingkat tinggi (C5-C6).</div>
            </div>
            <div class="atp-info-item">
              <div class="atp-info-icon">3️⃣</div>
              <div class="atp-info-text"><strong>Semester 1 → 2:</strong> Tandai TP untuk semester masing-masing agar pemetaan waktu terarah.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- TP List with Drag-and-Drop -->
      <div class="card" style="margin-bottom: var(--space-lg);" id="atp-list-card">
        <div class="card-header">
          <h3 class="card-title">📋 Daftar Tujuan Pembelajaran</h3>
          <span class="badge badge-green" id="atp-badge">Memuat...</span>
        </div>

        <div id="atp-tp-list">
          ${tpList.length > 0 ? this.renderTPList(tpList) : this.renderEmptyState()}
        </div>

        <div style="margin-top: var(--space-md); display: flex; gap: var(--space-sm);">
          <button class="btn btn-ghost btn-sm" id="btn-atp-add-custom">
            ➕ Tambah TP Manual
          </button>
        </div>
      </div>

      <!-- ATP Preview (Visual Timeline) -->
      ${tpList.length > 0 ? `
        <div class="card" id="atp-preview-card">
          <div class="card-header">
            <h3 class="card-title">🗺️ Preview Alur ATP</h3>
            <span class="badge badge-purple">Timeline</span>
          </div>
          <div id="atp-timeline-container">
            ${this.renderTimeline(tpList)}
          </div>
        </div>
      ` : ''}
    `;
  },

  renderTPList(tpList) {
    return `
      <div class="atp-tp-items">
        ${tpList.map((tp, idx) => `
          <div class="atp-tp-item ${tp.semester === '2' || tp.semester === 2 ? 'atp-sem2' : 'atp-sem1'}" 
               data-idx="${idx}" 
               draggable="true">
            <div class="atp-tp-drag-handle" title="Drag untuk mengurutkan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/>
                <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>
                <circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/>
              </svg>
            </div>
            
            <div class="atp-tp-order">${idx + 1}</div>
            
            <div class="atp-tp-content">
              <div class="atp-tp-text">${tp.tp || tp.tpText || ''}</div>
              <div class="atp-tp-meta">
                <span class="atp-bloom-badge" style="background: ${this.getBloomColor(tp.levelBloom)}22; color: ${this.getBloomColor(tp.levelBloom)}; border: 1px solid ${this.getBloomColor(tp.levelBloom)}44;">
                  ${tp.levelBloom || '?'}
                </span>
                ${tp.lingkupMateri ? `<span class="atp-materi-badge">📚 ${tp.lingkupMateri}</span>` : ''}
                ${tp.cpCode ? `<span class="atp-cp-badge">${tp.cpCode}</span>` : ''}
              </div>
            </div>

            <div class="atp-tp-actions">
              <select class="atp-semester-select" data-idx="${idx}" title="Semester">
                <option value="1" ${(tp.semester === '1' || tp.semester === 1 || !tp.semester) ? 'selected' : ''}>Sem 1</option>
                <option value="2" ${(tp.semester === '2' || tp.semester === 2) ? 'selected' : ''}>Sem 2</option>
              </select>
              <button class="atp-move-btn" data-idx="${idx}" data-dir="up" title="Pindah ke atas" ${idx === 0 ? 'disabled' : ''}>▲</button>
              <button class="atp-move-btn" data-idx="${idx}" data-dir="down" title="Pindah ke bawah" ${idx === tpList.length - 1 ? 'disabled' : ''}>▼</button>
              <button class="atp-delete-btn" data-idx="${idx}" title="Hapus TP">✕</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderEmptyState() {
    return `
      <div class="empty-state" style="padding: var(--space-xl) 0;">
        <div class="empty-state-icon">🎯</div>
        <div class="empty-state-title">Belum ada Tujuan Pembelajaran</div>
        <div class="empty-state-text">
          TP akan dimuat otomatis dari hasil analisis CP. Kembali ke langkah sebelumnya untuk memuat dan menganalisis CP, 
          atau klik "Reload dari CP" untuk memuat ulang.
        </div>
      </div>
    `;
  },

  renderTimeline(tpList) {
    const sem1 = tpList.filter(t => t.semester === '1' || t.semester === 1 || !t.semester);
    const sem2 = tpList.filter(t => t.semester === '2' || t.semester === 2);

    return `
      <div class="atp-timeline">
        <div class="atp-timeline-section">
          <div class="atp-timeline-header">
            <span class="atp-timeline-sem-badge sem1">📗 Semester 1</span>
            <span class="atp-timeline-count">${sem1.length} TP</span>
          </div>
          <div class="atp-timeline-items">
            ${sem1.map((tp, idx) => `
              <div class="atp-timeline-item">
                <div class="atp-timeline-dot" style="background: ${this.getBloomColor(tp.levelBloom)};"></div>
                <div class="atp-timeline-line"></div>
                <div class="atp-timeline-content">
                  <span class="atp-timeline-order">${idx + 1}</span>
                  <span class="atp-timeline-text">${tp.tp || tp.tpText || ''}</span>
                  <span class="atp-timeline-bloom" style="color: ${this.getBloomColor(tp.levelBloom)};">[${tp.levelBloom || '?'}]</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${sem2.length > 0 ? `
          <div class="atp-timeline-section">
            <div class="atp-timeline-header">
              <span class="atp-timeline-sem-badge sem2">📘 Semester 2</span>
              <span class="atp-timeline-count">${sem2.length} TP</span>
            </div>
            <div class="atp-timeline-items">
              ${sem2.map((tp, idx) => `
                <div class="atp-timeline-item">
                  <div class="atp-timeline-dot" style="background: ${this.getBloomColor(tp.levelBloom)};"></div>
                  <div class="atp-timeline-line"></div>
                  <div class="atp-timeline-content">
                    <span class="atp-timeline-order">${idx + 1}</span>
                    <span class="atp-timeline-text">${tp.tp || tp.tpText || ''}</span>
                    <span class="atp-timeline-bloom" style="color: ${this.getBloomColor(tp.levelBloom)};">[${tp.levelBloom || '?'}]</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  getBloomColor(level) {
    const colors = {
      C1: '#6366f1', C2: '#8b5cf6', C3: '#3b82f6',
      C4: '#f59e0b', C5: '#ef4444', C6: '#10b981',
    };
    return colors[level] || '#888';
  },

  // ====== DISTRIBUSI PERTEMUAN HELPERS ======

  hitungDistribusi(tpList, alokasi, jumlahSumatif) {
    const mingguEfektif = alokasi.mingguEfektif || 16;
    const jpPerMinggu = alokasi.jpPerMinggu || 4;
    const jpPerPertemuan = alokasi.jpPerPertemuan || 2;

    const pertemuanPerMinggu = Math.max(1, Math.floor(jpPerMinggu / jpPerPertemuan));
    const totalPertemuan = mingguEfektif * pertemuanPerMinggu;
    const pertemuanReguler = Math.max(1, totalPertemuan - jumlahSumatif);

    // Hitung posisi sumatif (merata)
    const sumatifPositions = new Set();
    if (jumlahSumatif > 0 && totalPertemuan > 0) {
      const interval = Math.floor(totalPertemuan / (jumlahSumatif + 1));
      for (let s = 1; s <= jumlahSumatif; s++) {
        sumatifPositions.add(s * interval);
      }
    }

    // ============================================================
    // Distribusi TP ke pertemuan reguler — MERATA
    //
    // Kurikulum Merdeka: Satu TP bisa menempati BEBERAPA pertemuan.
    // Contoh: 5 TP, 14 pertemuan reguler → setiap TP ≈ 2-3 pertemuan
    //         TP1: P1-P3, TP2: P4-P6, TP3: P7-P8, TP4: P9-P11, TP5: P12-P14
    //
    // Atau jika TP > pertemuan: beberapa TP per pertemuan (misal modul terintegrasi)
    // ============================================================
    const distribusi = [];
    let tpPerPertemuan;

    if (tpList.length === 0) {
      // Tidak ada TP — semua pertemuan kosong
      tpPerPertemuan = 0;
      for (let i = 0; i < totalPertemuan; i++) {
        if (sumatifPositions.has(i)) {
          distribusi.push({ pertemuan: i + 1, type: 'sumatif', tpList: [] });
        } else {
          distribusi.push({ pertemuan: i + 1, type: 'reguler', tpList: [] });
        }
      }
    } else if (tpList.length <= pertemuanReguler) {
      // ============================================================
      // CASE: TP < Pertemuan → Spread: setiap TP mendapat beberapa pertemuan
      // Ini kasus yang paling umum — guru punya 5-10 TP untuk 14-16 pertemuan
      // ============================================================
      tpPerPertemuan = 1; // 1 TP aktif per pertemuan

      // Hitung berapa pertemuan per TP (distribusi merata)
      const basePertemuanPerTP = Math.floor(pertemuanReguler / tpList.length);
      const extraMeetings = pertemuanReguler % tpList.length;

      // Build mapping: index reguler → TP index
      const regulerToTP = [];
      for (let t = 0; t < tpList.length; t++) {
        // TP yang lebih awal dapat ekstra pertemuan jika ada sisa
        const meetingsForThisTP = basePertemuanPerTP + (t < extraMeetings ? 1 : 0);
        for (let m = 0; m < meetingsForThisTP; m++) {
          regulerToTP.push(t);
        }
      }

      // Fill distribusi
      let regulerIdx = 0;
      for (let i = 0; i < totalPertemuan; i++) {
        if (sumatifPositions.has(i)) {
          distribusi.push({ pertemuan: i + 1, type: 'sumatif', tpList: [] });
        } else {
          const tpIndex = regulerToTP[regulerIdx];
          const tp = tpIndex !== undefined ? [tpList[tpIndex]] : [];
          distribusi.push({ pertemuan: i + 1, type: 'reguler', tpList: tp });
          regulerIdx++;
        }
      }
    } else {
      // ============================================================
      // CASE: TP > Pertemuan → Bundle: beberapa TP per pertemuan
      // ============================================================
      tpPerPertemuan = Math.ceil(tpList.length / pertemuanReguler);
      let tpIdx = 0;

      for (let i = 0; i < totalPertemuan; i++) {
        if (sumatifPositions.has(i)) {
          distribusi.push({ pertemuan: i + 1, type: 'sumatif', tpList: [] });
        } else {
          const tps = tpList.slice(tpIdx, tpIdx + tpPerPertemuan);
          distribusi.push({ pertemuan: i + 1, type: 'reguler', tpList: tps });
          if (tps.length > 0) tpIdx = Math.min(tpIdx + tpPerPertemuan, tpList.length);
        }
      }
    }

    return { totalPertemuan, pertemuanReguler, tpPerPertemuan, distribusi };
  },

  renderDistribusiSummary(tpList, alokasi, jumlahSumatif) {
    const { totalPertemuan, pertemuanReguler, tpPerPertemuan } = this.hitungDistribusi(tpList, alokasi, jumlahSumatif);
    const durasiJP = alokasi.durasiJP || 40;
    const jpPerPertemuan = alokasi.jpPerPertemuan || 2;

    // Calculate meetings per TP for the spread case
    const pertemuanPerTP = tpList.length > 0 && tpList.length <= pertemuanReguler
      ? Math.floor(pertemuanReguler / tpList.length)
      : 0;
    const isSpread = tpList.length > 0 && tpList.length <= pertemuanReguler;

    return `
      <div class="stat-item">
        <span class="stat-value">${totalPertemuan}</span>
        <span class="stat-label">Total Pertemuan</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${pertemuanReguler}</span>
        <span class="stat-label">Reguler</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${jumlahSumatif}</span>
        <span class="stat-label">Sumatif</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${durasiJP * jpPerPertemuan}</span>
        <span class="stat-label">Menit/Pertemuan</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${isSpread ? '~' + pertemuanPerTP : '±' + (tpPerPertemuan || '?')}</span>
        <span class="stat-label">${isSpread ? 'Pertemuan/TP' : 'TP/Pertemuan'}</span>
      </div>
    `;
  },

  renderDistribusiPreview(tpList, alokasi, jumlahSumatif) {
    const { distribusi } = this.hitungDistribusi(tpList, alokasi, jumlahSumatif);
    if (distribusi.length === 0) {
      return `<div style="text-align:center; padding: var(--space-md); color: var(--text-tertiary); font-size: var(--fs-sm);">
        Muat TP dari analisis CP terlebih dahulu untuk melihat distribusi pertemuan.
      </div>`;
    }

    return `
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 6px; max-height: 240px; overflow-y: auto; padding: var(--space-sm);">
        ${distribusi.map(d => {
          if (d.type === 'sumatif') {
            return `<div style="background: linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05)); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 8px; text-align:center; font-size: 0.7rem;">
              <div style="font-weight: 700; color: #ef4444; margin-bottom: 2px;">P${d.pertemuan}</div>
              <div style="color: #ef4444;">📝 Sumatif</div>
            </div>`;
          }
          const tpNames = d.tpList.map(t => t.tp || '').filter(Boolean);
          const tpPreview = tpNames.length > 0 ? tpNames.map(n => n.substring(0, 25)).join(', ') : '—';
          return `<div style="background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; padding: 8px; font-size: 0.7rem;">
            <div style="font-weight: 700; color: var(--accent-primary); margin-bottom: 2px;">P${d.pertemuan}</div>
            <div style="color: var(--text-secondary); line-height: 1.3; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;" title="${tpPreview}">${d.tpList.length > 0 ? d.tpList.length + ' TP' : '—'}</div>
          </div>`;
        }).join('')}
      </div>
    `;
  },

  // ====== INIT ======

  init() {
    // ====== AUTO-LOAD TP from CP Analysis ======
    const atp = state.get('atp') || { tujuanPembelajaran: [], ordered: false };
    if (atp.tujuanPembelajaran.length === 0) {
      this.loadTPFromCPAnalysis();
    }

    // Always refresh to sync badge, stats, and timeline
    this.refreshUI();

    // ====== ALOKASI WAKTU SLIDERS ======
    ['input-durasi-jp', 'input-jp-per-pertemuan', 'input-jp-per-minggu'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        const labelId = id.replace('input-', '') + '-value';
        const label = document.getElementById(labelId);
        if (label) label.textContent = e.target.value;
        const durasiJP = parseInt(document.getElementById('input-durasi-jp')?.value) || 40;
        const jpPerPertemuan = parseInt(document.getElementById('input-jp-per-pertemuan')?.value) || 2;
        const display = document.getElementById('total-menit-display');
        if (display) display.textContent = `${durasiJP * jpPerPertemuan} menit`;
        state.set('book.alokasiWaktu', {
          ...state.get('book.alokasiWaktu'),
          durasiJP: parseInt(document.getElementById('input-durasi-jp')?.value) || 40,
          jpPerPertemuan: parseInt(document.getElementById('input-jp-per-pertemuan')?.value) || 2,
          jpPerMinggu: parseInt(document.getElementById('input-jp-per-minggu')?.value) || 4,
        });
        this.recalcDistribusi();
      });
    });

    // ====== MINGGU EFEKTIF SLIDER ======
    document.getElementById('input-minggu-efektif')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      document.getElementById('minggu-efektif-value').textContent = val;
      state.set('book.alokasiWaktu', {
        ...state.get('book.alokasiWaktu'),
        mingguEfektif: val,
      });
      this.recalcDistribusi();
    });

    // ====== JUMLAH SUMATIF SLIDER ======
    document.getElementById('input-jumlah-sumatif')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      document.getElementById('jumlah-sumatif-value').textContent = val;
      state.set('book.jumlahSumatif', val);
      this.recalcDistribusi();
    });

    // ====== AUTO SORT ======
    document.getElementById('btn-atp-auto-sort')?.addEventListener('click', () => {
      this.autoSort();
      showToast('TP diurutkan berdasarkan level Bloom (C1→C6).', 'success');
    });

    // ====== RELOAD FROM CP ======
    document.getElementById('btn-atp-reload')?.addEventListener('click', () => {
      this.loadTPFromCPAnalysis();
      showToast('TP dimuat ulang dari analisis CP.', 'info');
    });

    // ====== ADD CUSTOM TP ======
    document.getElementById('btn-atp-add-custom')?.addEventListener('click', () => {
      this.addCustomTP();
    });

    // Initial distribusi calculation
    this.recalcDistribusi();
  },

  // ====== RECALC DISTRIBUSI ======
  recalcDistribusi() {
    const book = state.get('book');
    const alokasi = book.alokasiWaktu || {};
    const tpList = (state.get('atp') || {}).tujuanPembelajaran || [];
    const jumlahSumatif = book.jumlahSumatif || 2;

    const result = this.hitungDistribusi(tpList, alokasi, jumlahSumatif);

    // Save distribusi to state
    state.set('book.distribusiPertemuan', result.distribusi);

    // Update summary UI
    const summaryEl = document.getElementById('distribusi-summary');
    if (summaryEl) summaryEl.innerHTML = this.renderDistribusiSummary(tpList, alokasi, jumlahSumatif);

    // Update preview grid UI
    const previewEl = document.getElementById('distribusi-preview-container');
    if (previewEl) previewEl.innerHTML = this.renderDistribusiPreview(tpList, alokasi, jumlahSumatif);

    // Update total menit display
    const display = document.getElementById('total-menit-display');
    if (display) display.textContent = `${(alokasi.durasiJP || 40) * (alokasi.jpPerPertemuan || 2)} menit`;
  },

  // ====== LOGIC ======

  loadTPFromCPAnalysis() {
    const cpAnalisis = state.get('book.cpAnalisis') || [];
    if (cpAnalisis.length === 0) {
      // Try to auto-analyze
      const cpData = state.get('book.cpData') || [];
      if (cpData.length > 0) {
        const results = analisisSemuaCP(cpData);
        state.set('book.cpAnalisis', results);
        this.buildTPFromAnalisis(results);
      }
      return;
    }
    this.buildTPFromAnalisis(cpAnalisis);
  },

  buildTPFromAnalisis(analisisResults) {
    const tpList = [];
    const semester = state.get('book.semester') || '1';

    for (const result of analisisResults) {
      for (const tp of result.analisis.tujuanPembelajaran) {
        tpList.push({
          id: uid(),
          tp: tp.tp,
          kompetensi: tp.kompetensi,
          levelBloom: tp.levelBloom,
          lingkupMateri: tp.lingkupMateri,
          cpCode: result.cpCode,
          cpIndex: result.cpIndex,
          semester: semester,
          order: tpList.length,
        });
      }
    }

    state.set('atp', {
      tujuanPembelajaran: tpList,
      ordered: false,
    });

    this.refreshUI();
  },

  moveTP(idx, direction) {
    const tpList = (state.get('atp') || {}).tujuanPembelajaran || [];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= tpList.length) return;

    // Swap
    [tpList[idx], tpList[targetIdx]] = [tpList[targetIdx], tpList[idx]];
    // Update order
    tpList.forEach((tp, i) => tp.order = i);
    state.set('atp.tujuanPembelajaran', [...tpList]);
    state.set('atp.ordered', true);
    this.refreshUI();
  },

  deleteTP(idx) {
    const tpList = (state.get('atp') || {}).tujuanPembelajaran || [];
    tpList.splice(idx, 1);
    tpList.forEach((tp, i) => tp.order = i);
    state.set('atp.tujuanPembelajaran', [...tpList]);
    this.refreshUI();
    showToast('TP dihapus.', 'info');
  },

  addCustomTP() {
    const tpList = (state.get('atp') || {}).tujuanPembelajaran || [];
    tpList.push({
      id: uid(),
      tp: '',
      kompetensi: '',
      levelBloom: 'C3',
      lingkupMateri: '',
      cpCode: 'CUSTOM',
      cpIndex: -1,
      semester: state.get('book.semester') || '1',
      order: tpList.length,
    });
    state.set('atp.tujuanPembelajaran', [...tpList]);
    this.refreshUI();

    // Focus the last TP text for editing
    setTimeout(() => {
      const items = document.querySelectorAll('.atp-tp-text');
      if (items.length > 0) {
        const last = items[items.length - 1];
        last.setAttribute('contenteditable', 'true');
        last.focus();
        last.style.outline = '1px solid var(--accent-primary)';
        last.style.borderRadius = '4px';
        last.style.padding = '4px';
        last.addEventListener('blur', () => {
          const idx = tpList.length - 1;
          const currentTP = (state.get('atp') || {}).tujuanPembelajaran || [];
          if (currentTP[idx]) {
            currentTP[idx].tp = last.textContent.trim();
            state.set('atp.tujuanPembelajaran', [...currentTP]);
          }
          last.removeAttribute('contenteditable');
          last.style.outline = '';
          last.style.padding = '';
        });
      }
    }, 100);
  },

  autoSort() {
    const tpList = (state.get('atp') || {}).tujuanPembelajaran || [];
    if (tpList.length === 0) return;

    const bloomOrder = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
    tpList.sort((a, b) => {
      const aIdx = bloomOrder.indexOf(a.levelBloom);
      const bIdx = bloomOrder.indexOf(b.levelBloom);
      return aIdx - bIdx;
    });

    tpList.forEach((tp, i) => tp.order = i);
    state.set('atp.tujuanPembelajaran', [...tpList]);
    state.set('atp.ordered', true);
    this.refreshUI();
    showToast('TP diurutkan otomatis: C1 → C6 (konkret → abstrak).', 'success');
  },

  // ====== DRAG-AND-DROP ======

  attachDragListeners() {
    const items = document.querySelectorAll('.atp-tp-item[draggable]');
    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        dragSrcIdx = parseInt(item.dataset.idx);
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', dragSrcIdx.toString());
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        document.querySelectorAll('.atp-tp-item').forEach(el => el.classList.remove('drag-over'));
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
        item.classList.remove('drag-over');
        const targetIdx = parseInt(item.dataset.idx);
        if (dragSrcIdx === null || dragSrcIdx === targetIdx) return;

        const tpList = (state.get('atp') || {}).tujuanPembelajaran || [];
        const [moved] = tpList.splice(dragSrcIdx, 1);
        tpList.splice(targetIdx, 0, moved);
        tpList.forEach((tp, i) => tp.order = i);
        state.set('atp.tujuanPembelajaran', [...tpList]);
        state.set('atp.ordered', true);
        dragSrcIdx = null;
        this.refreshUI();
        showToast('Urutan TP diperbarui.', 'success');
      });
    });
  },

  // ====== REFRESH ======

  refreshUI() {
    const tpList = (state.get('atp') || {}).tujuanPembelajaran || [];

    // Update list
    const listContainer = document.getElementById('atp-tp-list');
    if (listContainer) {
      listContainer.innerHTML = tpList.length > 0 ? this.renderTPList(tpList) : this.renderEmptyState();
      this.attachDragListeners();

      // Re-attach listeners
      document.querySelectorAll('.atp-move-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.moveTP(parseInt(btn.dataset.idx), btn.dataset.dir);
        });
      });
      document.querySelectorAll('.atp-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteTP(parseInt(btn.dataset.idx));
        });
      });
      document.querySelectorAll('.atp-semester-select').forEach(select => {
        select.addEventListener('change', () => {
          const idx = parseInt(select.dataset.idx);
          const currentTP = (state.get('atp') || {}).tujuanPembelajaran || [];
          if (currentTP[idx]) {
            currentTP[idx].semester = select.value;
            state.set('atp.tujuanPembelajaran', [...currentTP]);
            this.refreshUI();
          }
        });
      });
    }

    // Update badge
    const badgeEl = document.getElementById('atp-badge');
    if (badgeEl) {
      badgeEl.textContent = tpList.length > 0 ? `${tpList.length} TP` : 'Belum ada TP';
      badgeEl.className = tpList.length > 0 ? 'badge badge-green' : 'badge badge-orange';
    }

    // Update stats
    const totalEl = document.getElementById('atp-total-tp');
    const sem1El = document.getElementById('atp-sem1-count');
    const sem2El = document.getElementById('atp-sem2-count');
    if (totalEl) totalEl.textContent = tpList.length;
    if (sem1El) sem1El.textContent = tpList.filter(t => t.semester === '1' || t.semester === 1 || !t.semester).length;
    if (sem2El) sem2El.textContent = tpList.filter(t => t.semester === '2' || t.semester === 2).length;

    // Update timeline
    const timelineContainer = document.getElementById('atp-timeline-container');
    if (timelineContainer) {
      timelineContainer.innerHTML = this.renderTimeline(tpList);
    }

    // Show/hide preview card
    const previewCard = document.getElementById('atp-preview-card');
    if (previewCard) {
      previewCard.style.display = tpList.length > 0 ? 'block' : 'none';
    }
  },

  // ====== WIZARD INTERFACE ======

  validate() {
    const atp = state.get('atp') || { tujuanPembelajaran: [] };
    if (atp.tujuanPembelajaran.length === 0) {
      showToast('Susun minimal 1 Tujuan Pembelajaran sebelum lanjut.', 'warning');
      return false;
    }
    return true;
  },

  getData() {
    // Data already saved to state via real-time updates
  },

  destroy() {
    dragSrcIdx = null;
  },
};
