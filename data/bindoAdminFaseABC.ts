/**
 * Bahasa Indonesia Administrative Content - Fase A, B, C (SD)
 * Complete Materials for All Document Types: TP, ATP, KKTP, Prota, Promes
 */

// ============ INTERFACES ============
export interface TujuanPembelajaran {
    kode: string;
    tujuan: string;
    indikator: string[];
    alokasi: string;
    profilPelajar: string[];
}

export interface KriteriaTercapaian {
    tpKode: string;
    kriteria: string[];
    teknikAsesmen: string[];
    bentukInstrumen: string[];
}

export interface MateriProta {
    semester: number;
    bulan: string;
    minggu: number;
    materi: string;
    alokasi: string;
    keterangan: string;
}

export interface MateriPromes {
    minggu: number;
    materi: string;
    jp: number;
    keterangan: string;
}

export interface BahasaIndonesiaFaseContent {
    capaianPembelajaran: string;
    elemenCP: string[];
    tujuanPembelajaran: TujuanPembelajaran[];
    kktp: KriteriaTercapaian[];
    prota: MateriProta[];
    promes: { semester1: MateriPromes[]; semester2: MateriPromes[] };
    kegiatanPembelajaran: {
        pendahuluan: string[];
        inti: string[];
        penutup: string[];
    };
    rubrikPenilaian: {
        pengetahuan: string[][];
        keterampilan: string[][];
        sikap: string[][];
    };
}

// ============ FASE A (Kelas 1-2 SD) ============
export const BINDO_ADMIN_FASE_A: BahasaIndonesiaFaseContent = {
    capaianPembelajaran: "Peserta didik mampu menyimak, membaca, memirsa, berbicara, dan menulis untuk menceritakan kembali dan berbagi pengalaman. Peserta didik mampu mengenal dan menggunakan huruf, kata, dan kalimat sederhana dalam konteks keseharian.",
    elemenCP: ["Menyimak", "Membaca dan Memirsa", "Berbicara dan Mempresentasikan", "Menulis"],
    tujuanPembelajaran: [
        {
            kode: "TP.A.1",
            tujuan: "Mengenal huruf abjad dan bunyi yang dihasilkan",
            indikator: ["Menyebutkan huruf abjad A-Z", "Mengucapkan bunyi huruf dengan benar", "Menuliskan huruf abjad", "Membedakan huruf vokal dan konsonan"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.A.2",
            tujuan: "Membaca kata dan kalimat sederhana",
            indikator: ["Mengeja suku kata", "Membaca kata dengan lancar", "Membaca kalimat pendek", "Memahami makna kata sederhana"],
            alokasi: "16 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.A.3",
            tujuan: "Menulis huruf, kata, dan kalimat sederhana",
            indikator: ["Menulis huruf dengan benar", "Menulis kata dengan ejaan yang tepat", "Menulis kalimat sederhana", "Menggunakan huruf kapital di awal kalimat"],
            alokasi: "16 JP",
            profilPelajar: ["Kreatif", "Mandiri"]
        },
        {
            kode: "TP.A.4",
            tujuan: "Menyimak dan bercerita tentang pengalaman sehari-hari",
            indikator: ["Menyimak cerita dengan penuh perhatian", "Menjawab pertanyaan tentang cerita", "Menceritakan pengalaman dengan kalimat sederhana", "Bercerita di depan kelas"],
            alokasi: "12 JP",
            profilPelajar: ["Berkebinekaan Global", "Gotong Royong"]
        },
        {
            kode: "TP.A.5",
            tujuan: "Mengenal kosakata baru dalam konteks keseharian",
            indikator: ["Menyebutkan nama-nama benda di sekitar", "Mengenal kata kerja sehari-hari", "Mengenal kata sifat sederhana", "Menggunakan kosakata baru dalam kalimat"],
            alokasi: "10 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.A.1",
            kriteria: ["Menyebutkan huruf dengan benar", "Menuliskan huruf dengan rapi", "Membedakan huruf vokal dan konsonan"],
            teknikAsesmen: ["Tes Lisan", "Tes Tertulis", "Observasi"],
            bentukInstrumen: ["Kartu huruf", "Lembar kerja menulis", "Lembar observasi"]
        },
        {
            tpKode: "TP.A.2",
            kriteria: ["Mengeja dengan benar", "Membaca dengan lancar", "Memahami makna bacaan"],
            teknikAsesmen: ["Tes Lisan", "Praktik Membaca"],
            bentukInstrumen: ["Kartu kata", "Buku bacaan berjenjang"]
        },
        {
            tpKode: "TP.A.4",
            kriteria: ["Menyimak dengan fokus", "Bercerita dengan urutan yang benar", "Berbicara dengan suara jelas"],
            teknikAsesmen: ["Observasi", "Unjuk Kerja"],
            bentukInstrumen: ["Lembar observasi", "Rubrik bercerita"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Mengenal huruf vokal a, i, u, e, o", alokasi: "6 JP", keterangan: "Pengenalan" },
        { semester: 1, bulan: "Juli", minggu: 4, materi: "Mengenal huruf konsonan b, c, d, f, g", alokasi: "6 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 1, materi: "Mengenal huruf konsonan h, j, k, l, m", alokasi: "6 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 2, materi: "Mengenal huruf konsonan n, p, q, r, s", alokasi: "6 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 3, materi: "Mengenal huruf konsonan t, v, w, x, y, z", alokasi: "6 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 1, materi: "Membaca suku kata terbuka (ba-bi-bu)", alokasi: "8 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 3, materi: "Membaca suku kata tertutup (ban, bim)", alokasi: "8 JP", keterangan: "-" },
        { semester: 1, bulan: "Oktober", minggu: 1, materi: "Membaca kata sederhana", alokasi: "8 JP", keterangan: "-" },
        { semester: 1, bulan: "November", minggu: 1, materi: "Membaca kalimat pendek", alokasi: "8 JP", keterangan: "-" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "Menulis huruf dan kata", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Februari", minggu: 1, materi: "Menulis kalimat sederhana", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Maret", minggu: 1, materi: "Menyimak dan bercerita", alokasi: "10 JP", keterangan: "-" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "Orientasi dan pengenalan", jp: 4, keterangan: "MPLS" },
            { minggu: 2, materi: "Mengenal huruf vokal a-i-u", jp: 6, keterangan: "-" },
            { minggu: 3, materi: "Mengenal huruf vokal e-o", jp: 6, keterangan: "-" },
            { minggu: 4, materi: "Mengenal huruf konsonan b-c-d", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Mengenal huruf konsonan f-g-h-j", jp: 6, keterangan: "-" },
            { minggu: 6, materi: "Mengenal huruf konsonan k-l-m-n", jp: 6, keterangan: "-" },
            { minggu: 7, materi: "Mengenal huruf konsonan p-q-r-s", jp: 6, keterangan: "-" },
            { minggu: 8, materi: "Mengenal huruf konsonan t-v-w-x-y-z", jp: 6, keterangan: "-" },
            { minggu: 9, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 10, materi: "Membaca suku kata terbuka", jp: 8, keterangan: "-" },
            { minggu: 11, materi: "Membaca suku kata tertutup", jp: 8, keterangan: "-" },
            { minggu: 12, materi: "Membaca kata 2 suku kata", jp: 8, keterangan: "-" },
            { minggu: 13, materi: "Membaca kata 3 suku kata", jp: 8, keterangan: "-" },
            { minggu: 14, materi: "Membaca kalimat pendek", jp: 8, keterangan: "-" },
            { minggu: 15, materi: "Latihan membaca nyaring", jp: 6, keterangan: "-" },
            { minggu: 16, materi: "UAS", jp: 4, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review membaca", jp: 4, keterangan: "-" },
            { minggu: 2, materi: "Menulis huruf vokal", jp: 6, keterangan: "-" },
            { minggu: 3, materi: "Menulis huruf konsonan", jp: 6, keterangan: "-" },
            { minggu: 4, materi: "Menulis kata sederhana", jp: 8, keterangan: "-" },
            { minggu: 5, materi: "Menulis kalimat pendek", jp: 8, keterangan: "-" },
            { minggu: 6, materi: "Menggunakan huruf kapital", jp: 6, keterangan: "-" },
            { minggu: 7, materi: "Menggunakan tanda baca titik", jp: 6, keterangan: "-" },
            { minggu: 8, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 9, materi: "Menyimak cerita pendek", jp: 6, keterangan: "-" },
            { minggu: 10, materi: "Menjawab pertanyaan cerita", jp: 6, keterangan: "-" },
            { minggu: 11, materi: "Bercerita tentang diri sendiri", jp: 6, keterangan: "-" },
            { minggu: 12, materi: "Bercerita tentang keluarga", jp: 6, keterangan: "-" },
            { minggu: 13, materi: "Mengenal kosakata baru", jp: 6, keterangan: "-" },
            { minggu: 14, materi: "UAS", jp: 4, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Guru mengajak siswa berdoa bersama sebelum belajar",
            "Menyapa siswa dengan ramah dan mengecek kehadiran",
            "Bernyanyi lagu alfabet bersama-sama",
            "Guru menunjukkan kartu huruf atau gambar menarik",
            "Menyampaikan tujuan belajar hari ini dengan bahasa sederhana"
        ],
        inti: [
            "Guru menunjukkan kartu huruf satu per satu",
            "Siswa mengucapkan bunyi huruf bersama-sama",
            "Praktik menulis huruf di udara dengan jari",
            "Menulis huruf di buku tulis dengan bimbingan",
            "Membaca bersama buku cerita bergambar (big book)",
            "Bermain tebak kata dengan kartu gambar",
            "Siswa berlomba menyusun huruf menjadi kata",
            "Mendengarkan cerita dan menjawab pertanyaan"
        ],
        penutup: [
            "Menyimpulkan pelajaran dengan tanya jawab",
            "Bernyanyi lagu tentang huruf/kata yang dipelajari",
            "Memberikan penghargaan kepada siswa aktif",
            "Refleksi: huruf/kata apa yang dipelajari hari ini?",
            "Berdoa bersama sebelum pulang"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Belum Berkembang", "Belum mengenal huruf dengan benar"],
            ["Mulai Berkembang", "Mengenal sebagian huruf dengan bantuan"],
            ["Berkembang Sesuai Harapan", "Mengenal semua huruf dengan benar"],
            ["Sangat Berkembang", "Mengenal huruf dan membaca lancar"]
        ],
        keterampilan: [
            ["Belum Berkembang", "Belum mampu menulis huruf dengan benar"],
            ["Mulai Berkembang", "Menulis huruf dengan bantuan guru"],
            ["Berkembang Sesuai Harapan", "Menulis huruf dan kata dengan rapi"],
            ["Sangat Berkembang", "Menulis kalimat dengan rapi dan benar"]
        ],
        sikap: [
            ["Belum Berkembang", "Belum menunjukkan minat baca"],
            ["Mulai Berkembang", "Mulai tertarik dengan buku"],
            ["Berkembang Sesuai Harapan", "Senang membaca buku cerita"],
            ["Sangat Berkembang", "Gemar membaca dan menceritakan kembali"]
        ]
    }
};

// ============ FASE B (Kelas 3-4 SD) ============
export const BINDO_ADMIN_FASE_B: BahasaIndonesiaFaseContent = {
    capaianPembelajaran: "Peserta didik mampu menyimak, membaca, memirsa, berbicara, dan menulis untuk menggali dan mengolah informasi dari berbagai sumber. Peserta didik mampu memahami teks naratif, deskripsi, dan prosedur sederhana serta menulis dengan memperhatikan ejaan dan tanda baca.",
    elemenCP: ["Menyimak", "Membaca dan Memirsa", "Berbicara dan Mempresentasikan", "Menulis"],
    tujuanPembelajaran: [
        {
            kode: "TP.B.1",
            tujuan: "Memahami teks narasi dan menceritakan kembali isinya",
            indikator: ["Mengidentifikasi tokoh dan latar cerita", "Menentukan urutan peristiwa", "Menceritakan kembali dengan bahasa sendiri", "Menemukan amanat cerita"],
            alokasi: "14 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.B.2",
            tujuan: "Memahami teks deskripsi dan menulis paragraf deskripsi",
            indikator: ["Mengidentifikasi ciri-ciri teks deskripsi", "Menentukan objek yang dideskripsikan", "Menulis paragraf deskripsi sederhana", "Menggunakan kata sifat dalam deskripsi"],
            alokasi: "12 JP",
            profilPelajar: ["Kreatif", "Mandiri"]
        },
        {
            kode: "TP.B.3",
            tujuan: "Memahami dan menulis teks prosedur sederhana",
            indikator: ["Mengidentifikasi struktur teks prosedur", "Mengurutkan langkah-langkah", "Menulis teks prosedur sederhana", "Menggunakan kalimat perintah"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.B.4",
            tujuan: "Menentukan ide pokok dan kalimat penjelas paragraf",
            indikator: ["Menentukan ide pokok paragraf", "Mengidentifikasi kalimat penjelas", "Membedakan paragraf deduktif dan induktif", "Meringkas teks bacaan"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.B.5",
            tujuan: "Menulis surat pribadi dengan struktur yang benar",
            indikator: ["Mengidentifikasi bagian-bagian surat", "Menulis surat dengan struktur lengkap", "Menggunakan bahasa yang santun", "Menulis amplop dengan benar"],
            alokasi: "10 JP",
            profilPelajar: ["Berkebinekaan Global", "Gotong Royong"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.B.1",
            kriteria: ["Mengidentifikasi unsur cerita dengan benar", "Menceritakan kembali dengan urutan tepat", "Menemukan amanat dengan tepat"],
            teknikAsesmen: ["Tes Tertulis", "Unjuk Kerja"],
            bentukInstrumen: ["Soal pilihan ganda dan uraian", "Rubrik bercerita"]
        },
        {
            tpKode: "TP.B.4",
            kriteria: ["Menentukan ide pokok dengan tepat", "Meringkas dengan bahasa sendiri"],
            teknikAsesmen: ["Tes Tertulis", "Penugasan"],
            bentukInstrumen: ["Soal uraian", "Tugas meringkas"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Teks narasi: cerita anak", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 1, materi: "Unsur intrinsik cerita", alokasi: "8 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 3, materi: "Menceritakan kembali cerita", alokasi: "8 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 2, materi: "Teks deskripsi", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "Oktober", minggu: 1, materi: "Menulis paragraf deskripsi", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "November", minggu: 1, materi: "Ide pokok paragraf", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "Teks prosedur", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Februari", minggu: 1, materi: "Menulis teks prosedur", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Maret", minggu: 1, materi: "Surat pribadi", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "April", minggu: 1, materi: "Menulis surat pribadi", alokasi: "10 JP", keterangan: "-" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "Orientasi", jp: 4, keterangan: "MPLS" },
            { minggu: 2, materi: "Membaca cerita anak", jp: 6, keterangan: "-" },
            { minggu: 3, materi: "Tokoh dan penokohan", jp: 6, keterangan: "-" },
            { minggu: 4, materi: "Latar dan alur cerita", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Amanat cerita", jp: 6, keterangan: "-" },
            { minggu: 6, materi: "Menceritakan kembali", jp: 8, keterangan: "-" },
            { minggu: 7, materi: "Mengenal teks deskripsi", jp: 6, keterangan: "-" },
            { minggu: 8, materi: "Ciri-ciri teks deskripsi", jp: 6, keterangan: "-" },
            { minggu: 9, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 10, materi: "Menulis paragraf deskripsi", jp: 8, keterangan: "-" },
            { minggu: 11, materi: "Mengenal ide pokok", jp: 6, keterangan: "-" },
            { minggu: 12, materi: "Ide pokok dan penjelas", jp: 6, keterangan: "-" },
            { minggu: 13, materi: "Meringkas teks", jp: 8, keterangan: "-" },
            { minggu: 14, materi: "Review materi", jp: 6, keterangan: "-" },
            { minggu: 15, materi: "UAS", jp: 4, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review semester 1", jp: 4, keterangan: "-" },
            { minggu: 2, materi: "Mengenal teks prosedur", jp: 6, keterangan: "-" },
            { minggu: 3, materi: "Struktur teks prosedur", jp: 6, keterangan: "-" },
            { minggu: 4, materi: "Kalimat perintah", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Menulis teks prosedur", jp: 8, keterangan: "-" },
            { minggu: 6, materi: "Praktik teks prosedur", jp: 8, keterangan: "-" },
            { minggu: 7, materi: "Mengenal surat pribadi", jp: 6, keterangan: "-" },
            { minggu: 8, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 9, materi: "Bagian-bagian surat", jp: 6, keterangan: "-" },
            { minggu: 10, materi: "Menulis surat untuk teman", jp: 8, keterangan: "-" },
            { minggu: 11, materi: "Menulis surat untuk keluarga", jp: 8, keterangan: "-" },
            { minggu: 12, materi: "Menulis amplop", jp: 4, keterangan: "-" },
            { minggu: 13, materi: "Review materi", jp: 6, keterangan: "-" },
            { minggu: 14, materi: "UAS", jp: 4, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Guru membuka dengan salam dan doa",
            "Mengecek kehadiran dan kesiapan siswa",
            "Apersepsi: bertanya tentang pengalaman membaca cerita",
            "Menyampaikan tujuan dan manfaat pembelajaran"
        ],
        inti: [
            "Membaca bersama teks narasi dari buku",
            "Diskusi kelompok tentang unsur cerita",
            "Siswa mengidentifikasi tokoh, latar, dan alur",
            "Presentasi hasil diskusi kelompok",
            "Latihan menulis paragraf deskripsi",
            "Peer review tulisan teman",
            "Pembuatan peta konsep cerita",
            "Role play menceritakan kembali cerita"
        ],
        penutup: [
            "Menyimpulkan materi bersama",
            "Kuis singkat untuk mengecek pemahaman",
            "Refleksi: apa yang dipelajari hari ini?",
            "Penugasan rumah (menulis/membaca)",
            "Doa penutup"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Belum Berkembang", "Belum memahami struktur teks"],
            ["Mulai Berkembang", "Memahami sebagian struktur teks"],
            ["Berkembang Sesuai Harapan", "Memahami struktur teks dengan baik"],
            ["Sangat Berkembang", "Menganalisis dan membandingkan teks"]
        ],
        keterampilan: [
            ["Belum Berkembang", "Belum mampu menulis paragraf"],
            ["Mulai Berkembang", "Menulis paragraf dengan bantuan"],
            ["Berkembang Sesuai Harapan", "Menulis paragraf dengan baik"],
            ["Sangat Berkembang", "Menulis teks lengkap dengan kreatif"]
        ],
        sikap: [
            ["Belum Berkembang", "Belum menunjukkan ketertarikan"],
            ["Mulai Berkembang", "Mulai tertarik membaca"],
            ["Berkembang Sesuai Harapan", "Aktif dalam kegiatan literasi"],
            ["Sangat Berkembang", "Menjadi teladan literasi di kelas"]
        ]
    }
};

// ============ FASE C (Kelas 5-6 SD) ============
export const BINDO_ADMIN_FASE_C: BahasaIndonesiaFaseContent = {
    capaianPembelajaran: "Peserta didik mampu menyimak, membaca, memirsa, berbicara, dan menulis untuk menganalisis dan menginterpretasi informasi, gagasan, dan opini. Peserta didik memahami berbagai jenis teks (eksplanasi, eksposisi, argumentasi) dan menulis dengan memperhatikan struktur dan kebahasaan.",
    elemenCP: ["Menyimak", "Membaca dan Memirsa", "Berbicara dan Mempresentasikan", "Menulis"],
    tujuanPembelajaran: [
        {
            kode: "TP.C.1",
            tujuan: "Memahami teks eksplanasi dan mengidentifikasi strukturnya",
            indikator: ["Mengidentifikasi struktur teks eksplanasi", "Menentukan informasi penting", "Membedakan fakta dan opini", "Menulis teks eksplanasi sederhana"],
            alokasi: "14 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.C.2",
            tujuan: "Memahami teks eksposisi dan menyusun argumen",
            indikator: ["Mengidentifikasi tesis dan argumen", "Menentukan fakta pendukung", "Menyusun paragraf eksposisi", "Mempresentasikan argumen"],
            alokasi: "14 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.C.3",
            tujuan: "Menganalisis unsur intrinsik dan ekstrinsik karya sastra",
            indikator: ["Mengidentifikasi unsur intrinsik cerpen", "Menentukan nilai moral cerita", "Menganalisis gaya bahasa", "Membandingkan dua karya sastra"],
            alokasi: "14 JP",
            profilPelajar: ["Bernalar Kritis", "Berkebinekaan Global"]
        },
        {
            kode: "TP.C.4",
            tujuan: "Menulis dan menyunting teks dengan memperhatikan ejaan",
            indikator: ["Menulis dengan ejaan yang benar", "Menggunakan tanda baca dengan tepat", "Menyunting tulisan sendiri", "Menyunting tulisan teman (peer editing)"],
            alokasi: "12 JP",
            profilPelajar: ["Mandiri", "Gotong Royong"]
        },
        {
            kode: "TP.C.5",
            tujuan: "Membuat dan menyampaikan pidato persuasif",
            indikator: ["Menyusun kerangka pidato", "Menulis naskah pidato", "Menyampaikan pidato dengan percaya diri", "Menggunakan bahasa persuasif"],
            alokasi: "12 JP",
            profilPelajar: ["Kreatif", "Gotong Royong"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.C.1",
            kriteria: ["Mengidentifikasi struktur dengan benar", "Membedakan fakta dan opini", "Menulis eksplanasi dengan struktur lengkap"],
            teknikAsesmen: ["Tes Tertulis", "Penugasan"],
            bentukInstrumen: ["Soal pilihan ganda dan uraian", "Tugas menulis"]
        },
        {
            tpKode: "TP.C.3",
            kriteria: ["Menganalisis unsur intrinsik dengan tepat", "Menentukan nilai moral dengan benar"],
            teknikAsesmen: ["Tes Tertulis", "Diskusi"],
            bentukInstrumen: ["Soal analisis", "Rubrik diskusi"]
        },
        {
            tpKode: "TP.C.5",
            kriteria: ["Menyusun pidato dengan struktur lengkap", "Menyampaikan dengan percaya diri"],
            teknikAsesmen: ["Unjuk Kerja", "Penilaian Produk"],
            bentukInstrumen: ["Rubrik pidato", "Naskah pidato"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Teks eksplanasi", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 2, materi: "Struktur dan ciri kebahasaan eksplanasi", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 1, materi: "Teks eksposisi", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "Oktober", minggu: 1, materi: "Tesis dan argumen", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "November", minggu: 1, materi: "Cerpen dan unsur intrinsik", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "Majas dan gaya bahasa", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Februari", minggu: 1, materi: "Ejaan dan tanda baca", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Maret", minggu: 1, materi: "Menyunting tulisan", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "April", minggu: 1, materi: "Pidato persuasif", alokasi: "12 JP", keterangan: "-" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "Orientasi", jp: 4, keterangan: "MPLS" },
            { minggu: 2, materi: "Mengenal teks eksplanasi", jp: 6, keterangan: "-" },
            { minggu: 3, materi: "Struktur teks eksplanasi", jp: 6, keterangan: "-" },
            { minggu: 4, materi: "Ciri kebahasaan eksplanasi", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Menulis teks eksplanasi", jp: 8, keterangan: "-" },
            { minggu: 6, materi: "Mengenal teks eksposisi", jp: 6, keterangan: "-" },
            { minggu: 7, materi: "Tesis dan argumen", jp: 6, keterangan: "-" },
            { minggu: 8, materi: "Fakta pendukung argumen", jp: 6, keterangan: "-" },
            { minggu: 9, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 10, materi: "Menulis eksposisi", jp: 8, keterangan: "-" },
            { minggu: 11, materi: "Mengenal cerpen", jp: 6, keterangan: "-" },
            { minggu: 12, materi: "Unsur intrinsik cerpen", jp: 8, keterangan: "-" },
            { minggu: 13, materi: "Nilai moral cerpen", jp: 6, keterangan: "-" },
            { minggu: 14, materi: "Review materi", jp: 6, keterangan: "-" },
            { minggu: 15, materi: "UAS", jp: 4, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review semester 1", jp: 4, keterangan: "-" },
            { minggu: 2, materi: "Majas perbandingan", jp: 6, keterangan: "-" },
            { minggu: 3, materi: "Majas pertentangan", jp: 6, keterangan: "-" },
            { minggu: 4, materi: "Gaya bahasa dalam cerpen", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Ejaan bahasa Indonesia", jp: 6, keterangan: "-" },
            { minggu: 6, materi: "Penggunaan tanda baca", jp: 6, keterangan: "-" },
            { minggu: 7, materi: "Menyunting tulisan", jp: 8, keterangan: "-" },
            { minggu: 8, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 9, materi: "Mengenal pidato", jp: 6, keterangan: "-" },
            { minggu: 10, materi: "Struktur pidato", jp: 6, keterangan: "-" },
            { minggu: 11, materi: "Bahasa persuasif", jp: 6, keterangan: "-" },
            { minggu: 12, materi: "Menulis naskah pidato", jp: 8, keterangan: "-" },
            { minggu: 13, materi: "Praktik berpidato", jp: 8, keterangan: "-" },
            { minggu: 14, materi: "UAS", jp: 4, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Guru membuka dengan salam dan doa",
            "Memeriksa kehadiran dan kesiapan siswa",
            "Apersepsi: menghubungkan dengan materi sebelumnya",
            "Motivasi: menampilkan contoh teks yang menarik",
            "Menyampaikan tujuan dan indikator pembelajaran"
        ],
        inti: [
            "Mengamati contoh teks eksplanasi/eksposisi",
            "Diskusi kelompok menganalisis struktur teks",
            "Presentasi hasil analisis kelompok",
            "Konfirmasi dan penguatan dari guru",
            "Latihan mengidentifikasi fakta dan opini",
            "Menulis paragraf dengan struktur yang dipelajari",
            "Peer editing untuk saling menyunting tulisan",
            "Praktik berpidato di depan kelas"
        ],
        penutup: [
            "Menyimpulkan materi bersama siswa",
            "Kuis formatif untuk evaluasi",
            "Refleksi: apa yang sudah dikuasai?",
            "Penugasan menulis di rumah",
            "Doa penutup"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Belum Berkembang", "Belum memahami struktur teks lanjutan"],
            ["Mulai Berkembang", "Memahami sebagian struktur teks"],
            ["Berkembang Sesuai Harapan", "Memahami dan menganalisis teks"],
            ["Sangat Berkembang", "Mengkritisi dan membandingkan teks"]
        ],
        keterampilan: [
            ["Belum Berkembang", "Belum mampu menulis teks lengkap"],
            ["Mulai Berkembang", "Menulis teks dengan struktur sederhana"],
            ["Berkembang Sesuai Harapan", "Menulis teks dengan struktur lengkap"],
            ["Sangat Berkembang", "Menulis teks kreatif dan menyunting"]
        ],
        sikap: [
            ["Belum Berkembang", "Belum menunjukkan kerjasama"],
            ["Mulai Berkembang", "Mulai bekerja sama dalam kelompok"],
            ["Berkembang Sesuai Harapan", "Aktif bekerja sama dan menghargai"],
            ["Sangat Berkembang", "Memimpin diskusi dengan baik"]
        ]
    }
};

// Export helper
export function getBindoAdminByFase(fase: string): BahasaIndonesiaFaseContent {
    const f = fase.toUpperCase();
    if (f.includes('A') || f.includes('1') || f.includes('2')) return BINDO_ADMIN_FASE_A;
    if (f.includes('B') || f.includes('3') || f.includes('4')) return BINDO_ADMIN_FASE_B;
    if (f.includes('C') || f.includes('5') || f.includes('6')) return BINDO_ADMIN_FASE_C;
    return BINDO_ADMIN_FASE_C; // Default
}
