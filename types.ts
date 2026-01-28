
export enum Fase {
  Fondasi = "Fase Fondasi (PAUD)",
  A = "Fase A (Kelas 1-2 SD)",
  B = "Fase B (Kelas 3-4 SD)",
  C = "Fase C (Kelas 5-6 SD)",
  D = "Fase D (SMP Kelas 7-9)",
  E = "Fase E (SMA Kelas 10)",
  F = "Fase F (SMA Kelas 11-12)"
}

export enum AppCategory {
  Administrasi = "Administrasi Guru",
  Publikasi = "Publikasi Ilmiah & Inovasi",
  Kinerja = "Laporan Kinerja",
  Bimbingan = "Asisten Wali Kelas",
  Kuis = "Bank Soal AI"
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
  BankSoal = "Bank Soal & Kunci Jawaban",

  // Publikasi Ilmiah
  ProposalPTK = "Proposal PTK (Bab 1-3)",
  BestPractice = "Best Practice (Metode STAR)",
  IdeInovasi = "Ide Alat Peraga & Inovasi",

  // Laporan Kinerja
  LaporanDiklat = "Laporan Pengembangan Diri (Diklat)",
  RefleksiDiri = "Refleksi Pembelajaran (Model 4F)",

  // Bimbingan Siswa
  JurnalSikap = "Jurnal Sikap (Catatan Anekdotal)",
  SkenarioRestitusi = "Skenario Segitiga Restitusi",

  // Kuis
  SoalQuiz = "Soal Latihan & Kunci Jawaban"
}

export interface TeacherIdentity {
  nama: string;
  nip: string;
  sekolah: string;
  kota: string; // Kota untuk tanda tangan dokumen
  kepalaSekolah: string;
  nipKepala: string;
  semester: "1 (Ganjil)" | "2 (Genap)";
  tahunAjaran: string;
}

export interface AdminRequest {
  docType: AdminDocType;
  identity: TeacherIdentity;

  // Field Administrasi Guru & Umum
  fase?: Fase;
  mataPelajaran?: string;
  elemen?: string; // New: Elemen CP (Bilangan, Aljabar, dll)
  topik?: string; // Materi Pokok
  alokasiWaktu?: string;

  // New Pedagogical Details
  modelPembelajaran?: string;
  profilPelajar?: string[];
  saranaPrasarana?: string;
  jumlahSiswa?: string;
  targetPesertaDidik?: string;

  karakteristikSiswa?: string;

  // Field Publikasi Ilmiah (PTK/Inovasi)
  masalah?: string;
  solusi?: string;

  // Field Best Practice (STAR)
  situasi?: string;
  tantangan?: string;
  aksi?: string;
  refleksi?: string;

  // Field Laporan Kinerja
  namaDiklat?: string;
  penyelenggara?: string;
  waktuDiklat?: string;

  // Field Bimbingan Siswa / Refleksi
  kasusSiswa?: string; // Input kejadian untuk jurnal/restitusi/refleksi
}

export interface QuizRequest {
  fileBase64: string;
  mimeType: string;
  jumlahSoal: number;
  jenisSoal: 'Pilihan Ganda' | 'Esai' | 'Campuran';
  identity: TeacherIdentity;
  topik: string;
  mataPelajaran: string;
}

export interface GeneratedDocument {
  id: string;
  title: string;
  type: 'admin' | 'quiz';
  content: string; // Pure Markdown content
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

// Progress tracking for resumable document generation
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
