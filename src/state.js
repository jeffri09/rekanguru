// ============================================================
// State Management — Simple event-based centralized state
// ============================================================

const initialState = {
  // App view: 'dashboard' | 'document' | 'crossword'
  currentView: 'dashboard',

  // Current wizard step (for document wizard)
  currentStep: 0,
  completedSteps: [],

  // Document metadata
  book: {
    targetRole: 'guru', // 'guru' | 'kepsek'
    docTypes: ['modul_ajar'],
    subject: '',
    classPhase: '',
    schoolLevel: 'kota', // 'kota' | 'pinggiran' | 'pelosok'
    topic: '',
    description: '',
    chapterLength: 'sedang',
    referenceText: '',
  },

  // Outline
  outline: {
    chapters: [],
  },

  // Generated content
  content: {},

  // Settings
  settings: {
    apiProvider: 'gemini',
    geminiKey: '',  // Isi di ⚙️ Settings — jangan hardcode di sini!
    qwenKey: '',    // Isi di ⚙️ Settings
    geminiModel: 'gemini-3.1-flash-lite-preview',
    qwenModel: 'qvq-max-2025-03-25',
  },

  // Export settings
  exportSettings: {
    bodyFont: 'Times New Roman',
    headingFont: 'Arial',
    bodySize: 12,
    headingSize: 16,
    spacing: 1.5,
    includeCover: true,
    includeToc: true,
    includePageNumbers: true,
    includeHeaders: true,
  },

  // Project
  currentProject: null,

  // Generation state
  generation: {
    isGenerating: false,
    currentChapter: -1,
    progress: 0,
    logs: [],
  },

  // Crossword state
  crossword: {
    topic: '',
    difficulty: 'sedang', // 'sangat_mudah' | 'mudah' | 'sedang' | 'sulit' | 'sangat_sulit'
    wordCount: 10,
    clueLang: 'id',    // 'id' | 'en' | 'ar'
    answerLang: 'id',  // 'id' | 'en' | 'ar'
    words: [], // { word, clue, direction, row, col, number }
    grid: null,
    isGenerating: false,
  },
};

class AppState {
  constructor() {
    this.data = JSON.parse(JSON.stringify(initialState));
    this.listeners = new Map();
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.data);
  }

  set(path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (obj[key] === undefined) obj[key] = {};
      return obj[key];
    }, this.data);
    target[last] = value;
    this.emit('change', { path, value });
    this.emit(`change:${path}`, value);
  }

  update(path, updater) {
    const current = this.get(path);
    this.set(path, updater(current));
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const list = this.listeners.get(event);
    if (list) {
      const idx = list.indexOf(callback);
      if (idx > -1) list.splice(idx, 1);
    }
  }

  emit(event, data) {
    const list = this.listeners.get(event);
    if (list) {
      list.forEach((cb) => cb(data));
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(initialState));
    this.emit('reset');
  }

  toJSON() {
    return JSON.parse(JSON.stringify(this.data));
  }

  loadFromJSON(json) {
    this.data = { ...JSON.parse(JSON.stringify(initialState)), ...json };
    this.emit('loaded');
  }
}

export const state = new AppState();
