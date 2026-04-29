// ============================================================
// Main — App Entry Point (Perangkat Guru AI)
// ============================================================

import './styles/index.css';
import { state } from './state.js';
import { registerSteps, initWizard } from './modules/wizard.js';
import { showToast, showModal, hideModal, uid, formatDate } from './utils/helpers.js';
import { saveProject, getProjects, loadProject, deleteProject, autoSave, loadAutoSave, saveProfile, loadProfile } from './services/storage.js';
import { testConnection } from './services/gemini.js';

// Import step modules (5-step pedagogical wizard)
import setupModule from './modules/setup.js';
import analisisAtpModule from './modules/analisis-atp.js';
import kktpAsesmenModule from './modules/kktp-asesmen.js';
import generatePreviewModule from './modules/generate-preview.js';
import exportModule from './modules/export.js';

// Import crossword module
import { renderCrosswordPage, initCrosswordPage } from './modules/crossword.js';

// Import sumatif module
import { renderSumatifPage, initSumatifPage } from './modules/sumatif.js';

// ====== INITIALIZATION ======
function init() {
  setupHeaderButtons();
  setupAutoSave();
  checkAutoSaveRecovery();
  loadSavedProfile();

  // Listen for view changes
  window.addEventListener('viewchange', () => renderView());

  // Initial render
  renderView();

  // Modal close on overlay click
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') hideModal();
  });

  // Hide loading screen
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) loadingScreen.style.display = 'none';

  console.log('📚 Perangkat Guru AI initialized');
}

// ====== VIEW ROUTING ======
function renderView() {
  const view = state.get('currentView');
  const wizardProgress = document.getElementById('wizard-progress');
  const wizardNav = document.getElementById('wizard-nav');
  const mainContent = document.getElementById('wizard-content');
  const projectName = document.getElementById('project-name');

  if (view === 'dashboard') {
    wizardProgress.style.display = 'none';
    wizardNav.style.display = 'none';
    projectName.textContent = '';
    mainContent.innerHTML = renderDashboard();
    initDashboard();
  } else if (view === 'document') {
    wizardProgress.style.display = 'block';
    wizardNav.style.display = 'flex';
    projectName.textContent = 'Dokumen Admin';
    registerSteps([setupModule, analisisAtpModule, kktpAsesmenModule, generatePreviewModule, exportModule]);
    initWizard();
  } else if (view === 'crossword') {
    wizardProgress.style.display = 'none';
    wizardNav.style.display = 'none';
    projectName.textContent = 'Teka-Teki Silang';
    mainContent.innerHTML = renderCrosswordPage();
    initCrosswordPage();
  } else if (view === 'sumatif') {
    wizardProgress.style.display = 'none';
    wizardNav.style.display = 'none';
    projectName.textContent = 'Soal Sumatif';
    mainContent.innerHTML = renderSumatifPage();
    initSumatifPage();
  }
}

// ====== DASHBOARD ======
function renderDashboard() {
  return `
    <div class="step-container">
      <div class="dashboard-hero">
        <h2 class="dashboard-title">Selamat Datang, Guru! 👋</h2>
        <p class="dashboard-subtitle">Pilih fitur yang ingin Anda gunakan. Semua dokumen akan di-generate oleh AI sesuai standar Kurikulum Merdeka.</p>
      </div>

      <div class="dashboard-grid">
        <button class="dashboard-card" id="btn-go-document">
          <div class="dashboard-card-icon">📄</div>
          <div class="dashboard-card-content">
            <h3 class="dashboard-card-title">Buat Dokumen Administrasi</h3>
            <p class="dashboard-card-desc">Generate Modul Ajar, ATP, Prota, Promes, Asesmen, RKT, dan lainnya. AI menyesuaikan konten dengan level sekolah Anda.</p>
            <div class="dashboard-card-tags">
              <span class="tag">Modul Ajar</span>
              <span class="tag">ATP</span>
              <span class="tag">Prota</span>
              <span class="tag">RKT</span>
              <span class="tag">+6 lainnya</span>
            </div>
          </div>
          <div class="dashboard-card-arrow">→</div>
        </button>

        <button class="dashboard-card" id="btn-go-crossword">
          <div class="dashboard-card-icon">🧩</div>
          <div class="dashboard-card-content">
            <h3 class="dashboard-card-title">Buat Teka-Teki Silang</h3>
            <p class="dashboard-card-desc">Generate TTS edukatif dari materi pelajaran Anda. Pilih tingkat kesulitan, download sebagai Excel siap cetak.</p>
            <div class="dashboard-card-tags">
              <span class="tag">5 Level Kesulitan</span>
              <span class="tag">Output Excel</span>
              <span class="tag">Siap Cetak</span>
            </div>
          </div>
          <div class="dashboard-card-arrow">→</div>
        </button>

        <button class="dashboard-card" id="btn-go-sumatif">
          <div class="dashboard-card-icon">📝</div>
          <div class="dashboard-card-content">
            <h3 class="dashboard-card-title">Pembuatan Soal Sumatif</h3>
            <p class="dashboard-card-desc">Generate soal ujian sumatif lengkap dengan AI. Pilih jenis soal, atur kesulitan, dan download sebagai file Word (.docx) dengan kunci jawaban.</p>
            <div class="dashboard-card-tags">
              <span class="tag">Pilihan Ganda</span>
              <span class="tag">Isian Singkat</span>
              <span class="tag">Esai</span>
              <span class="tag">Mencocokkan</span>
              <span class="tag">Output .docx</span>
            </div>
          </div>
          <div class="dashboard-card-arrow">→</div>
        </button>
      </div>
    </div>
  `;
}

function initDashboard() {
  document.getElementById('btn-go-document')?.addEventListener('click', () => {
    state.set('currentView', 'document');
    state.set('currentStep', 0);
    state.set('completedSteps', []);
    window.dispatchEvent(new Event('viewchange'));
  });

  document.getElementById('btn-go-crossword')?.addEventListener('click', () => {
    state.set('currentView', 'crossword');
    window.dispatchEvent(new Event('viewchange'));
  });

  document.getElementById('btn-go-sumatif')?.addEventListener('click', () => {
    state.set('currentView', 'sumatif');
    window.dispatchEvent(new Event('viewchange'));
  });
}

// ====== HEADER BUTTONS ======
function setupHeaderButtons() {
  // Home button
  document.getElementById('btn-home')?.addEventListener('click', () => {
    state.set('currentView', 'dashboard');
    window.dispatchEvent(new Event('viewchange'));
  });

  // Settings button (API settings modal)
  document.getElementById('btn-settings')?.addEventListener('click', showSettingsModal);

  // Projects button
  document.getElementById('btn-projects')?.addEventListener('click', showProjectsModal);
}

// ====== API SETTINGS MODAL ======
function showSettingsModal() {
  const settings = state.get('settings');
  const profile = state.get('profile') || {};

  const geminiModels = [
    { value: 'gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash Lite (Default, Cepat)', stable: true },
    { value: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro (Premium)', stable: true },
    { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite (Stabil)', stable: true },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Kualitas Tinggi)', stable: true },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Premium, Stabil)', stable: true },
  ];

  const bodyHtml = `
    <div class="settings-section">
      <label class="form-label" style="font-weight:700; margin-bottom: var(--space-sm);">Penyedia AI Aktif</label>
      <div style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-sm);">
        <label class="toggle-chip ${settings.enableGemini !== false ? 'active' : ''}" id="modal-toggle-gemini">
          <input type="checkbox" id="modal-enable-gemini" ${settings.enableGemini !== false ? 'checked' : ''} hidden />
          ✨ Gemini
        </label>
        <label class="toggle-chip ${settings.enableQwen ? 'active' : ''}" id="modal-toggle-qwen">
          <input type="checkbox" id="modal-enable-qwen" ${settings.enableQwen ? 'checked' : ''} hidden />
          🤖 Qwen
        </label>
      </div>
      <label class="checkbox-label" style="font-size: 0.85rem; opacity: 0.8;">
        <input type="checkbox" id="modal-auto-fallback" ${settings.autoFallback ? 'checked' : ''} />
        Auto-Fallback (jika provider aktif gagal, coba provider lain)
      </label>
    </div>

    <div class="settings-section">
      <label class="form-label" style="font-weight:700;">Penyedia Utama</label>
      <div style="display: flex; gap: var(--space-sm);">
        <button class="btn ${settings.apiProvider === 'gemini' ? 'btn-primary' : 'btn-secondary'}" id="modal-provider-gemini" style="flex:1;">✨ Gemini</button>
        <button class="btn ${settings.apiProvider === 'qwen' ? 'btn-primary' : 'btn-secondary'}" id="modal-provider-qwen" style="flex:1;">🤖 Qwen</button>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="modal-gemini-key">Gemini API Key</label>
        <div class="api-key-input-wrapper">
          <input class="form-input" id="modal-gemini-key" type="password" placeholder="AIzaSy..." value="${settings.geminiKey}" />
          <button class="btn-toggle-visibility" data-target="modal-gemini-key" title="Tampilkan/Sembunyikan">👁️</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="modal-qwen-key">Qwen API Key</label>
        <div class="api-key-input-wrapper">
          <input class="form-input" id="modal-qwen-key" type="password" placeholder="sk-..." value="${settings.qwenKey}" />
          <button class="btn-toggle-visibility" data-target="modal-qwen-key" title="Tampilkan/Sembunyikan">👁️</button>
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="modal-gemini-model">Model Gemini</label>
        <select class="form-select" id="modal-gemini-model">
          ${geminiModels.map(m => `<option value="${m.value}" ${settings.geminiModel === m.value ? 'selected' : ''}>${m.label}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="modal-qwen-model">Model Qwen</label>
        <select class="form-select" id="modal-qwen-model">
          <option value="qvq-max-2025-03-25" ${settings.qwenModel === 'qvq-max-2025-03-25' ? 'selected' : ''}>QvQ Max</option>
          <option value="qwen-plus" ${settings.qwenModel === 'qwen-plus' ? 'selected' : ''}>Qwen Plus</option>
          <option value="qwen-max" ${settings.qwenModel === 'qwen-max' ? 'selected' : ''}>Qwen Max</option>
        </select>
      </div>
    </div>

    <div style="display: flex; gap: var(--space-sm);">
      <button class="btn btn-secondary btn-sm" id="modal-test-gemini">🧪 Test Gemini</button>
      <button class="btn btn-secondary btn-sm" id="modal-test-qwen">🧪 Test Qwen</button>
    </div>

    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: var(--space-md) 0;" />

    <details class="settings-profile-section">
      <summary style="cursor:pointer; font-weight:700; margin-bottom: var(--space-sm);">👤 Profil Guru & Sekolah</summary>
      <div class="form-row" style="margin-top: var(--space-sm);">
        <div class="form-group">
          <label class="form-label" for="modal-nama-guru">Nama Guru</label>
          <input class="form-input" id="modal-nama-guru" placeholder="Nama lengkap guru" value="${profile.namaGuru || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label" for="modal-nip">NIP (opsional)</label>
          <input class="form-input" id="modal-nip" placeholder="NIP" value="${profile.nip || ''}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="modal-nama-sekolah">Nama Sekolah</label>
          <input class="form-input" id="modal-nama-sekolah" placeholder="SMP Negeri 1 ..." value="${profile.namaSekolah || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label" for="modal-npsn">NPSN (opsional)</label>
          <input class="form-input" id="modal-npsn" placeholder="NPSN" value="${profile.npsn || ''}" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="modal-alamat-sekolah">Alamat Sekolah</label>
        <input class="form-input" id="modal-alamat-sekolah" placeholder="Jl. Pendidikan No. 1, Kec. ..." value="${profile.alamatSekolah || ''}" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="modal-kab-kota">Kabupaten/Kota</label>
          <input class="form-input" id="modal-kab-kota" placeholder="Kabupaten/Kota" value="${profile.kabupatenKota || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label" for="modal-provinsi">Provinsi</label>
          <input class="form-input" id="modal-provinsi" placeholder="Provinsi" value="${profile.provinsi || ''}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="modal-nama-kepsek">Nama Kepala Sekolah</label>
          <input class="form-input" id="modal-nama-kepsek" placeholder="Nama Kepala Sekolah" value="${profile.namaKepalaSekolah || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label" for="modal-nip-kepsek">NIP Kepala Sekolah (opsional)</label>
          <input class="form-input" id="modal-nip-kepsek" placeholder="NIP" value="${profile.nipKepalaSekolah || ''}" />
        </div>
      </div>
    </details>
  `;

  showModal('⚙️ Pengaturan AI & Profil', bodyHtml, [
    {
      text: 'Simpan',
      class: 'btn-primary',
      onClick: () => {
        // Save provider settings
        state.set('settings.apiProvider', document.getElementById('modal-provider-gemini')?.classList.contains('btn-primary') ? 'gemini' : 'qwen');
        state.set('settings.enableGemini', document.getElementById('modal-enable-gemini')?.checked ?? true);
        state.set('settings.enableQwen', document.getElementById('modal-enable-qwen')?.checked ?? false);
        state.set('settings.autoFallback', document.getElementById('modal-auto-fallback')?.checked ?? false);
        state.set('settings.geminiKey', document.getElementById('modal-gemini-key')?.value || '');
        state.set('settings.qwenKey', document.getElementById('modal-qwen-key')?.value || '');
        state.set('settings.geminiModel', document.getElementById('modal-gemini-model')?.value || 'gemini-3.1-flash-lite-preview');
        state.set('settings.qwenModel', document.getElementById('modal-qwen-model')?.value || 'qvq-max-2025-03-25');

        // Save profile
        const profileData = {
          namaGuru: document.getElementById('modal-nama-guru')?.value || '',
          nip: document.getElementById('modal-nip')?.value || '',
          jabatan: 'Guru Mata Pelajaran',
          namaSekolah: document.getElementById('modal-nama-sekolah')?.value || '',
          npsn: document.getElementById('modal-npsn')?.value || '',
          alamatSekolah: document.getElementById('modal-alamat-sekolah')?.value || '',
          kabupatenKota: document.getElementById('modal-kab-kota')?.value || '',
          provinsi: document.getElementById('modal-provinsi')?.value || '',
          namaKepalaSekolah: document.getElementById('modal-nama-kepsek')?.value || '',
          nipKepalaSekolah: document.getElementById('modal-nip-kepsek')?.value || '',
        };
        state.set('profile', profileData);
        saveProfile(profileData);

        // Also persist settings
        const settingsToSave = {
          apiProvider: state.get('settings.apiProvider'),
          enableGemini: state.get('settings.enableGemini'),
          enableQwen: state.get('settings.enableQwen'),
          autoFallback: state.get('settings.autoFallback'),
          geminiKey: state.get('settings.geminiKey'),
          qwenKey: state.get('settings.qwenKey'),
          geminiModel: state.get('settings.geminiModel'),
          qwenModel: state.get('settings.qwenModel'),
        };
        try { localStorage.setItem('perangkat_guru_settings', JSON.stringify(settingsToSave)); } catch {}

        showToast('Pengaturan & profil disimpan!', 'success');
      },
    },
    { text: 'Batal', class: 'btn-ghost' },
  ]);

  // Attach modal event listeners after render
  setTimeout(() => {
    // Provider toggle
    document.getElementById('modal-provider-gemini')?.addEventListener('click', () => {
      document.getElementById('modal-provider-gemini').className = 'btn btn-primary';
      document.getElementById('modal-provider-qwen').className = 'btn btn-secondary';
      document.getElementById('modal-provider-gemini').style.flex = '1';
      document.getElementById('modal-provider-qwen').style.flex = '1';
    });
    document.getElementById('modal-provider-qwen')?.addEventListener('click', () => {
      document.getElementById('modal-provider-qwen').className = 'btn btn-primary';
      document.getElementById('modal-provider-gemini').className = 'btn btn-secondary';
      document.getElementById('modal-provider-gemini').style.flex = '1';
      document.getElementById('modal-provider-qwen').style.flex = '1';
    });

    // Enable/disable toggle chips
    ['modal-toggle-gemini', 'modal-toggle-qwen'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => {
        const el = document.getElementById(id);
        const cb = el.querySelector('input[type=checkbox]');
        cb.checked = !cb.checked;
        el.classList.toggle('active', cb.checked);
      });
    });

    // Toggle visibility
    document.querySelectorAll('#modal-body .btn-toggle-visibility').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        target.type = target.type === 'password' ? 'text' : 'password';
        btn.textContent = target.type === 'password' ? '👁️' : '🙈';
      });
    });

    // Test connections
    document.getElementById('modal-test-gemini')?.addEventListener('click', async () => {
      const btn = document.getElementById('modal-test-gemini');
      state.set('settings.geminiKey', document.getElementById('modal-gemini-key')?.value || '');
      state.set('settings.geminiModel', document.getElementById('modal-gemini-model')?.value || 'gemini-3.1-flash-lite-preview');
      btn.disabled = true; btn.textContent = '⏳ Testing...';
      try { await testConnection('gemini'); showToast('Gemini API berhasil terhubung!', 'success'); }
      catch (e) { showToast(e.message, 'error'); }
      finally { btn.disabled = false; btn.textContent = '🧪 Test Gemini'; }
    });
    document.getElementById('modal-test-qwen')?.addEventListener('click', async () => {
      const btn = document.getElementById('modal-test-qwen');
      state.set('settings.qwenKey', document.getElementById('modal-qwen-key')?.value || '');
      state.set('settings.qwenModel', document.getElementById('modal-qwen-model')?.value || 'qvq-max-2025-03-25');
      btn.disabled = true; btn.textContent = '⏳ Testing...';
      try { await testConnection('qwen'); showToast('Qwen API berhasil terhubung!', 'success'); }
      catch (e) { showToast(e.message, 'error'); }
      finally { btn.disabled = false; btn.textContent = '🧪 Test Qwen'; }
    });
  }, 100);
}

// ====== PROJECT MANAGEMENT ======
function saveCurrentProject() {
  const book = state.get('book');
  if (!book.subject && book.docTypes.length === 0) return;

  const projectId = state.get('currentProject') || uid();
  state.set('currentProject', projectId);

  const projectData = {
    id: projectId,
    title: book.docTypes.join('_').toUpperCase() + (book.topic ? ' - ' + book.topic : ''),
    author: book.subject || 'Guru',
    stateData: state.toJSON(),
  };

  saveProject(projectData);
  showToast(`Proyek berhasil disimpan!`, 'success');
}

function showProjectsModal() {
  const projects = getProjects();

  if (projects.length === 0) {
    showModal(
      '📚 Proyek Saya',
      `<div class="empty-state" style="padding: var(--space-xl) 0;">
        <div class="empty-state-icon">📂</div>
        <div class="empty-state-title">Belum ada proyek</div>
        <div class="empty-state-text">Proyek akan tersimpan otomatis saat Anda bekerja.</div>
      </div>`,
      [{ text: 'Tutup', class: 'btn-ghost' }]
    );
    return;
  }

  const projectListHtml = `
    <div class="project-list">
      ${projects.map(p => `
        <div class="project-item" data-project-id="${p.id}">
          <div class="project-item-info">
            <div class="project-item-title">${p.title || 'Tanpa Judul'}</div>
            <div class="project-item-meta">${p.author || ''} · ${p.updatedAt ? formatDate(p.updatedAt) : 'Baru'}</div>
          </div>
          <button class="btn btn-danger btn-sm btn-delete-project" data-project-id="${p.id}" title="Hapus">🗑️</button>
        </div>
      `).join('')}
    </div>
  `;

  showModal('📚 Proyek Saya', projectListHtml, [
    {
      text: 'Simpan Proyek Saat Ini',
      class: 'btn-primary',
      close: false,
      onClick: () => { saveCurrentProject(); hideModal(); showProjectsModal(); },
    },
    { text: 'Tutup', class: 'btn-ghost' },
  ]);

  setTimeout(() => {
    document.querySelectorAll('.project-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-project')) return;
        loadProjectById(el.dataset.projectId);
        hideModal();
      });
    });

    document.querySelectorAll('.btn-delete-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteProject(btn.dataset.projectId);
        showToast('Proyek dihapus.', 'info');
        hideModal();
        showProjectsModal();
      });
    });
  }, 100);
}

function loadProjectById(projectId) {
  const project = loadProject(projectId);
  if (!project || !project.stateData) {
    showToast('Gagal memuat proyek.', 'error');
    return;
  }

  state.loadFromJSON(project.stateData);
  state.set('currentProject', projectId);
  state.set('currentView', 'document');
  window.dispatchEvent(new Event('viewchange'));
}

// ====== AUTO-SAVE ======
function setupAutoSave() {
  setInterval(() => {
    const book = state.get('book');
    if (book.subject || book.docTypes.length > 0) {
      autoSave(state.toJSON());
    }
  }, 30000);

  window.addEventListener('beforeunload', () => {
    const book = state.get('book');
    if (book.subject || book.docTypes.length > 0) {
      autoSave(state.toJSON());
    }
  });
}

function checkAutoSaveRecovery() {
  const saved = loadAutoSave();
  if (saved && saved.data?.book?.subject) {
    showToast(
      `Proyek sebelumnya ditemukan. Klik Proyek Saya untuk memuat.`,
      'info',
      6000
    );
  }
}

// ====== PROFILE PERSISTENCE ======
function loadSavedProfile() {
  const savedProfile = loadProfile();
  if (savedProfile) {
    state.set('profile', savedProfile);
  }

  // Also load saved settings (API keys, model selection, etc.)
  const savedSettings = loadSavedSettings();
  if (savedSettings) {
    Object.entries(savedSettings).forEach(([key, value]) => {
      state.set(`settings.${key}`, value);
    });
  }
}

function loadSavedSettings() {
  try {
    const saved = localStorage.getItem('perangkat_guru_settings');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

// ====== START ======
document.addEventListener('DOMContentLoaded', init);
