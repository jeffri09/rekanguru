// ============================================================
// Main — App Entry Point (Perangkat Guru AI)
// ============================================================

import './styles/index.css';
import { state } from './state.js';
import { registerSteps, initWizard } from './modules/wizard.js';
import { showToast, showModal, hideModal, uid, formatDate } from './utils/helpers.js';
import { saveProject, getProjects, loadProject, deleteProject, autoSave, loadAutoSave } from './services/storage.js';
import { testConnection } from './services/gemini.js';

// Import step modules (3-step wizard)
import setupModule from './modules/setup.js';
import generatePreviewModule from './modules/generate-preview.js';
import exportModule from './modules/export.js';

// Import crossword module
import { renderCrosswordPage, initCrosswordPage } from './modules/crossword.js';

// ====== INITIALIZATION ======
function init() {
  setupHeaderButtons();
  setupAutoSave();
  checkAutoSaveRecovery();

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
    registerSteps([setupModule, generatePreviewModule, exportModule]);
    initWizard();
  } else if (view === 'crossword') {
    wizardProgress.style.display = 'none';
    wizardNav.style.display = 'none';
    projectName.textContent = 'Teka-Teki Silang';
    mainContent.innerHTML = renderCrosswordPage();
    initCrosswordPage();
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

  const bodyHtml = `
    <div class="form-group">
      <label class="form-label">Penyedia AI Aktif</label>
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
          <option value="gemini-3.1-flash-lite-preview" ${settings.geminiModel === 'gemini-3.1-flash-lite-preview' ? 'selected' : ''}>Gemini 3.1 Flash Lite</option>
          <option value="gemini-3.1-pro-preview" ${settings.geminiModel === 'gemini-3.1-pro-preview' ? 'selected' : ''}>Gemini 3.1 Pro</option>
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
  `;

  showModal('⚙️ Pengaturan AI', bodyHtml, [
    {
      text: 'Simpan',
      class: 'btn-primary',
      onClick: () => {
        state.set('settings.apiProvider', document.getElementById('modal-provider-gemini')?.classList.contains('btn-primary') ? 'gemini' : 'qwen');
        state.set('settings.geminiKey', document.getElementById('modal-gemini-key')?.value || '');
        state.set('settings.qwenKey', document.getElementById('modal-qwen-key')?.value || '');
        state.set('settings.geminiModel', document.getElementById('modal-gemini-model')?.value || 'gemini-3.1-flash-lite-preview');
        state.set('settings.qwenModel', document.getElementById('modal-qwen-model')?.value || 'qvq-max-2025-03-25');
        showToast('Pengaturan AI disimpan!', 'success');
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
      // Save keys first
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

// ====== START ======
document.addEventListener('DOMContentLoaded', init);
