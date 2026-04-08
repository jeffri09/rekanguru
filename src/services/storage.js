// ============================================================
// Storage Service — LocalStorage persistence
// ============================================================

const PROJECTS_KEY = 'ebookmaker_projects';
const AUTOSAVE_KEY = 'ebookmaker_autosave';

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
