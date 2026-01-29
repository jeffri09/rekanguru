import { GoogleGenAI } from "@google/genai";
import { AdminRequest, AdminDocType, QuizRequest } from "../types";

// Inisialisasi AI dengan API Key
// Mendukung rotasi multiple API keys untuk menangani banyak user
const API_KEYS: string[] = [];

// Load multiple API keys from environment (GEMINI_API_KEY_1 through GEMINI_API_KEY_10)
if (typeof process !== 'undefined' && process.env) {
  for (let i = 1; i <= 10; i++) {
    const keyName = `GEMINI_API_KEY_${i}`;
    const key = process.env[keyName];
    if (key && key !== 'PLACEHOLDER_API_KEY' && key.trim().length > 10) {
      API_KEYS.push(key);
      console.log(`[Init] Loaded API Key ${i}`);
    }
  }
}

// Fallback ke single GEMINI_API_KEY jika ada
if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'PLACEHOLDER_API_KEY') {
  // Avoid duplicate if already loaded as GEMINI_API_KEY_1
  if (!API_KEYS.includes(process.env.GEMINI_API_KEY)) {
    console.log("[Init] Using fallback GEMINI_API_KEY");
    API_KEYS.push(process.env.GEMINI_API_KEY);
  }
}

console.log(`[Init] Total ${API_KEYS.length} API Key(s) loaded for rotation`);

// State rotasi
let currentKeyIndex = 0;
let lastRotationTime = Date.now();
const ROTATION_INTERVAL = 6000; // 6 detik

// State untuk delay antar request (mencegah rate limit)
let lastRequestTime = 0;
const REQUEST_DELAY = 5000; // 5 detik delay antar request

const getActiveGenAI = (): GoogleGenAI => {
  // Cek Custom API Key dari LocalStorage (jika ada)
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem('custom_gemini_api_key');
    if (customKey && customKey.trim().length > 10) {
      console.log(`[API Custom] Using User-Provided API Key`);
      return new GoogleGenAI({ apiKey: customKey });
    }
  }

  // Jika tidak ada custom key dan tidak ada API_KEYS, throw error
  if (API_KEYS.length === 0) {
    throw new Error('🔑 API Key belum dikonfigurasi. Silakan masukkan API Key Anda di menu Pengaturan API.');
  }

  const now = Date.now();
  // Cek apakah sudah waktunya rotasi (setiap 6 detik)
  if (now - lastRotationTime > ROTATION_INTERVAL) {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    lastRotationTime = now;
    console.log(`[API Rotation] Rotating to key index: ${currentKeyIndex}`);
  }

  return new GoogleGenAI({ apiKey: API_KEYS[currentKeyIndex] });
};

// Fungsi untuk memaksa rotasi jika kena error (misal Rate Limit)
const rotateKeyImmediately = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  lastRotationTime = Date.now(); // Reset timer agar tidak double rotate
  console.log(`[Error Recovery] Force rotating to key index: ${currentKeyIndex}`);
};

// Inisialisasi awal (dynamic getter akan digunakan di function)
const getAi = () => getActiveGenAI();
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // OLD STATIC

// ====== PROFESSIONAL ERROR HANDLING ======
interface GeminiError extends Error {
  status?: number;
  code?: string;
}

// Error messages yang user-friendly dalam Bahasa Indonesia
const getErrorMessage = (error: GeminiError): string => {
  const status = error.status || 0;
  const code = error.code || '';
  const message = error.message || '';

  // Rate Limit Errors
  if (status === 429 || code === 'RATE_LIMIT_EXCEEDED' || message.includes('quota')) {
    return '⏳ Batas penggunaan AI tercapai (Rate Limit/Quota). Solusi: Buat API Key BARU di aistudio.google.com/app/apikey lalu masukkan di Pengaturan API.';
  }

  // API Key Errors
  if (status === 401 || status === 403 || message.includes('API key')) {
    return '🔑 API Key tidak valid atau belum diatur. Periksa kembali konfigurasi API Key Anda.';
  }

  // Network Errors
  if (message.includes('network') || message.includes('fetch') || message.includes('ECONNREFUSED')) {
    return '🌐 Koneksi internet terputus. Periksa koneksi Anda dan coba lagi.';
  }

  // Content Safety
  if (message.includes('safety') || message.includes('blocked') || code === 'SAFETY') {
    return '⚠️ Konten tidak dapat diproses karena filter keamanan. Coba ubah input Anda.';
  }

  // Model Not Found
  if (status === 404 || message.includes('model')) {
    return '❌ Model AI tidak tersedia. Mohon hubungi pengembang aplikasi.';
  }

  // Server Errors
  if (status >= 500) {
    return '🔧 Server Gemini sedang sibuk. Silakan coba lagi dalam beberapa saat.';
  }

  // Default
  return `❌ Terjadi kesalahan: ${message || 'Gagal menghubungi AI'}. Silakan coba lagi.`;
};

// Delay utility for retry
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Tunggu delay antar request untuk mencegah rate limit
const waitForDelay = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (lastRequestTime > 0 && timeSinceLastRequest < REQUEST_DELAY) {
    const waitTime = REQUEST_DELAY - timeSinceLastRequest;
    console.log(`[Rate Limit Protection] Waiting ${waitTime}ms before next request...`);
    await delay(waitTime);
  }

  lastRequestTime = Date.now();
};

// Retry wrapper with exponential backoff
const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  baseDelay: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRetryable = error.status === 429 || error.status >= 500 ||
        error.message?.includes('network');

      // Trigger immediate rotation on retryable errors (especially Rate Limits)
      if (isRetryable) {
        rotateKeyImmediately();
      }

      if (attempt === maxRetries || !isRetryable) {
        // Throw user-friendly error
        const userMessage = getErrorMessage(error);
        const enhancedError = new Error(userMessage);
        throw enhancedError;
      }

      // Wait before retry (exponential backoff)
      await delay(baseDelay * Math.pow(2, attempt));
    }
  }
  throw new Error('Unexpected error in retry logic');
};

const estimateProgress = (currentLength: number): number => {
  const estimatedTotal = 4000;
  return Math.min(Math.round((currentLength / estimatedTotal) * 100), 99);
};

export const generateQuizFromPDF = async (req: QuizRequest, onProgress?: (p: number) => void): Promise<string> => {
  const prompt = `Anda adalah pakar asesmen Kurikulum Merdeka Indonesia.

TUGAS: Buat ${req.jumlahSoal} soal ${req.jenisSoal} berkualitas tinggi.

KONTEKS:
- Topik: ${req.topik}
- Mata Pelajaran: ${req.mataPelajaran}
- Standar: Kurikulum Merdeka dengan pendekatan HOTS (Higher Order Thinking Skills)

INSTRUKSI:
1. Baca dan analisis materi PDF yang diberikan
2. Buat soal dengan tingkat kognitif C4-C6 (Menganalisis, Mengevaluasi, Mencipta)
3. Setiap soal harus relevan dengan materi PDF
4. Sertakan KUNCI JAWABAN dengan PEMBAHASAN lengkap di bagian akhir

FORMAT OUTPUT:
## SOAL
[Nomor soal dengan pilihan jika PG]

## KUNCI JAWABAN & PEMBAHASAN
[Jawaban benar dan penjelasan detail]

ATURAN FORMAT WAJIB:
- Gunakan Bahasa Indonesia formal dan akademis
- JANGAN gunakan tag HTML apapun (seperti <br>, <p>, <div>, dll). Gunakan HANYA format Markdown murni
- Untuk baris baru, gunakan dua enter (paragraf baru) atau tanda strip (-) untuk list
- Untuk rumus matematika/sains, gunakan format LaTeX:
  * Inline: $E = mc^2$ atau $\\frac{a}{b}$
  * Block: $$\\sum_{i=1}^{n} x_i$$
- Contoh penulisan rumus yang benar:
  * Pythagoras: $a^2 + b^2 = c^2$
  * Pecahan: $\\frac{1}{2}$
  * Akar: $\\sqrt{x}$
  * Pangkat: $x^2$ atau $x^{10}$
  * Indeks: $x_1$ atau $x_{12}$`;

  return withRetry(async () => {
    // Wait for delay to prevent rate limiting
    await waitForDelay();

    // Get fresh AI instance (might be rotated)
    const aiInstance = getAi();
    const response = await aiInstance.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: req.mimeType, data: req.fileBase64 } }
          ]
        }
      ]
    });

    if (onProgress) onProgress(100);
    return response.text || "Gagal menghasilkan konten.";
  });
};

export const generateAdminDocs = async (req: AdminRequest, onProgress?: (p: number) => void): Promise<string> => {
  // Build comprehensive prompt based on document type
  const buildPrompt = (): string => {
    const baseContext = `
ANDA ADALAH PAKAR KURIKULUM MERDEKA INDONESIA dengan keahlian:
- Penyusunan dokumen administrasi pembelajaran sesuai standar terbaru
- Implementasi Deep Learning (Mindful, Meaningful, Joyful)
- Penerapan 8 Dimensi Profil Lulusan Deep Learning (Keimanan, Kewargaan, Penalaran Kritis, Kreativitas, Kolaborasi, Kemandirian, Kesehatan, Komunikasi)

INFORMASI GURU & SEKOLAH:
- Nama Guru: ${req.identity.nama || 'Guru'}
- NIP: ${req.identity.nip || '-'}
- Sekolah: ${req.identity.sekolah || 'Sekolah'}
- Kepala Sekolah: ${req.identity.kepalaSekolah || '-'}
- Semester: ${req.identity.semester}
- Tahun Ajaran: ${req.identity.tahunAjaran}

KONTEKS PEMBELAJARAN:
- Fase: ${req.fase}
- Mata Pelajaran: ${req.mataPelajaran || 'Umum'}
- Elemen CP: ${req.elemen || 'Umum'}
- Topik/Materi: ${req.topik || 'Umum'}
- Alokasi Waktu: ${req.alokasiWaktu || '2 JP'}
- Model Pembelajaran: ${req.modelPembelajaran || 'Deep Learning'}
- Sarana Prasarana: ${req.saranaPrasarana || 'Buku, LCD, Laptop'}
- Jumlah Siswa: ${req.jumlahSiswa || '30 siswa'}
- Target Peserta Didik: ${req.targetPesertaDidik || 'Siswa reguler'}
- Profil Lulusan Deep Learning: ${req.profilPelajar?.join(', ') || 'Penalaran Kritis, Kreativitas, Komunikasi'}
`;

    // Document-specific instructions
    const docInstructions: Record<string, string> = {
      [AdminDocType.ModulAjar]: `
BUAT MODUL AJAR KURIKULUM MERDEKA dengan struktur LENGKAP:

## A. INFORMASI UMUM
1. Identitas Modul (Nama penyusun, sekolah, tahun, fase, kelas)
2. Kompetensi Awal yang dibutuhkan siswa
3. Profil Lulusan Deep Learning yang dikembangkan: ${req.profilPelajar?.join(', ')}
4. Sarana Prasarana: ${req.saranaPrasarana}
5. Target Peserta Didik: ${req.targetPesertaDidik}
6. Model Pembelajaran: ${req.modelPembelajaran}

## B. KOMPONEN INTI
1. Capaian Pembelajaran (CP) - sesuai fase ${req.fase}
2. Tujuan Pembelajaran (TP) - SMART dan terukur
3. Alur Tujuan Pembelajaran (ATP)
4. Pemahaman Bermakna - koneksi dengan kehidupan nyata
5. Pertanyaan Pemantik - minimal 3 pertanyaan menggugah

## C. KEGIATAN PEMBELAJARAN (Pendekatan Deep Learning)
### Pendahuluan (±15 menit)
- Aktivitas MINDFUL: kesadaran dan fokus
- Apersepsi dan motivasi

### Inti (±50 menit) 
- Aktivitas MEANINGFUL: pembelajaran bermakna terhubung kehidupan nyata
- Langkah-langkah sesuai model ${req.modelPembelajaran}
- Diferensiasi untuk beragam kebutuhan siswa

### Penutup (±15 menit)
- Aktivitas JOYFUL: refleksi menyenangkan
- Kesimpulan dan tindak lanjut

## D. ASESMEN
1. Asesmen Diagnostik (awal)
2. Asesmen Formatif (proses)  
3. Asesmen Sumatif (akhir)
- Sertakan rubrik penilaian

## E. PENGAYAAN & REMEDIASI

## F. REFLEKSI GURU

FORMAT: Gunakan Markdown dengan tabel yang rapi.
`,
      [AdminDocType.ATP]: `
BUAT ALUR TUJUAN PEMBELAJARAN (ATP) dengan format:

## INFORMASI UMUM
- Fase: ${req.fase}
- Mata Pelajaran: ${req.mataPelajaran}
- Elemen: ${req.elemen}

## CAPAIAN PEMBELAJARAN
Tuliskan CP resmi sesuai fase

## ALUR TUJUAN PEMBELAJARAN
Buat tabel dengan kolom:
| No | Tujuan Pembelajaran | Indikator | Alokasi Waktu | Profil Lulusan Deep Learning |

PASTIKAN ATP:
- Sistematis dan berurutan
- Terukur dengan SMART
- Terintegrasi Profil Lulusan Deep Learning
`,
      [AdminDocType.AnalisisCP]: `
BUAT ANALISIS CAPAIAN PEMBELAJARAN dengan format:

## CAPAIAN PEMBELAJARAN FASE ${req.fase}
## ELEMEN: ${req.elemen}

## TABEL ANALISIS
| Capaian Pembelajaran | Tujuan Pembelajaran | Konten | Keterampilan | Sikap |

## PEMETAAN KE PROFIL LULUSAN DEEP LEARNING
`,
      [AdminDocType.KKTP]: `
BUAT KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP) dengan format:

## IDENTITAS
- Mata Pelajaran: ${req.mataPelajaran}
- Fase: ${req.fase}
- Topik: ${req.topik}

## TABEL KKTP
| Tujuan Pembelajaran | Kriteria Ketercapaian | Teknik Asesmen | Bentuk Instrumen |

## RUBRIK PENILAIAN
Buat rubrik dengan 4 level: Belum Berkembang, Mulai Berkembang, Berkembang Sesuai Harapan, Sangat Berkembang
`
    };

    const specificInstruction = docInstructions[req.docType] || `
BUAT DOKUMEN ${req.docType} sesuai standar Kurikulum Merdeka.
Gunakan format yang profesional dengan tabel jika diperlukan.
Integrasikan pendekatan Deep Learning dan Profil Pelajar Pancasila.
`;

    return baseContext + specificInstruction + `

ATURAN FORMAT WAJIB:
- Gunakan Bahasa Indonesia formal dan profesional
- JANGAN mengarang konten - gunakan standar Kurikulum Merdeka resmi
- Format output dalam Markdown yang rapi, JANGAN gunakan tag HTML apapun (seperti <br>, <p>, <div>, dll)
- Untuk baris baru gunakan dua enter (paragraf baru) atau tanda strip (-) untuk list
- Sertakan tabel dengan format Markdown yang benar:
  | Kolom 1 | Kolom 2 |
  |---------|--------|
  | Data 1  | Data 2 |
- Untuk rumus matematika/sains, gunakan format LaTeX:
  * Inline: $E = mc^2$ atau $\\frac{a}{b}$
  * Block: $$\\sum_{i=1}^{n} x_i$$
- Contoh penulisan rumus yang benar:
  * Pythagoras: $a^2 + b^2 = c^2$
  * Pecahan: $\\frac{1}{2}$
  * Akar: $\\sqrt{x}$
  * Pangkat: $x^2$ atau $x^{10}$
  * Indeks: $x_1$ atau $x_{12}$

PENTING - JANGAN BUAT BAGIAN TANDA TANGAN:
- JANGAN membuat bagian "Mengetahui", "Kepala Sekolah", "Guru Mata Pelajaran", atau tanda tangan apapun
- JANGAN membuat footer dokumen dengan tempat tanda tangan
- Bagian tanda tangan akan ditambahkan SECARA OTOMATIS oleh sistem aplikasi
- Fokus HANYA pada konten inti dokumen pembelajaran
`;
  };

  const prompt = buildPrompt();

  return withRetry(async () => {
    // Wait for delay to prevent rate limiting
    await waitForDelay();

    // Get fresh AI instance (might be rotated)
    const aiInstance = getAi();
    const result = await aiInstance.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    let fullText = "";
    for await (const chunk of result) {
      if (chunk.text) {
        fullText += chunk.text;
        if (onProgress) onProgress(estimateProgress(fullText.length));
      }
    }

    if (onProgress) onProgress(100);
    return fullText;
  });
};

export const testConnection = async (apiKey?: string): Promise<boolean> => {
  try {
    const aiToTest = apiKey
      ? new GoogleGenAI({ apiKey })
      : getAi(); // Use default rotation or existing custom key logic

    await aiToTest.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: "Test" }] }]
    });
    return true;
  } catch (e) {
    console.error("Connection Test Failed:", e);
    return false;
  }
};
