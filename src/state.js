// ============================================================
// State Management — Simple event-based centralized state
// ============================================================

const initialState = {
  // App view: 'dashboard' | 'document' | 'crossword' | 'sumatif'
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
    jenjang: '',           // 'SD' | 'SMP' | 'SMA' | 'SMK' | 'MA'
    semester: '1',         // '1' | '2'
    tahunAjaran: '',       // e.g. '2025/2026'
    schoolLevel: 'kota', // 'kota' | 'pinggiran' | 'pelosok'
    topic: '',
    description: '',
    chapterLength: 'sedang',
    referenceText: '',

    // CP Scanning
    cpData: [],         // Array of { id, code, description, profilLulusan[] }
    cpScanned: false,   // Whether CP has been scanned

    // Distribusi Pertemuan (always active — dihitung dari alokasiWaktu)
    jumlahSumatif: 2,         // jumlah pertemuan asesmen sumatif
    distribusiPertemuan: [],  // Auto-generated: Array of { pertemuan, type:'reguler'|'sumatif', tpList[] }

    // Alokasi Waktu
    alokasiWaktu: {
      durasiJP: 40,           // menit per JP (auto dari jenjang: SD=30, SMP=40, SMA=45)
      jpPerPertemuan: 2,       // JP per pertemuan
      jpPerMinggu: 4,          // JP per minggu
      mingguEfektif: 18,       // minggu efektif per semester
    },

    // Sumatif Config (untuk modul ajar inline sumatif)
    sumatifConfig: {
      enabledTypes: {
        pilihan_ganda: true,
        isian_singkat: true,
        esai: false,
        mencocokkan: false,
      },
      questionCount: {
        pilihan_ganda: 10,
        isian_singkat: 5,
        esai: 3,
        mencocokkan: 5,
      },
      pgOptionCount: 4,
      difficultyLevel: 'sedang',  // 'mudah' | 'sedang' | 'hots'
    },

    // Model Pembelajaran
    modelPembelajaran: [],  // ['pbl', 'pjbl', 'discovery', 'inquiry', ...]
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
    enableGemini: true,
    enableQwen: false,
    autoFallback: false,     // jangan auto-fallback, user pilih sendiri
    geminiKey: '',  // Isi di ⚙️ Settings — jangan hardcode di sini!
    qwenKey: '',    // Isi di ⚙️ Settings
    geminiModel: 'gemini-3.1-flash-lite-preview',
    qwenModel: 'qvq-max-2025-03-25',
  },

  // Profil Guru & Sekolah (persisten di localStorage)
  profile: {
    namaGuru: '',
    nip: '',
    jabatan: 'Guru Mata Pelajaran',
    namaSekolah: '',
    npsn: '',
    alamatSekolah: '',
    kabupatenKota: '',
    provinsi: '',
    namaKepalaSekolah: '',
    nipKepalaSekolah: '',
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

  // ATP state (Alur Tujuan Pembelajaran)
  atp: {
    tujuanPembelajaran: [],  // Array of { id, tp, kompetensi, levelBloom, lingkupMateri, cpCode, cpIndex, semester, order }
    ordered: false,
  },

  // KKTP state (Kriteria Ketercapaian TP)
  kktp: {
    items: [],   // Array of { tpId, tpText, criteria: [{ id, text }], rubrikLevel: 'default' }
    reviewed: false,
  },

  // Crossword state
  crossword: {
    topic: '',
    difficulty: 'sedang', // 'sangat_mudah' | 'mudah' | 'sedang' | 'sulit' | 'sangat_sulit'
    wordCount: 10,
    clueLang: 'id',    // 'id' | 'en' | 'ar' | 'ar_h'
    answerLang: 'id',  // 'id' | 'en' | 'ar' | 'ar_h'
    jenjang: 'umum',   // 'sd' | 'smp' | 'sma' | 'smk' | 'ma' | 'umum'
    lastResult: null,  // Persisted crossword result for navigation
  },

  // Soal Sumatif state
  sumatif: {
    topic: '',
    subject: '',
    classPhase: '',
    schoolLevel: 'kota',
    enabledTypes: {
      pilihan_ganda: true,
      isian_singkat: false,
      esai: false,
      mencocokkan: false,
    },
    pgOptionCount: 4, // 3 = A-C, 4 = A-D, 5 = A-E
    difficulty: {
      pilihan_ganda: 'sedang',
      isian_singkat: 'sedang',
      esai: 'sedang',
      mencocokkan: 'sedang',
    },
    questionCount: {
      pilihan_ganda: 10,
      isian_singkat: 5,
      esai: 3,
      mencocokkan: 5,
    },
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
