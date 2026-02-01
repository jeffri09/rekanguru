/**
 * Data Kurikulum Merdeka Indonesia 2025
 * Mapping Fase → Mata Pelajaran → Elemen CP
 * Sesuai dengan BSKAP 046/H/KR/2025 dan Permendikdasmen No. 10 Tahun 2025
 * 
 * 8 Dimensi Profil Lulusan (menggantikan 6 Dimensi P5)
 */

import { Fase } from '../types';

// ========================================
// 8 DIMENSI PROFIL LULUSAN (2025)
// Permendikdasmen No. 10 Tahun 2025
// ========================================

export const DIMENSI_PROFIL_LULUSAN = [
    "Keimanan dan Ketakwaan terhadap Tuhan Yang Maha Esa",
    "Kewargaan",
    "Penalaran Kritis",
    "Kreativitas",
    "Kolaborasi",
    "Kemandirian",
    "Kesehatan",
    "Komunikasi"
] as const;

export type DimensiProfilLulusan = typeof DIMENSI_PROFIL_LULUSAN[number];

// ========================================
// MATA PELAJARAN PER FASE
// ========================================

export const MATA_PELAJARAN_BY_FASE: Record<Fase, string[]> = {
    [Fase.Fondasi]: [
        "Bermain dan Belajar (Sentra)",
        "Nilai Agama dan Budi Pekerti",
        "Jati Diri",
        "Dasar Literasi dan STEAM"
    ],
    [Fase.A]: [
        "Pendidikan Pancasila",
        "Bahasa Indonesia",
        "Matematika",
        "Pendidikan Agama Islam dan Budi Pekerti",
        "Pendidikan Agama Kristen dan Budi Pekerti",
        "Pendidikan Agama Katolik dan Budi Pekerti",
        "Pendidikan Agama Hindu dan Budi Pekerti",
        "Pendidikan Agama Buddha dan Budi Pekerti",
        "Pendidikan Agama Khonghucu dan Budi Pekerti",
        "Seni Musik",
        "Seni Rupa",
        "Seni Tari",
        "Seni Teater",
        "Pendidikan Jasmani, Olahraga, dan Kesehatan",
        "Bahasa Inggris" // Pilihan/Muatan Lokal
    ],
    [Fase.B]: [
        "Pendidikan Pancasila",
        "Bahasa Indonesia",
        "Matematika",
        "Pendidikan Agama Islam dan Budi Pekerti",
        "Pendidikan Agama Kristen dan Budi Pekerti",
        "Pendidikan Agama Katolik dan Budi Pekerti",
        "Pendidikan Agama Hindu dan Budi Pekerti",
        "Pendidikan Agama Buddha dan Budi Pekerti",
        "Pendidikan Agama Khonghucu dan Budi Pekerti",
        "IPAS (Ilmu Pengetahuan Alam dan Sosial)",
        "Bahasa Inggris",
        "Seni Musik",
        "Seni Rupa",
        "Seni Tari",
        "Seni Teater",
        "Pendidikan Jasmani, Olahraga, dan Kesehatan"
    ],
    [Fase.C]: [
        "Pendidikan Pancasila",
        "Bahasa Indonesia",
        "Matematika",
        "Pendidikan Agama Islam dan Budi Pekerti",
        "Pendidikan Agama Kristen dan Budi Pekerti",
        "Pendidikan Agama Katolik dan Budi Pekerti",
        "Pendidikan Agama Hindu dan Budi Pekerti",
        "Pendidikan Agama Buddha dan Budi Pekerti",
        "Pendidikan Agama Khonghucu dan Budi Pekerti",
        "IPAS (Ilmu Pengetahuan Alam dan Sosial)",
        "Bahasa Inggris",
        "Seni Musik",
        "Seni Rupa",
        "Seni Tari",
        "Seni Teater",
        "Pendidikan Jasmani, Olahraga, dan Kesehatan",
        "Informatika" // Pilihan
    ],
    [Fase.D]: [
        "Pendidikan Pancasila",
        "Bahasa Indonesia",
        "Matematika",
        "Pendidikan Agama Islam dan Budi Pekerti",
        "Pendidikan Agama Kristen dan Budi Pekerti",
        "Pendidikan Agama Katolik dan Budi Pekerti",
        "Pendidikan Agama Hindu dan Budi Pekerti",
        "Pendidikan Agama Buddha dan Budi Pekerti",
        "Pendidikan Agama Khonghucu dan Budi Pekerti",
        "Ilmu Pengetahuan Alam (IPA)",
        "Ilmu Pengetahuan Sosial (IPS)",
        "Bahasa Inggris",
        "Seni Musik",
        "Seni Rupa",
        "Seni Tari",
        "Seni Teater",
        "Pendidikan Jasmani, Olahraga, dan Kesehatan",
        "Informatika",
        "Prakarya (Kerajinan)",
        "Prakarya (Rekayasa)",
        "Prakarya (Budidaya)",
        "Prakarya (Pengolahan)",
        "Bahasa Jawa",
        "Bahasa Sunda",
        "Muatan Lokal"
    ],
    [Fase.E]: [
        "Pendidikan Pancasila",
        "Bahasa Indonesia",
        "Matematika",
        "Pendidikan Agama Islam dan Budi Pekerti",
        "Pendidikan Agama Kristen dan Budi Pekerti",
        "Pendidikan Agama Katolik dan Budi Pekerti",
        "Pendidikan Agama Hindu dan Budi Pekerti",
        "Pendidikan Agama Buddha dan Budi Pekerti",
        "Pendidikan Agama Khonghucu dan Budi Pekerti",
        "Fisika",
        "Kimia",
        "Biologi",
        "Sosiologi",
        "Ekonomi",
        "Geografi",
        "Sejarah",
        "Bahasa Inggris",
        "Seni Musik",
        "Seni Rupa",
        "Seni Tari",
        "Seni Teater",
        "Pendidikan Jasmani, Olahraga, dan Kesehatan",
        "Informatika",
        "Bahasa Jepang",
        "Bahasa Mandarin",
        "Bahasa Jerman",
        "Bahasa Perancis",
        "Bahasa Arab"
    ],
    [Fase.F]: [
        "Pendidikan Pancasila",
        "Bahasa Indonesia",
        "Matematika Tingkat Lanjut",
        "Matematika",
        "Pendidikan Agama Islam dan Budi Pekerti",
        "Pendidikan Agama Kristen dan Budi Pekerti",
        "Pendidikan Agama Katolik dan Budi Pekerti",
        "Pendidikan Agama Hindu dan Budi Pekerti",
        "Pendidikan Agama Buddha dan Budi Pekerti",
        "Pendidikan Agama Khonghucu dan Budi Pekerti",
        "Fisika",
        "Kimia",
        "Biologi",
        "Sosiologi",
        "Ekonomi",
        "Geografi",
        "Sejarah",
        "Bahasa Inggris Tingkat Lanjut",
        "Bahasa Inggris",
        "Seni Musik",
        "Seni Rupa",
        "Seni Tari",
        "Seni Teater",
        "Pendidikan Jasmani, Olahraga, dan Kesehatan",
        "Informatika",
        "Bahasa Jepang",
        "Bahasa Mandarin",
        "Bahasa Jerman",
        "Bahasa Perancis",
        "Bahasa Arab",
        "Antropologi",
        "Prakarya dan Kewirausahaan"
    ]
};

// ========================================
// ELEMEN CP PER MATA PELAJARAN (GLOBAL)
// ========================================

export const ELEMEN_CP_BY_MAPEL: Record<string, string[]> = {
    // === PAUD ===
    "Bermain dan Belajar (Sentra)": ["Nilai Agama dan Moral", "Fisik Motorik", "Kognitif", "Bahasa", "Sosial Emosional", "Seni"],
    "Nilai Agama dan Budi Pekerti": ["Akhlak Beragama", "Akhlak Pribadi", "Akhlak kepada Sesama Manusia", "Akhlak kepada Alam", "Akhlak Bernegara"],
    "Jati Diri": ["Kesadaran Diri", "Pengaturan Diri", "Perilaku Prososial"],
    "Dasar Literasi dan STEAM": ["Literasi Dasar", "Numerasi Dasar", "Sains Dasar", "Teknologi Dasar", "Rekayasa Dasar", "Seni Dasar", "Matematika Dasar"],

    // === MATEMATIKA ===
    "Matematika": ["Bilangan", "Aljabar", "Pengukuran", "Geometri", "Analisis Data dan Peluang"],
    "Matematika Tingkat Lanjut": ["Bilangan dan Operasi Lanjut", "Aljabar dan Fungsi", "Geometri dan Trigonometri", "Kalkulus", "Statistika dan Peluang"],

    // === BAHASA INDONESIA ===
    "Bahasa Indonesia": ["Menyimak", "Membaca dan Memirsa", "Berbicara dan Mempresentasikan", "Menulis"],

    // === BAHASA INGGRIS ===
    "Bahasa Inggris": ["Menyimak (Listening)", "Membaca (Reading)", "Memirsa (Viewing)", "Berbicara (Speaking)", "Menulis (Writing)", "Mempresentasikan (Presenting)"],
    "Bahasa Inggris Tingkat Lanjut": ["Menyimak (Listening)", "Membaca (Reading)", "Memirsa (Viewing)", "Berbicara (Speaking)", "Menulis (Writing)", "Mempresentasikan (Presenting)"],

    // === IPAS (SD) ===
    "IPAS (Ilmu Pengetahuan Alam dan Sosial)": ["Pemahaman IPAS (Sains dan Sosial)", "Keterampilan Proses"],

    // === IPA (SMP/SMA) ===
    "Ilmu Pengetahuan Alam (IPA)": ["Pemahaman IPA", "Keterampilan Proses"],

    // === IPS (SMP) ===
    "Ilmu Pengetahuan Sosial (IPS)": ["Pemahaman Konsep", "Keterampilan Proses"],

    // === SAINS ===
    "Fisika": ["Pemahaman Fisika", "Keterampilan Proses"],
    "Kimia": ["Pemahaman Kimia", "Keterampilan Proses"],
    "Biologi": ["Pemahaman Biologi", "Keterampilan Proses"],

    // === PENDIDIKAN PANCASILA ===
    "Pendidikan Pancasila": ["Pancasila", "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945", "Bhinneka Tunggal Ika", "Negara Kesatuan Republik Indonesia"],

    // === PENDIDIKAN AGAMA ===
    "Pendidikan Agama Islam dan Budi Pekerti": ["Al-Quran dan Hadis", "Akidah", "Akhlak", "Fikih", "Sejarah Peradaban Islam"],
    "Pendidikan Agama Kristen dan Budi Pekerti": ["Allah Berkarya", "Manusia dan Nilai-nilai Kristiani", "Gereja dan Masyarakat Majemuk"],
    "Pendidikan Agama Katolik dan Budi Pekerti": ["Pribadi Peserta Didik", "Yesus Kristus", "Gereja", "Masyarakat"],
    "Pendidikan Agama Hindu dan Budi Pekerti": ["Kitab Suci Weda", "Tattwa", "Susila", "Upacara/Yadnya", "Sejarah"],
    "Pendidikan Agama Buddha dan Budi Pekerti": ["Sejarah", "Saddha (Keyakinan)", "Sila (Moralitas)", "Samadhi (Meditasi)", "Panna (Kebijaksanaan)"],
    "Pendidikan Agama Khonghucu dan Budi Pekerti": ["Sejarah Suci", "Kitab Suci", "Tata Ibadah", "Perilaku Junzi", "Tata Laksana Agama"],

    // === SENI ===
    "Seni Musik": ["Mengalami (Experiencing)", "Merefleksikan (Reflecting)", "Berpikir dan Bekerja Artistik", "Menciptakan (Creating)", "Berdampak (Impacting)"],
    "Seni Rupa": ["Mengalami (Experiencing)", "Merefleksikan (Reflecting)", "Berpikir dan Bekerja Artistik", "Menciptakan (Creating)", "Berdampak (Impacting)"],
    "Seni Tari": ["Mengalami (Experiencing)", "Merefleksikan (Reflecting)", "Berpikir dan Bekerja Artistik", "Menciptakan (Creating)", "Berdampak (Impacting)"],
    "Seni Teater": ["Mengalami (Experiencing)", "Merefleksikan (Reflecting)", "Berpikir dan Bekerja Artistik", "Menciptakan (Creating)", "Berdampak (Impacting)"],

    // === PJOK ===
    "Pendidikan Jasmani, Olahraga, dan Kesehatan": ["Keterampilan Gerak", "Pengetahuan Gerak", "Pengembangan Karakter dan Internalisasi Nilai-Nilai Gerak"],

    // === INFORMATIKA ===
    "Informatika": ["Berpikir Komputasional", "TIK", "Sistem Komputer", "Jaringan Komputer", "Analisis Data", "Algoritma dan Pemrograman", "Dampak Sosial Informatika", "Praktik Lintas Bidang"],

    // === SOSIAL ===
    "Sosiologi": ["Pemahaman Konsep", "Keterampilan Proses"],
    "Ekonomi": ["Pemahaman Konsep", "Keterampilan Proses"],
    "Geografi": ["Pemahaman Konsep", "Keterampilan Proses"],
    "Sejarah": ["Pemahaman Konsep", "Keterampilan Proses", "Kesadaran Sejarah"],
    "Antropologi": ["Pemahaman Budaya", "Keterampilan Proses"],

    // === PRAKARYA ===
    "Prakarya (Kerajinan)": ["Observasi dan Eksplorasi", "Desain/Perencanaan", "Produksi", "Refleksi dan Evaluasi"],
    "Prakarya (Rekayasa)": ["Observasi dan Eksplorasi", "Desain/Perencanaan", "Produksi", "Refleksi dan Evaluasi"],
    "Prakarya (Budidaya)": ["Observasi dan Eksplorasi", "Desain/Perencanaan", "Produksi", "Refleksi dan Evaluasi"],
    "Prakarya (Pengolahan)": ["Observasi dan Eksplorasi", "Desain/Perencanaan", "Produksi", "Refleksi dan Evaluasi"],
    "Prakarya dan Kewirausahaan": ["Observasi dan Eksplorasi", "Desain/Perencanaan", "Produksi", "Pemasaran", "Refleksi dan Evaluasi"]
};

// ========================================
// ELEMEN CP SPECIFIC PER FASE (OVERRIDES)
// ========================================
const ELEMEN_CP_FASE_SPECIFIC: Record<string, string[]> = {
    // Only define overrides if necessary. Currently most match global.
    // Examples of potential overrides:
    // "Fase A:Matematika": ["Bilangan", "Aljabar", "Pengukuran", "Geometri"] // If we want to hide Analisis Data
};

// ========================================
// HELPER FUNCTIONS
// ========================================

export const getMataPelajaranByFase = (fase: Fase | undefined): string[] => {
    if (!fase) return [];
    return MATA_PELAJARAN_BY_FASE[fase] || [];
};

export const getElemenCPByMapel = (mataPelajaran: string | undefined): string[] => {
    if (!mataPelajaran) return [];
    return ELEMEN_CP_BY_MAPEL[mataPelajaran] || [];
};

export const getElemenCPByFaseAndMapel = (fase: Fase | undefined, mataPelajaran: string | undefined): string[] => {
    if (!fase || !mataPelajaran) return [];

    // Check for specific override first
    const key = `${fase}:${mataPelajaran}`;
    if (ELEMEN_CP_FASE_SPECIFIC[key]) {
        return ELEMEN_CP_FASE_SPECIFIC[key];
    }

    return ELEMEN_CP_BY_MAPEL[mataPelajaran] || [];
};

export const isMapelAvailableInFase = (fase: Fase, mataPelajaran: string): boolean => {
    const mapelList = MATA_PELAJARAN_BY_FASE[fase] || [];
    return mapelList.includes(mataPelajaran);
};

// ========================================
// MATERI/TOPIK PER ELEMEN CP
// ========================================

export const MATERI_BY_ELEMEN: Record<string, Record<string, string[]>> = {
    "Matematika": {
        "Bilangan": ["Bilangan Cacah", "Bilangan Bulat", "Pecahan", "Desimal", "Bilangan Berpangkat", "Akar", "Notasi Ilmiah"],
        "Aljabar": ["Pola Bilangan", "Bentuk Aljabar", "Persamaan Linear", "Pertidaksamaan Linear", "Sistem Persamaan Linear", "Fungsi", "Persamaan Kuadrat"],
        "Pengukuran": ["Satuan Panjang & Berat", "Waktu", "Keliling & Luas", "Volume & Luas Permukaan", "Sudut"],
        "Geometri": ["Bangun Datar", "Bangun Ruang", "Transformasi Geometri", "Kesebangunan", "Pythagoras", "Trigonometri"],
        "Analisis Data dan Peluang": ["Penyajian Data", "Ukuran Pemusatan", "Ukuran Penyebaran", "Peluang"]
    },
    "Bahasa Indonesia": {
        "Menyimak": ["Menyimak Cerita", "Menyimak Informasi", "Menyimak Puisi"],
        "Membaca dan Memirsa": ["Membaca Nyaring", "Membaca Pemahaman", "Memirsa Gambar/Video"],
        "Berbicara dan Mempresentasikan": ["Bercerita", "Diskusi", "Presentasi", "Pidato"],
        "Menulis": ["Menulis Huruf/Kata", "Menulis Kalimat", "Menulis Paragraf", "Menulis Karangan"]
    }
    // Add others as needed... defaults to empty array if not found
};

export const getMateriByElemen = (mataPelajaran: string | undefined, elemen: string | undefined): string[] => {
    if (!mataPelajaran || !elemen) return [];
    const mapelData = MATERI_BY_ELEMEN[mataPelajaran];
    if (!mapelData) return [];
    return mapelData[elemen] || [];
};
