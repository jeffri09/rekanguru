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
        "IPAS (Ilmu Pengetahuan Alam dan Sosial)",
        "Seni Musik",
        "Seni Rupa",
        "Seni Tari",
        "Seni Teater",
        "Pendidikan Jasmani, Olahraga, dan Kesehatan"
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
        "Informatika"
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
        "Sejarah Indonesia",
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
        "Sejarah Indonesia",
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
// ELEMEN CP PER MATA PELAJARAN
// Berdasarkan Kurikulum Merdeka & 8 Profil Lulusan Deep Learning
// ========================================

export const ELEMEN_CP_BY_MAPEL: Record<string, string[]> = {
    // === PAUD ===
    "Bermain dan Belajar (Sentra)": [
        "Nilai Agama dan Moral",
        "Fisik Motorik",
        "Kognitif",
        "Bahasa",
        "Sosial Emosional",
        "Seni"
    ],
    "Nilai Agama dan Budi Pekerti": [
        "Akhlak Beragama",
        "Akhlak Pribadi",
        "Akhlak kepada Sesama Manusia",
        "Akhlak kepada Alam",
        "Akhlak Bernegara"
    ],
    "Jati Diri": [
        "Kesadaran Diri",
        "Pengaturan Diri",
        "Perilaku Prososial"
    ],
    "Dasar Literasi dan STEAM": [
        "Literasi Dasar",
        "Numerasi Dasar",
        "Sains Dasar",
        "Teknologi Dasar",
        "Rekayasa Dasar",
        "Seni Dasar",
        "Matematika Dasar"
    ],

    // === MATEMATIKA ===
    "Matematika": [
        "Bilangan",
        "Aljabar",
        "Pengukuran",
        "Geometri",
        "Analisis Data dan Peluang"
    ],
    "Matematika Tingkat Lanjut": [
        "Bilangan dan Operasi Lanjut",
        "Aljabar dan Fungsi",
        "Geometri dan Trigonometri",
        "Kalkulus",
        "Statistika dan Peluang"
    ],

    // === BAHASA INDONESIA ===
    "Bahasa Indonesia": [
        "Menyimak",
        "Membaca dan Memirsa",
        "Berbicara dan Mempresentasikan",
        "Menulis"
    ],

    // === BAHASA INGGRIS ===
    "Bahasa Inggris": [
        "Menyimak (Listening)",
        "Membaca (Reading)",
        "Memirsa (Viewing)",
        "Berbicara (Speaking)",
        "Menulis (Writing)",
        "Mempresentasikan (Presenting)"
    ],
    "Bahasa Inggris Tingkat Lanjut": [
        "Menyimak (Listening)",
        "Membaca (Reading)",
        "Memirsa (Viewing)",
        "Berbicara (Speaking)",
        "Menulis (Writing)",
        "Mempresentasikan (Presenting)"
    ],

    // === IPAS (SD) ===
    "IPAS (Ilmu Pengetahuan Alam dan Sosial)": [
        "Pemahaman IPAS (Sains dan Sosial)",
        "Keterampilan Proses"
    ],

    // === IPA (SMP/SMA) ===
    "Ilmu Pengetahuan Alam (IPA)": [
        "Pemahaman IPA",
        "Keterampilan Proses"
    ],

    // === IPS (SMP) ===
    "Ilmu Pengetahuan Sosial (IPS)": [
        "Pemahaman Konsep",
        "Keterampilan Proses"
    ],

    // === FISIKA ===
    "Fisika": [
        "Pemahaman Fisika",
        "Keterampilan Proses (Mengamati, Mempertanyakan, Memprediksi, Merencanakan, Melakukan Percobaan, Mengolah Data, Mengomunikasikan)"
    ],

    // === KIMIA ===
    "Kimia": [
        "Pemahaman Kimia",
        "Keterampilan Proses"
    ],

    // === BIOLOGI ===
    "Biologi": [
        "Pemahaman Biologi",
        "Keterampilan Proses"
    ],

    // === PENDIDIKAN PANCASILA ===
    "Pendidikan Pancasila": [
        "Pancasila",
        "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
        "Bhinneka Tunggal Ika",
        "Negara Kesatuan Republik Indonesia"
    ],

    // === PENDIDIKAN AGAMA ===
    "Pendidikan Agama Islam dan Budi Pekerti": [
        "Al-Quran dan Hadis",
        "Akidah",
        "Akhlak",
        "Fikih",
        "Sejarah Peradaban Islam"
    ],
    "Pendidikan Agama Kristen dan Budi Pekerti": [
        "Allah Berkarya",
        "Manusia dan Nilai-nilai Kristiani",
        "Gereja dan Masyarakat Majemuk"
    ],
    "Pendidikan Agama Katolik dan Budi Pekerti": [
        "Pribadi Peserta Didik",
        "Yesus Kristus",
        "Gereja",
        "Masyarakat"
    ],
    "Pendidikan Agama Hindu dan Budi Pekerti": [
        "Kitab Suci Weda",
        "Tattwa",
        "Susila",
        "Upacara/Yadnya",
        "Sejarah"
    ],
    "Pendidikan Agama Buddha dan Budi Pekerti": [
        "Sejarah",
        "Saddha (Keyakinan)",
        "Sila (Moralitas)",
        "Samadhi (Meditasi)",
        "Panna (Kebijaksanaan)"
    ],
    "Pendidikan Agama Khonghucu dan Budi Pekerti": [
        "Sejarah Suci",
        "Kitab Suci",
        "Tata Ibadah",
        "Perilaku Junzi",
        "Tata Laksana Agama"
    ],

    // === SENI ===
    "Seni Musik": [
        "Mengalami (Experiencing)",
        "Merefleksikan (Reflecting)",
        "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        "Menciptakan (Creating)",
        "Berdampak (Impacting)"
    ],
    "Seni Rupa": [
        "Mengalami (Experiencing)",
        "Merefleksikan (Reflecting)",
        "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        "Menciptakan (Creating)",
        "Berdampak (Impacting)"
    ],
    "Seni Tari": [
        "Mengalami (Experiencing)",
        "Merefleksikan (Reflecting)",
        "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        "Menciptakan (Creating)",
        "Berdampak (Impacting)"
    ],
    "Seni Teater": [
        "Mengalami (Experiencing)",
        "Merefleksikan (Reflecting)",
        "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)",
        "Menciptakan (Creating)",
        "Berdampak (Impacting)"
    ],

    // === PJOK ===
    "Pendidikan Jasmani, Olahraga, dan Kesehatan": [
        "Keterampilan Gerak",
        "Pengetahuan Gerak",
        "Pengembangan Karakter dan Internalisasi Nilai-Nilai Gerak"
    ],

    // === INFORMATIKA ===
    "Informatika": [
        "Berpikir Komputasional (Computational Thinking)",
        "Teknologi Informasi dan Komunikasi",
        "Sistem Komputer",
        "Jaringan Komputer dan Internet",
        "Analisis Data",
        "Algoritma dan Pemrograman",
        "Dampak Sosial Informatika",
        "Praktik Lintas Bidang"
    ],

    // === IPS (Terpisah SMA) ===
    "Sosiologi": [
        "Pemahaman Konsep",
        "Keterampilan Proses"
    ],
    "Ekonomi": [
        "Pemahaman Konsep",
        "Keterampilan Proses"
    ],
    "Geografi": [
        "Pemahaman Konsep",
        "Keterampilan Proses"
    ],
    "Sejarah": [
        "Pemahaman Konsep",
        "Keterampilan Proses",
        "Kesadaran Sejarah"
    ],
    "Sejarah Indonesia": [
        "Pemahaman Konsep",
        "Keterampilan Proses",
        "Kesadaran Sejarah"
    ],
    "Antropologi": [
        "Pemahaman Budaya",
        "Keterampilan Proses"
    ],

    // === PRAKARYA ===
    "Prakarya (Kerajinan)": [
        "Observasi dan Eksplorasi",
        "Desain/Perencanaan",
        "Produksi",
        "Refleksi dan Evaluasi"
    ],
    "Prakarya (Rekayasa)": [
        "Observasi dan Eksplorasi",
        "Desain/Perencanaan",
        "Produksi",
        "Refleksi dan Evaluasi"
    ],
    "Prakarya (Budidaya)": [
        "Observasi dan Eksplorasi",
        "Desain/Perencanaan",
        "Produksi",
        "Refleksi dan Evaluasi"
    ],
    "Prakarya (Pengolahan)": [
        "Observasi dan Eksplorasi",
        "Desain/Perencanaan",
        "Produksi",
        "Refleksi dan Evaluasi"
    ],
    "Prakarya dan Kewirausahaan": [
        "Observasi dan Eksplorasi",
        "Desain/Perencanaan",
        "Produksi",
        "Pemasaran",
        "Refleksi dan Evaluasi"
    ],

    // === BAHASA ASING LAINNYA ===
    "Bahasa Jepang": [
        "Menyimak",
        "Membaca",
        "Berbicara",
        "Menulis"
    ],
    "Bahasa Mandarin": [
        "Menyimak",
        "Membaca",
        "Berbicara",
        "Menulis"
    ],
    "Bahasa Jerman": [
        "Menyimak",
        "Membaca",
        "Berbicara",
        "Menulis"
    ],
    "Bahasa Perancis": [
        "Menyimak",
        "Membaca",
        "Berbicara",
        "Menulis"
    ],
    "Bahasa Arab": [
        "Menyimak",
        "Membaca",
        "Berbicara",
        "Menulis"
    ],

    // === MUATAN LOKAL ===
    "Bahasa Jawa": [
        "Menyimak",
        "Membaca",
        "Berbicara",
        "Menulis",
        "Apresiasi Sastra Jawa"
    ],
    "Bahasa Sunda": [
        "Menyimak",
        "Membaca",
        "Berbicara",
        "Menulis",
        "Apresiasi Sastra Sunda"
    ],
    "Muatan Lokal": [
        "Sesuai Kurikulum Daerah"
    ]
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get mata pelajaran options based on selected Fase
 */
export const getMataPelajaranByFase = (fase: Fase | undefined): string[] => {
    if (!fase) return [];
    return MATA_PELAJARAN_BY_FASE[fase] || [];
};

/**
 * Get elemen CP options based on selected mata pelajaran
 * @deprecated Use getElemenCPByFaseAndMapel for phase-specific CP
 */
export const getElemenCPByMapel = (mataPelajaran: string | undefined): string[] => {
    if (!mataPelajaran) return [];
    return ELEMEN_CP_BY_MAPEL[mataPelajaran] || [];
};

/**
 * Get elemen CP options based on BOTH Fase AND mata pelajaran
 * This ensures CP is appropriate for the grade level
 * Falls back to generic CP if phase-specific not available
 */
export const getElemenCPByFaseAndMapel = (
    fase: Fase | undefined,
    mataPelajaran: string | undefined
): string[] => {
    if (!fase || !mataPelajaran) return [];

    // For now, use the existing mapel-based data
    // CP structure is already appropriate per mapel based on Kurikulum Merdeka
    // The mapping Fase → Mapel already ensures correct subjects per grade
    return ELEMEN_CP_BY_MAPEL[mataPelajaran] || [];
};

/**
 * Check if a mata pelajaran is available in a specific fase
 */
export const isMapelAvailableInFase = (fase: Fase, mataPelajaran: string): boolean => {
    const mapelList = MATA_PELAJARAN_BY_FASE[fase] || [];
    return mapelList.includes(mataPelajaran);
};

// ========================================
// MATERI/TOPIK PER ELEMEN CP
// Berdasarkan Kurikulum Merdeka 2025
// ========================================

export const MATERI_BY_ELEMEN: Record<string, Record<string, string[]>> = {
    // === MATEMATIKA ===
    "Matematika": {
        "Bilangan": [
            "Bilangan Cacah dan Operasinya",
            "Bilangan Bulat dan Operasinya",
            "Pecahan dan Operasinya",
            "Bilangan Desimal",
            "Bilangan Berpangkat dan Akar",
            "Bilangan Rasional dan Irasional",
            "Notasi Ilmiah"
        ],
        "Aljabar": [
            "Pola Bilangan dan Barisan",
            "Bentuk Aljabar",
            "Persamaan Linear Satu Variabel",
            "Pertidaksamaan Linear",
            "Sistem Persamaan Linear Dua Variabel",
            "Fungsi dan Grafiknya",
            "Persamaan Kuadrat"
        ],
        "Pengukuran": [
            "Satuan Panjang, Berat, dan Waktu",
            "Keliling dan Luas Bangun Datar",
            "Volume dan Luas Permukaan Bangun Ruang",
            "Pengukuran Sudut"
        ],
        "Geometri": [
            "Bangun Datar (Segitiga, Segiempat, Lingkaran)",
            "Bangun Ruang (Kubus, Balok, Prisma, Limas)",
            "Transformasi Geometri",
            "Kesebangunan dan Kekongruenan",
            "Teorema Pythagoras",
            "Trigonometri Dasar"
        ],
        "Analisis Data dan Peluang": [
            "Penyajian Data (Tabel, Diagram)",
            "Ukuran Pemusatan Data (Mean, Median, Modus)",
            "Ukuran Penyebaran Data",
            "Peluang Kejadian",
            "Frekuensi Harapan"
        ]
    },

    // === BAHASA INDONESIA ===
    "Bahasa Indonesia": {
        "Menyimak": [
            "Menyimak Teks Deskripsi",
            "Menyimak Teks Narasi",
            "Menyimak Teks Prosedur",
            "Menyimak Teks Eksposisi",
            "Menyimak Teks Argumentasi",
            "Menyimak Berita dan Informasi"
        ],
        "Membaca dan Memirsa": [
            "Membaca Teks Fiksi (Cerpen, Novel)",
            "Membaca Teks Nonfiksi",
            "Membaca Kritis dan Analitis",
            "Memirsa Video dan Media Visual",
            "Literasi Digital"
        ],
        "Berbicara dan Mempresentasikan": [
            "Presentasi Lisan",
            "Diskusi dan Debat",
            "Pidato dan Ceramah",
            "Bercerita dan Mendongeng"
        ],
        "Menulis": [
            "Menulis Teks Deskripsi",
            "Menulis Teks Narasi",
            "Menulis Teks Eksposisi",
            "Menulis Teks Argumentasi",
            "Menulis Teks Persuasi",
            "Menulis Laporan",
            "Menulis Puisi dan Cerpen"
        ]
    },

    // === BIOLOGI ===
    "Biologi": {
        "Pemahaman Biologi": [
            "Struktur dan Fungsi Sel",
            "Transport Membran (Difusi, Osmosis)",
            "Pembelahan Sel (Mitosis dan Meiosis)",
            "Metabolisme Sel dan Enzim",
            "Sistem Reproduksi Manusia",
            "Sistem Peredaran Darah",
            "Sistem Pencernaan Makanan",
            "Sistem Pernapasan",
            "Sistem Ekskresi",
            "Sistem Koordinasi (Saraf dan Hormon)",
            "Genetika dan Hereditas",
            "Pertumbuhan dan Perkembangan",
            "Evolusi dan Biodiversitas",
            "Bioteknologi Modern"
        ],
        "Keterampilan Proses": [
            "Praktikum Pengamatan Sel",
            "Praktikum Osmosis dan Difusi",
            "Praktikum Enzim Katalase",
            "Praktikum Fotosintesis",
            "Proyek Penelitian Biologi"
        ]
    },

    // === FISIKA ===
    "Fisika": {
        "Pemahaman Fisika": [
            "Besaran dan Satuan",
            "Kinematika Gerak Lurus",
            "Dinamika Partikel (Hukum Newton)",
            "Usaha dan Energi",
            "Momentum dan Impuls",
            "Gerak Melingkar",
            "Gravitasi Newton",
            "Elastisitas dan Hukum Hooke",
            "Fluida Statis dan Dinamis",
            "Suhu dan Kalor",
            "Gelombang dan Bunyi",
            "Optika Geometri",
            "Listrik Statis dan Dinamis",
            "Kemagnetan dan Induksi Elektromagnetik",
            "Fisika Modern (Relativitas, Kuantum)"
        ],
        "Keterampilan Proses (Mengamati, Mempertanyakan, Memprediksi, Merencanakan, Melakukan Percobaan, Mengolah Data, Mengomunikasikan)": [
            "Praktikum Gerak Lurus Beraturan",
            "Praktikum Hukum Newton",
            "Praktikum Bandul Sederhana",
            "Praktikum Rangkaian Listrik",
            "Proyek Penelitian Fisika"
        ]
    },

    // === KIMIA ===
    "Kimia": {
        "Pemahaman Kimia": [
            "Struktur Atom dan Sistem Periodik",
            "Ikatan Kimia",
            "Stoikiometri",
            "Larutan dan Konsentrasi",
            "Termokimia",
            "Laju Reaksi",
            "Kesetimbangan Kimia",
            "Asam dan Basa",
            "Hidrolisis Garam",
            "Larutan Penyangga",
            "Elektrokimia",
            "Kimia Organik",
            "Polimer dan Makromolekul"
        ],
        "Keterampilan Proses": [
            "Praktikum Reaksi Kimia",
            "Praktikum Titrasi Asam Basa",
            "Praktikum Laju Reaksi",
            "Praktikum Elektrolisis",
            "Proyek Penelitian Kimia"
        ]
    },

    // === IPA (SMP) ===
    "Ilmu Pengetahuan Alam (IPA)": {
        "Pemahaman IPA": [
            "Zat dan Karakteristiknya",
            "Suhu dan Kalor",
            "Gerak dan Gaya",
            "Usaha dan Energi",
            "Getaran dan Gelombang",
            "Bunyi dan Cahaya",
            "Listrik dan Magnet",
            "Sistem Organisasi Kehidupan",
            "Ekosistem dan Lingkungan",
            "Pemanasan Global",
            "Tata Surya dan Jagat Raya"
        ],
        "Keterampilan Proses": [
            "Praktikum Pengukuran",
            "Praktikum Kalor dan Perubahan Wujud",
            "Praktikum Rangkaian Listrik Sederhana",
            "Proyek Lingkungan"
        ]
    },

    // === IPAS (SD) ===
    "IPAS (Ilmu Pengetahuan Alam dan Sosial)": {
        "Pemahaman IPAS (Sains dan Sosial)": [
            "Tubuh Manusia dan Perawatannya",
            "Tumbuhan dan Hewan di Sekitarku",
            "Gaya dan Gerak",
            "Energi dan Perubahannya",
            "Bumi dan Alam Semesta",
            "Cuaca dan Iklim",
            "Sumber Daya Alam",
            "Keluarga dan Lingkungan Sosial",
            "Keragaman Budaya Indonesia",
            "Tokoh dan Peristiwa Sejarah"
        ],
        "Keterampilan Proses": [
            "Pengamatan Lingkungan Sekitar",
            "Percobaan Sederhana",
            "Proyek Keragaman Budaya"
        ]
    },

    // === PENDIDIKAN PANCASILA ===
    "Pendidikan Pancasila": {
        "Pancasila": [
            "Nilai-nilai Pancasila dalam Kehidupan",
            "Penerapan Sila-sila Pancasila",
            "Pancasila sebagai Dasar Negara",
            "Pancasila sebagai Pandangan Hidup"
        ],
        "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945": [
            "Pembukaan UUD 1945",
            "Hak dan Kewajiban Warga Negara",
            "Lembaga Negara",
            "Hubungan Pemerintah Pusat dan Daerah"
        ],
        "Bhinneka Tunggal Ika": [
            "Keragaman Suku, Agama, Ras, dan Budaya",
            "Toleransi dan Menghargai Perbedaan",
            "Persatuan dalam Keragaman"
        ],
        "Negara Kesatuan Republik Indonesia": [
            "Wilayah NKRI",
            "Pertahanan dan Keamanan Negara",
            "Wawasan Nusantara",
            "Cinta Tanah Air"
        ]
    },

    // === INFORMATIKA ===
    "Informatika": {
        "Berpikir Komputasional (Computational Thinking)": [
            "Dekomposisi Masalah",
            "Pengenalan Pola",
            "Abstraksi",
            "Algoritma dan Logika"
        ],
        "Teknologi Informasi dan Komunikasi": [
            "Perangkat Keras dan Lunak",
            "Pengolah Kata dan Spreadsheet",
            "Presentasi Digital",
            "Internet dan Keamanan Digital"
        ],
        "Sistem Komputer": [
            "Arsitektur Komputer",
            "Sistem Operasi",
            "Representasi Data"
        ],
        "Jaringan Komputer dan Internet": [
            "Topologi Jaringan",
            "Protokol Komunikasi",
            "World Wide Web"
        ],
        "Analisis Data": [
            "Pengumpulan Data",
            "Visualisasi Data",
            "Interpretasi Data"
        ],
        "Algoritma dan Pemrograman": [
            "Dasar Pemrograman",
            "Struktur Data Sederhana",
            "Pemrograman Visual",
            "Pengembangan Aplikasi Sederhana"
        ],
        "Dampak Sosial Informatika": [
            "Etika Digital",
            "Hak Kekayaan Intelektual",
            "Dampak Media Sosial",
            "Privasi dan Keamanan Data"
        ],
        "Praktik Lintas Bidang": [
            "Proyek Interdisipliner",
            "Kolaborasi Digital"
        ]
    },

    // === PENDIDIKAN AGAMA ISLAM ===
    "Pendidikan Agama Islam dan Budi Pekerti": {
        "Al-Quran dan Hadis": [
            "Membaca dan Menghafal Al-Quran",
            "Tajwid dan Tahsin",
            "Memahami Kandungan Ayat",
            "Hadis Pilihan"
        ],
        "Akidah": [
            "Iman kepada Allah",
            "Iman kepada Malaikat",
            "Iman kepada Kitab-kitab Allah",
            "Iman kepada Rasul",
            "Iman kepada Hari Akhir",
            "Iman kepada Qada dan Qadar"
        ],
        "Akhlak": [
            "Akhlak Terpuji",
            "Akhlak Tercela",
            "Adab dalam Islam"
        ],
        "Fikih": [
            "Thaharah (Bersuci)",
            "Shalat Wajib dan Sunnah",
            "Puasa",
            "Zakat dan Infak",
            "Haji dan Umrah",
            "Muamalah"
        ],
        "Sejarah Peradaban Islam": [
            "Sejarah Nabi Muhammad SAW",
            "Khulafaur Rasyidin",
            "Perkembangan Islam di Indonesia"
        ]
    },

    // === SENI (Generic for all Seni) ===
    "Seni Musik": {
        "Mengalami (Experiencing)": [
            "Mendengarkan Karya Musik",
            "Apresiasi Musik Nusantara",
            "Apresiasi Musik Mancanegara"
        ],
        "Merefleksikan (Reflecting)": [
            "Analisis Unsur Musik",
            "Kritik Karya Musik"
        ],
        "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)": [
            "Teknik Vokal",
            "Bermain Alat Musik",
            "Membaca Notasi"
        ],
        "Menciptakan (Creating)": [
            "Mengaransemen Lagu",
            "Menciptakan Lagu Sederhana"
        ],
        "Berdampak (Impacting)": [
            "Pentas Musik",
            "Kolaborasi Musik"
        ]
    },
    "Seni Rupa": {
        "Mengalami (Experiencing)": [
            "Apresiasi Karya Seni Rupa"
        ],
        "Merefleksikan (Reflecting)": [
            "Analisis Karya Seni Rupa"
        ],
        "Berpikir dan Bekerja Artistik (Thinking and Working Artistically)": [
            "Teknik Menggambar",
            "Teknik Melukis",
            "Teknik Membentuk"
        ],
        "Menciptakan (Creating)": [
            "Membuat Karya Seni Rupa 2D",
            "Membuat Karya Seni Rupa 3D"
        ],
        "Berdampak (Impacting)": [
            "Pameran Karya"
        ]
    },

    // === PJOK ===
    "Pendidikan Jasmani, Olahraga, dan Kesehatan": {
        "Keterampilan Gerak": [
            "Gerak Lokomotor",
            "Gerak Non-Lokomotor",
            "Gerak Manipulatif",
            "Permainan Bola Besar",
            "Permainan Bola Kecil",
            "Atletik",
            "Senam",
            "Renang",
            "Bela Diri"
        ],
        "Pengetahuan Gerak": [
            "Konsep Gerak",
            "Pola Gerak Dasar",
            "Kebugaran Jasmani"
        ],
        "Pengembangan Karakter dan Internalisasi Nilai-Nilai Gerak": [
            "Sportivitas",
            "Kerja Sama Tim",
            "Disiplin",
            "Pola Hidup Sehat"
        ]
    }
};

/**
 * Get materi/topik options based on mata pelajaran and elemen CP
 */
export const getMateriByElemen = (
    mataPelajaran: string | undefined,
    elemen: string | undefined
): string[] => {
    if (!mataPelajaran || !elemen) return [];

    const mapelData = MATERI_BY_ELEMEN[mataPelajaran];
    if (!mapelData) return [];

    return mapelData[elemen] || [];
};
