// ============================================================
// Storage Service — LocalStorage persistence
// ============================================================

const PROJECTS_KEY = 'perangkat_guru_projects';
const AUTOSAVE_KEY = 'perangkat_guru_autosave';

// Legacy key names — migrate from old 'ebookmaker' naming
const LEGACY_PROJECTS_KEY = 'ebookmaker_projects';
const LEGACY_AUTOSAVE_KEY = 'ebookmaker_autosave';

/**
 * Migrate data from old localStorage keys to new ones (one-time)
 */
function migrateFromLegacyKeys() {
  try {
    // Migrate projects
    if (!localStorage.getItem(PROJECTS_KEY) && localStorage.getItem(LEGACY_PROJECTS_KEY)) {
      localStorage.setItem(PROJECTS_KEY, localStorage.getItem(LEGACY_PROJECTS_KEY));
      localStorage.removeItem(LEGACY_PROJECTS_KEY);
      console.log('📦 Migrated projects from legacy storage key.');
    }
    // Migrate autosave
    if (!localStorage.getItem(AUTOSAVE_KEY) && localStorage.getItem(LEGACY_AUTOSAVE_KEY)) {
      localStorage.setItem(AUTOSAVE_KEY, localStorage.getItem(LEGACY_AUTOSAVE_KEY));
      localStorage.removeItem(LEGACY_AUTOSAVE_KEY);
      console.log('📦 Migrated autosave from legacy storage key.');
    }
  } catch (e) {
    console.warn('Legacy migration failed:', e);
  }
}

// Run migration on module load
migrateFromLegacyKeys();

/**
 * Get all saved projects
 */
export function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Save a project
 */
export function saveProject(projectData) {
  const projects = getProjects();
  const existing = projects.findIndex((p) => p.id === projectData.id);

  const project = {
    ...projectData,
    updatedAt: new Date().toISOString(),
  };

  if (existing > -1) {
    projects[existing] = project;
  } else {
    project.createdAt = new Date().toISOString();
    projects.unshift(project);
  }

  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  return project;
}

/**
 * Load a project by ID
 */
export function loadProject(id) {
  const projects = getProjects();
  return projects.find((p) => p.id === id) || null;
}

/**
 * Delete a project
 */
export function deleteProject(id) {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

/**
 * Auto-save current state
 */
export function autoSave(stateData) {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
      data: stateData,
      timestamp: new Date().toISOString(),
    }));
  } catch (e) {
    console.warn('Auto-save failed:', e);
  }
}

/**
 * Load auto-saved state
 */
export function loadAutoSave() {
  try {
    const saved = JSON.parse(localStorage.getItem(AUTOSAVE_KEY));
    return saved || null;
  } catch {
    return null;
  }
}

/**
 * Clear auto-save
 */
export function clearAutoSave() {
  localStorage.removeItem(AUTOSAVE_KEY);
}

// ============================================================
// Profile & Settings Persistence
// ============================================================
const PROFILE_KEY = 'perangkat_guru_profile';
const SETTINGS_KEY = 'perangkat_guru_settings';

/**
 * Save teacher/school profile (persists across projects)
 */
export function saveProfile(profileData) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
  } catch (e) {
    console.warn('Profile save failed:', e);
  }
}

/**
 * Load saved profile
 */
export function loadProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Save settings (API keys, model preferences — persists across projects)
 */
export function saveSettings(settingsData) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsData));
  } catch (e) {
    console.warn('Settings save failed:', e);
  }
}

/**
 * Load saved settings
 */
export function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}
