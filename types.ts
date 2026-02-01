
export enum Fase {
  Fondasi = "Fase Fondasi (PAUD)",
  A = "Fase A (Kelas 1-2 SD)",
  B = "Fase B (Kelas 3-4 SD)",
  C = "Fase C (Kelas 5-6 SD)",
  D = "Fase D (SMP Kelas 7-9)",
  E = "Fase E (SMA Kelas 10)",
  F = "Fase F (SMA Kelas 11-12)"
}

// Simplified - only Administrasi Guru remains
export enum AppCategory {
  Administrasi = "Administrasi Guru"
}

export enum AdminDocType {
  // Administrasi Guru
  AnalisisCP = "Analisis CP & TP",
  ATP = "ATP (Alur Tujuan Pembelajaran)",
  ModulAjar = "Modul Ajar (RPP Plus)",
  BahanBacaan = "Bahan Bacaan Guru & Siswa",
  KKTP = "KKTP (Kriteria Ketercapaian)",
  Prota = "Program Tahunan (Prota)",
  Promes = "Program Semester (Promes)",
  AsesmenDiagnostik = "Asesmen Awal (Diagnostik)",
  AsesmenFormatif = "Asesmen Formatif",
  AsesmenSumatif = "Asesmen Sumatif (Lingkup Materi)",
  KisiKisi = "Kisi-Kisi Penilaian",
  BankSoal = "Bank Soal & Kunci Jawaban"
}

export interface TeacherIdentity {
  nama: string;
  nip: string;
  sekolah: string;
  kota: string;
  kepalaSekolah: string;
  nipKepala: string;
  semester: "1 (Ganjil)" | "2 (Genap)";
  tahunAjaran: string;
}

export interface AdminRequest {
  docType: AdminDocType;
  identity: TeacherIdentity;

  // Field Administrasi Guru
  fase?: Fase;
  mataPelajaran?: string;
  elemen?: string;
  topik?: string;
  alokasiWaktu?: string;

  // Pedagogical Details
  modelPembelajaran?: string;
  profilPelajar?: string[];
  saranaPrasarana?: string;
  jumlahSiswa?: string;
  targetPesertaDidik?: string;
  karakteristikSiswa?: string;
}

export interface GeneratedDocument {
  id: string;
  title: string;
  type: 'admin';
  content: string;
  metadata?: {
    identity?: TeacherIdentity;
    docType?: AdminDocType;
    category?: AppCategory;
  };
  createdAt: number;
}

export interface AppState {
  currentView: 'form' | 'results';
  activeCategory: AppCategory;
  isLoading: boolean;
  documents: GeneratedDocument[];
  activeDocumentId: string | null;
  error: string | null;
}

export interface CompletedDocItem {
  docType: AdminDocType;
  content: string;
  timestamp: number;
}

export interface GenerationProgress {
  sessionId: string;
  requestData: AdminRequest;
  selectedTypes: AdminDocType[];
  completedDocs: CompletedDocItem[];
  pendingTypes: AdminDocType[];
  lastError?: string;
  status: 'in_progress' | 'completed' | 'error' | 'paused';
}
