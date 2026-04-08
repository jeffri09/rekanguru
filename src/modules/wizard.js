// ============================================================
// Wizard Module — 3-Step Navigation Controller
// ============================================================

import { state } from '../state.js';

const TOTAL_STEPS = 3;
const stepModules = [];

/**
 * Register step modules
 */
export function registerSteps(modules) {
  stepModules.length = 0;
  stepModules.push(...modules);
}

/**
 * Initialize wizard
 */
export function initWizard() {
  updateProgressUI();
  renderCurrentStep();

  // Nav buttons
  document.getElementById('btn-prev')?.addEventListener('click', goToPrevStep);
  document.getElementById('btn-next')?.addEventListener('click', goToNextStep);

  // Step indicators (click to navigate)
  document.querySelectorAll('.step[data-step]').forEach((el) => {
    el.addEventListener('click', () => {
      const stepIdx = parseInt(el.dataset.step);
      const completed = state.get('completedSteps') || [];
      if (stepIdx <= state.get('currentStep') || completed.includes(stepIdx)) {
        navigateToStep(stepIdx);
      }
    });
  });
}

/**
 * Navigate to a specific step
 */
function navigateToStep(stepIdx) {
  if (stepIdx < 0 || stepIdx >= TOTAL_STEPS) return;
  if (stepIdx === state.get('currentStep')) return;

  const currentModule = stepModules[state.get('currentStep')];
  if (currentModule?.destroy) currentModule.destroy();

  state.set('currentStep', stepIdx);
  updateProgressUI();
  renderCurrentStep();
}

/**
 * Go to previous step
 */
function goToPrevStep() {
  const current = state.get('currentStep');
  if (current > 0) {
    navigateToStep(current - 1);
  }
}

/**
 * Go to next step
 */
async function goToNextStep() {
  const current = state.get('currentStep');
  const currentModule = stepModules[current];

  if (currentModule?.validate) {
    const isValid = await currentModule.validate();
    if (!isValid) return;
  }

  if (currentModule?.getData) {
    currentModule.getData();
  }

  const completed = state.get('completedSteps') || [];
  if (!completed.includes(current)) {
    completed.push(current);
    state.set('completedSteps', completed);
  }

  if (current < TOTAL_STEPS - 1) {
    navigateToStep(current + 1);
  }
}

/**
 * Render the current step's content
 */
function renderCurrentStep() {
  const container = document.getElementById('wizard-content');
  const stepIdx = state.get('currentStep');
  const stepModule = stepModules[stepIdx];

  if (!stepModule) {
    container.innerHTML = '<div class="empty-state"><p>Module tidak ditemukan.</p></div>';
    return;
  }

  container.innerHTML = `<div class="step-container">${stepModule.render()}</div>`;

  if (stepModule.init) {
    setTimeout(() => stepModule.init(), 50);
  }

  updateNavButtons();
}

/**
 * Update progress bar and step indicators
 */
function updateProgressUI() {
  const current = state.get('currentStep');
  const completed = state.get('completedSteps') || [];

  const progressPercent = (current / (TOTAL_STEPS - 1)) * 100;
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = `${progressPercent}%`;

  document.querySelectorAll('.step[data-step]').forEach((el) => {
    const idx = parseInt(el.dataset.step);
    el.classList.remove('active', 'completed');

    if (idx === current) {
      el.classList.add('active');
    } else if (completed.includes(idx)) {
      el.classList.add('completed');
    }
  });
}

/**
 * Update navigation buttons
 */
function updateNavButtons() {
  const current = state.get('currentStep');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const navInfo = document.getElementById('nav-info');

  if (btnPrev) btnPrev.disabled = current === 0;
  if (navInfo) navInfo.textContent = `Langkah ${current + 1} dari ${TOTAL_STEPS}`;

  if (btnNext) {
    const nextSpan = btnNext.querySelector('span');
    if (current === TOTAL_STEPS - 1) {
      nextSpan.textContent = 'Selesai';
      btnNext.disabled = true;
    } else {
      nextSpan.textContent = 'Selanjutnya';
      btnNext.disabled = false;
    }
  }
}

/**
 * Force refresh current step
 */
export function refreshCurrentStep() {
  renderCurrentStep();
}
