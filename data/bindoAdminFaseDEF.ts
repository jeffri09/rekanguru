/**
 * Bahasa Indonesia Administrative Content - Fase D, E, F (SMP-SMA)
 * Complete Materials for All Document Types: TP, ATP, KKTP, Prota, Promes
 */

import { BahasaIndonesiaFaseContent } from './bindoAdminFaseABC';

// ============ FASE D (Kelas 7-9 SMP) ============
export const BINDO_ADMIN_FASE_D: BahasaIndonesiaFaseContent = {
    capaianPembelajaran: "Peserta didik mampu menyimak, membaca, memirsa, berbicara, dan menulis untuk menganalisis, menginterpretasi, dan mengevaluasi teks dengan berbagai jenis (deskripsi, narasi, prosedur, eksplanasi, eksposisi, argumentasi). Peserta didik mampu mengapresiasi karya sastra dan menghasilkan teks multimodal.",
    elemenCP: ["Menyimak", "Membaca dan Memirsa", "Berbicara dan Mempresentasikan", "Menulis"],
    tujuanPembelajaran: [
        {
            kode: "TP.D.1",
            tujuan: "Menganalisis struktur dan kebahasaan teks deskripsi",
            indikator: ["Mengidentifikasi struktur teks deskripsi", "Menganalisis ciri kebahasaan teks deskripsi", "Menulis teks deskripsi dengan struktur lengkap", "Menyunting teks deskripsi"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.D.2",
            tujuan: "Menganalisis dan memproduksi teks prosedur kompleks",
            indikator: ["Menentukan struktur teks prosedur", "Mengidentifikasi ciri kebahasaan prosedur", "Menulis teks prosedur dengan langkah sistematis", "Mempresentasikan teks prosedur"],
            alokasi: "14 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.D.3",
            tujuan: "Memahami dan menulis teks laporan hasil observasi",
            indikator: ["Mengidentifikasi struktur LHO", "Menentukan objek observasi", "Melakukan observasi sederhana", "Menulis laporan hasil observasi"],
            alokasi: "16 JP",
            profilPelajar: ["Bernalar Kritis", "Gotong Royong"]
        },
        {
            kode: "TP.D.4",
            tujuan: "Menganalisis dan menulis teks persuasi",
            indikator: ["Mengidentifikasi struktur teks persuasi", "Menganalisis teknik persuasi", "Menulis teks persuasi (iklan, slogan, poster)", "Mempresentasikan teks persuasi"],
            alokasi: "14 JP",
            profilPelajar: ["Kreatif", "Gotong Royong"]
        },
        {
            kode: "TP.D.5",
            tujuan: "Mengapresiasi dan menulis cerpen/puisi",
            indikator: ["Menganalisis unsur intrinsik cerpen", "Menganalisis unsur intrinsik puisi", "Menulis cerpen sederhana", "Menulis puisi dan membacakannya"],
            alokasi: "16 JP",
            profilPelajar: ["Kreatif", "Berkebinekaan Global"]
        },
        {
            kode: "TP.D.6",
            tujuan: "Memahami dan memproduksi teks diskusi",
            indikator: ["Mengidentifikasi isu dalam teks diskusi", "Menentukan argumen pro dan kontra", "Menulis simpulan diskusi", "Melakukan diskusi kelompok"],
            alokasi: "14 JP",
            profilPelajar: ["Bernalar Kritis", "Gotong Royong"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.D.1",
            kriteria: ["Mengidentifikasi struktur dengan benar", "Menganalisis kebahasaan dengan tepat", "Menulis dengan struktur lengkap"],
            teknikAsesmen: ["Tes Tertulis", "Penilaian Produk"],
            bentukInstrumen: ["Soal uraian", "Rubrik tulisan"]
        },
        {
            tpKode: "TP.D.3",
            kriteria: ["Melakukan observasi dengan sistematis", "Menulis laporan dengan format benar", "Menyajikan data dengan jelas"],
            teknikAsesmen: ["Proyek", "Penilaian Produk"],
            bentukInstrumen: ["Rubrik proyek", "Rubrik laporan"]
        },
        {
            tpKode: "TP.D.5",
            kriteria: ["Menganalisis unsur intrinsik dengan tepat", "Menulis karya sastra dengan kreativitas"],
            teknikAsesmen: ["Tes Tertulis", "Portofolio"],
            bentukInstrumen: ["Soal analisis", "Kumpulan karya"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Teks deskripsi", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 2, materi: "Teks prosedur", alokasi: "14 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 2, materi: "Teks laporan hasil observasi", alokasi: "16 JP", keterangan: "-" },
        { semester: 1, bulan: "Oktober", minggu: 3, materi: "Puisi rakyat (pantun, gurindam, syair)", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "November", minggu: 2, materi: "Fabel dan legenda", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "Teks persuasi", alokasi: "14 JP", keterangan: "-" },
        { semester: 2, bulan: "Februari", minggu: 2, materi: "Teks diskusi", alokasi: "14 JP", keterangan: "-" },
        { semester: 2, bulan: "Maret", minggu: 2, materi: "Cerpen", alokasi: "14 JP", keterangan: "-" },
        { semester: 2, bulan: "April", minggu: 2, materi: "Drama", alokasi: "14 JP", keterangan: "-" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "MPLS", jp: 0, keterangan: "Orientasi" },
            { minggu: 2, materi: "Mengenal teks deskripsi", jp: 4, keterangan: "-" },
            { minggu: 3, materi: "Struktur teks deskripsi", jp: 4, keterangan: "-" },
            { minggu: 4, materi: "Kebahasaan teks deskripsi", jp: 4, keterangan: "-" },
            { minggu: 5, materi: "Menulis teks deskripsi", jp: 6, keterangan: "-" },
            { minggu: 6, materi: "Mengenal teks prosedur", jp: 4, keterangan: "-" },
            { minggu: 7, materi: "Struktur teks prosedur", jp: 4, keterangan: "-" },
            { minggu: 8, materi: "Menulis teks prosedur", jp: 6, keterangan: "-" },
            { minggu: 9, materi: "PTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 10, materi: "Mengenal LHO", jp: 4, keterangan: "-" },
            { minggu: 11, materi: "Praktik observasi", jp: 6, keterangan: "-" },
            { minggu: 12, materi: "Menulis LHO", jp: 6, keterangan: "-" },
            { minggu: 13, materi: "Pantun dan gurindam", jp: 6, keterangan: "-" },
            { minggu: 14, materi: "Fabel dan legenda", jp: 6, keterangan: "-" },
            { minggu: 15, materi: "Review materi", jp: 4, keterangan: "-" },
            { minggu: 16, materi: "PAS", jp: 4, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review semester 1", jp: 4, keterangan: "-" },
            { minggu: 2, materi: "Mengenal teks persuasi", jp: 4, keterangan: "-" },
            { minggu: 3, materi: "Struktur teks persuasi", jp: 4, keterangan: "-" },
            { minggu: 4, materi: "Menulis iklan dan slogan", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Mengenal teks diskusi", jp: 4, keterangan: "-" },
            { minggu: 6, materi: "Argumen pro dan kontra", jp: 4, keterangan: "-" },
            { minggu: 7, materi: "Praktik diskusi", jp: 6, keterangan: "-" },
            { minggu: 8, materi: "PTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 9, materi: "Mengenal cerpen", jp: 4, keterangan: "-" },
            { minggu: 10, materi: "Unsur intrinsik cerpen", jp: 6, keterangan: "-" },
            { minggu: 11, materi: "Menulis cerpen", jp: 6, keterangan: "-" },
            { minggu: 12, materi: "Mengenal drama", jp: 4, keterangan: "-" },
            { minggu: 13, materi: "Unsur drama dan praktik", jp: 6, keterangan: "-" },
            { minggu: 14, materi: "Review materi", jp: 4, keterangan: "-" },
            { minggu: 15, materi: "PAS", jp: 4, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Guru membuka dengan salam dan doa",
            "Memeriksa kehadiran dan kesiapan siswa",
            "Apersepsi: mengaitkan dengan materi sebelumnya",
            "Motivasi: menampilkan contoh teks yang relevan",
            "Menyampaikan tujuan dan indikator pembelajaran"
        ],
        inti: [
            "Fase Literasi: Siswa membaca contoh teks secara mandiri",
            "Fase Eksplorasi: Diskusi kelompok menganalisis struktur teks",
            "Fase Kolaborasi: Siswa bekerja sama menyusun teks",
            "Fase Presentasi: Kelompok mempresentasikan hasil",
            "Fase Konfirmasi: Guru memberikan penguatan",
            "Latihan menulis teks secara individu",
            "Peer editing untuk menyunting tulisan teman",
            "Refleksi atau revisi tulisan"
        ],
        penutup: [
            "Menyimpulkan materi bersama siswa",
            "Kuis formatif singkat",
            "Refleksi: apa yang sudah dipahami?",
            "Penugasan mandiri",
            "Doa penutup"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Kurang", "Belum memahami struktur dan ciri teks, skor < 60"],
            ["Cukup", "Memahami sebagian struktur teks, skor 60-74"],
            ["Baik", "Memahami dan menganalisis teks, skor 75-89"],
            ["Sangat Baik", "Menganalisis dan mengevaluasi teks, skor 90-100"]
        ],
        keterampilan: [
            ["Kurang", "Belum mampu memproduksi teks dengan struktur benar"],
            ["Cukup", "Memproduksi teks dengan bantuan"],
            ["Baik", "Memproduksi teks mandiri dengan struktur lengkap"],
            ["Sangat Baik", "Memproduksi teks kreatif dan menyunting"]
        ],
        sikap: [
            ["Kurang", "Tidak menunjukkan kerjasama dan apresiasi"],
            ["Cukup", "Mulai menunjukkan kerjasama"],
            ["Baik", "Konsisten bekerja sama dan menghargai karya"],
            ["Sangat Baik", "Menjadi teladan dalam kolaborasi"]
        ]
    }
};

// ============ FASE E (Kelas 10 SMA) ============
export const BINDO_ADMIN_FASE_E: BahasaIndonesiaFaseContent = {
    capaianPembelajaran: "Peserta didik mampu menyimak, membaca, memirsa, berbicara, dan menulis untuk menganalisis, menginterpretasi, dan mengevaluasi berbagai jenis teks (laporan, prosedur kompleks, eksposisi, eksplanasi, negosiasi, debat). Peserta didik mampu mengapresiasi sastra dan memproduksi teks multimodal.",
    elemenCP: ["Menyimak", "Membaca dan Memirsa", "Berbicara dan Mempresentasikan", "Menulis"],
    tujuanPembelajaran: [
        {
            kode: "TP.E.1",
            tujuan: "Menganalisis dan menulis teks laporan hasil observasi",
            indikator: ["Mengidentifikasi struktur dan ciri LHO", "Melakukan observasi ilmiah", "Menulis laporan dengan sistematika", "Mempresentasikan hasil observasi"],
            alokasi: "14 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.E.2",
            tujuan: "Menganalisis dan memproduksi teks eksposisi",
            indikator: ["Mengidentifikasi tesis dan argumen", "Menganalisis fakta dan opini", "Menulis paragraf eksposisi", "Menyampaikan argumen secara lisan"],
            alokasi: "14 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.E.3",
            tujuan: "Memahami dan mempraktikkan teks negosiasi",
            indikator: ["Mengidentifikasi struktur negosiasi", "Menganalisis strategi negosiasi", "Menyusun teks negosiasi", "Mempraktikkan negosiasi"],
            alokasi: "12 JP",
            profilPelajar: ["Gotong Royong", "Berkebinekaan Global"]
        },
        {
            kode: "TP.E.4",
            tujuan: "Memahami dan mempraktikkan debat",
            indikator: ["Memahami format dan aturan debat", "Menyusun argumen pro dan kontra", "Mempraktikkan debat", "Mengevaluasi penampilan debat"],
            alokasi: "14 JP",
            profilPelajar: ["Bernalar Kritis", "Gotong Royong"]
        },
        {
            kode: "TP.E.5",
            tujuan: "Menganalisis dan memproduksi teks biografi",
            indikator: ["Mengidentifikasi struktur biografi", "Menganalisis riwayat tokoh", "Menulis biografi sederhana", "Meneladani tokoh dalam biografi"],
            alokasi: "12 JP",
            profilPelajar: ["Berkebinekaan Global", "Berakhlak Mulia"]
        },
        {
            kode: "TP.E.6",
            tujuan: "Mengapresiasi dan memproduksi puisi kontemporer",
            indikator: ["Menganalisis unsur puisi", "Menginterpretasi makna puisi", "Menulis puisi dengan gaya sendiri", "Membacakan puisi dengan ekspresif"],
            alokasi: "12 JP",
            profilPelajar: ["Kreatif", "Berkebinekaan Global"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.E.2",
            kriteria: ["Mengidentifikasi tesis dengan tepat", "Menyusun argumen logis", "Menulis eksposisi dengan struktur lengkap"],
            teknikAsesmen: ["Tes Tertulis", "Penilaian Produk"],
            bentukInstrumen: ["Soal uraian", "Rubrik tulisan"]
        },
        {
            tpKode: "TP.E.4",
            kriteria: ["Menyusun argumen yang kuat", "Menyampaikan argumen dengan percaya diri", "Menanggapi argumen lawan dengan santun"],
            teknikAsesmen: ["Unjuk Kerja", "Observasi"],
            bentukInstrumen: ["Rubrik debat", "Lembar observasi"]
        },
        {
            tpKode: "TP.E.6",
            kriteria: ["Menganalisis unsur puisi dengan tepat", "Menulis puisi kreatif", "Membaca puisi ekspresif"],
            teknikAsesmen: ["Tes Tertulis", "Portofolio"],
            bentukInstrumen: ["Soal analisis", "Kumpulan puisi"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Teks laporan hasil observasi", alokasi: "14 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 3, materi: "Teks eksposisi", alokasi: "14 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 3, materi: "Teks anekdot", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "Oktober", minggu: 3, materi: "Hikayat dan cerpen", alokasi: "14 JP", keterangan: "-" },
        { semester: 1, bulan: "November", minggu: 2, materi: "Teks negosiasi", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "Debat", alokasi: "14 JP", keterangan: "-" },
        { semester: 2, bulan: "Februari", minggu: 2, materi: "Teks biografi", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "Maret", minggu: 2, materi: "Puisi kontemporer", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "April", minggu: 2, materi: "Teks cerita sejarah", alokasi: "12 JP", keterangan: "-" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "MPLS", jp: 0, keterangan: "Orientasi" },
            { minggu: 2, materi: "Mengenal teks LHO", jp: 4, keterangan: "-" },
            { minggu: 3, materi: "Struktur dan kebahasaan LHO", jp: 4, keterangan: "-" },
            { minggu: 4, materi: "Praktik observasi dan menulis", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Mengenal teks eksposisi", jp: 4, keterangan: "-" },
            { minggu: 6, materi: "Tesis, argumen, penegasan ulang", jp: 4, keterangan: "-" },
            { minggu: 7, materi: "Menulis eksposisi", jp: 6, keterangan: "-" },
            { minggu: 8, materi: "Teks anekdot", jp: 4, keterangan: "-" },
            { minggu: 9, materi: "PTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 10, materi: "Hikayat: struktur dan nilai", jp: 4, keterangan: "-" },
            { minggu: 11, materi: "Perbandingan hikayat-cerpen", jp: 4, keterangan: "-" },
            { minggu: 12, materi: "Menulis cerpen", jp: 6, keterangan: "-" },
            { minggu: 13, materi: "Teks negosiasi", jp: 4, keterangan: "-" },
            { minggu: 14, materi: "Praktik negosiasi", jp: 6, keterangan: "-" },
            { minggu: 15, materi: "Review materi", jp: 4, keterangan: "-" },
            { minggu: 16, materi: "PAS", jp: 4, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review semester 1", jp: 4, keterangan: "-" },
            { minggu: 2, materi: "Mengenal debat", jp: 4, keterangan: "-" },
            { minggu: 3, materi: "Menyusun argumen debat", jp: 4, keterangan: "-" },
            { minggu: 4, materi: "Praktik debat", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Mengenal teks biografi", jp: 4, keterangan: "-" },
            { minggu: 6, materi: "Struktur dan kebahasaan biografi", jp: 4, keterangan: "-" },
            { minggu: 7, materi: "Menulis biografi", jp: 6, keterangan: "-" },
            { minggu: 8, materi: "PTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 9, materi: "Mengenal puisi kontemporer", jp: 4, keterangan: "-" },
            { minggu: 10, materi: "Unsur dan makna puisi", jp: 4, keterangan: "-" },
            { minggu: 11, materi: "Menulis dan membaca puisi", jp: 6, keterangan: "-" },
            { minggu: 12, materi: "Teks cerita sejarah", jp: 4, keterangan: "-" },
            { minggu: 13, materi: "Menulis cerita sejarah", jp: 6, keterangan: "-" },
            { minggu: 14, materi: "Review materi", jp: 4, keterangan: "-" },
            { minggu: 15, materi: "PAS", jp: 4, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Guru membuka dengan salam dan doa",
            "Memeriksa kehadiran peserta didik",
            "Apersepsi: menghubungkan dengan pengalaman/pengetahuan awal",
            "Motivasi: menampilkan video/artikel yang relevan",
            "Menyampaikan tujuan dan manfaat pembelajaran"
        ],
        inti: [
            "Orientasi: Peserta didik mengamati contoh teks/video",
            "Tanya jawab tentang isi dan struktur teks",
            "Diskusi kelompok menganalisis struktur teks",
            "Presentasi hasil analisis kelompok",
            "Konfirmasi dan elaborasi dari guru",
            "Latihan memproduksi teks secara individu/kelompok",
            "Peer review dan revisi",
            "Praktik presentasi/debat/negosiasi"
        ],
        penutup: [
            "Menyimpulkan materi dengan mind mapping",
            "Kuis formatif/refleksi diri",
            "Umpan balik dari guru",
            "Penugasan rumah",
            "Doa dan salam penutup"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Kurang (D)", "Belum memahami konsep, skor < 60"],
            ["Cukup (C)", "Memahami konsep dasar, skor 60-74"],
            ["Baik (B)", "Memahami dan mengaplikasikan, skor 75-89"],
            ["Sangat Baik (A)", "Menganalisis dan mengevaluasi, skor 90-100"]
        ],
        keterampilan: [
            ["Kurang", "Belum mampu memproduksi teks"],
            ["Cukup", "Memproduksi teks dengan bantuan"],
            ["Baik", "Memproduksi teks mandiri"],
            ["Sangat Baik", "Memproduksi teks kreatif dan inovatif"]
        ],
        sikap: [
            ["Kurang", "Tidak menunjukkan sikap positif"],
            ["Cukup", "Kadang menunjukkan sikap positif"],
            ["Baik", "Konsisten menunjukkan sikap positif"],
            ["Sangat Baik", "Menjadi teladan bagi teman"]
        ]
    }
};

// ============ FASE F (Kelas 11-12 SMA) ============
export const BINDO_ADMIN_FASE_F: BahasaIndonesiaFaseContent = {
    capaianPembelajaran: "Peserta didik mampu menyimak, membaca, memirsa, berbicara, dan menulis untuk menganalisis, menginterpretasi, dan mengevaluasi karya sastra dan teks akademik. Peserta didik mampu menyusun karya ilmiah sederhana (proposal, esai, kritik sastra) dan mengapresiasi drama serta novel.",
    elemenCP: ["Menyimak", "Membaca dan Memirsa", "Berbicara dan Mempresentasikan", "Menulis"],
    tujuanPembelajaran: [
        {
            kode: "TP.F.1",
            tujuan: "Menyusun dan mempresentasikan proposal kegiatan/penelitian",
            indikator: ["Memahami struktur proposal", "Menyusun proposal kegiatan", "Menyusun proposal penelitian sederhana", "Mempresentasikan proposal"],
            alokasi: "16 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.F.2",
            tujuan: "Menganalisis dan menulis karya ilmiah (makalah/artikel)",
            indikator: ["Memahami sistematika karya ilmiah", "Mengutip dengan benar", "Menulis karya ilmiah sederhana", "Menggunakan bahasa baku"],
            alokasi: "18 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.F.3",
            tujuan: "Menganalisis dan menulis esai/opini",
            indikator: ["Memahami struktur esai", "Menulis tesis yang jelas", "Menyusun argumen yang kuat", "Menulis esai argumentatif"],
            alokasi: "14 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.F.4",
            tujuan: "Mengapresiasi dan mengkritisi novel Indonesia/terjemahan",
            indikator: ["Menganalisis unsur intrinsik novel", "Menganalisis unsur ekstrinsik novel", "Menulis resensi novel", "Menulis kritik sastra sederhana"],
            alokasi: "16 JP",
            profilPelajar: ["Kreatif", "Berkebinekaan Global"]
        },
        {
            kode: "TP.F.5",
            tujuan: "Mengapresiasi dan mementaskan drama",
            indikator: ["Menganalisis unsur drama", "Membuat naskah drama pendek", "Berperan dalam pementasan", "Mengevaluasi pementasan drama"],
            alokasi: "16 JP",
            profilPelajar: ["Kreatif", "Gotong Royong"]
        },
        {
            kode: "TP.F.6",
            tujuan: "Menyampaikan pidato/ceramah akademik",
            indikator: ["Menyusun kerangka pidato", "Menulis naskah pidato akademik", "Menyampaikan pidato dengan percaya diri", "Menggunakan bahasa persuasif"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Gotong Royong"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.F.1",
            kriteria: ["Menyusun proposal dengan struktur lengkap", "Menyajikan proposal dengan jelas", "Menjawab pertanyaan dengan tepat"],
            teknikAsesmen: ["Penilaian Proyek", "Unjuk Kerja"],
            bentukInstrumen: ["Rubrik proposal", "Rubrik presentasi"]
        },
        {
            tpKode: "TP.F.2",
            kriteria: ["Menulis dengan sistematika ilmiah", "Mengutip dengan benar", "Menggunakan bahasa baku"],
            teknikAsesmen: ["Penilaian Produk", "Portofolio"],
            bentukInstrumen: ["Rubrik karya ilmiah", "Kumpulan tulisan"]
        },
        {
            tpKode: "TP.F.4",
            kriteria: ["Menganalisis novel dengan komprehensif", "Menulis resensi dengan struktur lengkap"],
            teknikAsesmen: ["Tes Tertulis", "Penilaian Produk"],
            bentukInstrumen: ["Soal esai", "Rubrik resensi"]
        },
        {
            tpKode: "TP.F.5",
            kriteria: ["Berperan sesuai karakter", "Menunjukkan ekspresi yang tepat", "Bekerjasama dalam tim"],
            teknikAsesmen: ["Unjuk Kerja", "Observasi"],
            bentukInstrumen: ["Rubrik pementasan", "Lembar observasi"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Proposal kegiatan", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 2, materi: "Proposal penelitian", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 2, materi: "Karya ilmiah", alokasi: "14 JP", keterangan: "-" },
        { semester: 1, bulan: "Oktober", minggu: 2, materi: "Novel Indonesia", alokasi: "14 JP", keterangan: "-" },
        { semester: 1, bulan: "November", minggu: 2, materi: "Kritik sastra", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "Drama", alokasi: "14 JP", keterangan: "-" },
        { semester: 2, bulan: "Februari", minggu: 2, materi: "Esai argumentatif", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "Maret", minggu: 2, materi: "Pidato akademik", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "April", minggu: 2, materi: "Menulis memoir/otobiografi", alokasi: "10 JP", keterangan: "-" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "MPLS", jp: 0, keterangan: "Orientasi" },
            { minggu: 2, materi: "Mengenal proposal kegiatan", jp: 4, keterangan: "-" },
            { minggu: 3, materi: "Struktur dan sistematika proposal", jp: 4, keterangan: "-" },
            { minggu: 4, materi: "Menulis proposal kegiatan", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Proposal penelitian sederhana", jp: 6, keterangan: "-" },
            { minggu: 6, materi: "Presentasi proposal", jp: 4, keterangan: "-" },
            { minggu: 7, materi: "Sistematika karya ilmiah", jp: 4, keterangan: "-" },
            { minggu: 8, materi: "Teknik kutipan dan daftar pustaka", jp: 4, keterangan: "-" },
            { minggu: 9, materi: "PTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 10, materi: "Menulis karya ilmiah", jp: 6, keterangan: "-" },
            { minggu: 11, materi: "Membaca novel Indonesia", jp: 4, keterangan: "-" },
            { minggu: 12, materi: "Analisis unsur intrinsik novel", jp: 6, keterangan: "-" },
            { minggu: 13, materi: "Analisis unsur ekstrinsik novel", jp: 4, keterangan: "-" },
            { minggu: 14, materi: "Menulis resensi/kritik", jp: 6, keterangan: "-" },
            { minggu: 15, materi: "Review materi", jp: 4, keterangan: "-" },
            { minggu: 16, materi: "PAS", jp: 4, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review semester 1", jp: 4, keterangan: "-" },
            { minggu: 2, materi: "Mengenal drama modern", jp: 4, keterangan: "-" },
            { minggu: 3, materi: "Unsur drama", jp: 4, keterangan: "-" },
            { minggu: 4, materi: "Menulis naskah drama", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Latihan pementasan", jp: 6, keterangan: "-" },
            { minggu: 6, materi: "Pementasan drama", jp: 6, keterangan: "-" },
            { minggu: 7, materi: "Mengenal esai", jp: 4, keterangan: "-" },
            { minggu: 8, materi: "PTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 9, materi: "Struktur esai argumentatif", jp: 4, keterangan: "-" },
            { minggu: 10, materi: "Menulis esai", jp: 6, keterangan: "-" },
            { minggu: 11, materi: "Pidato akademik", jp: 4, keterangan: "-" },
            { minggu: 12, materi: "Praktik pidato", jp: 6, keterangan: "-" },
            { minggu: 13, materi: "Memoir dan otobiografi", jp: 6, keterangan: "-" },
            { minggu: 14, materi: "Review materi", jp: 4, keterangan: "-" },
            { minggu: 15, materi: "PAS", jp: 4, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Guru membuka dengan salam dan doa",
            "Memeriksa kehadiran dan kesiapan",
            "Apersepsi: review materi dan menghubungkan dengan isu terkini",
            "Motivasi: menampilkan contoh karya ilmiah/sastra berkualitas",
            "Menyampaikan tujuan pembelajaran dan capaian yang diharapkan"
        ],
        inti: [
            "Orientasi: Peserta didik mengamati contoh proposal/karya ilmiah",
            "Eksplorasi: Diskusi tentang struktur dan kebahasaan",
            "Elaborasi: Latihan menyusun bagian-bagian teks",
            "Konfirmasi: Umpan balik dan penguatan dari guru",
            "Produksi: Menulis karya secara mandiri/kelompok",
            "Revisi: Peer editing dan self-editing",
            "Presentasi: Mempresentasikan hasil karya",
            "Workshop: Perbaikan berdasarkan masukan"
        ],
        penutup: [
            "Menyimpulkan materi dengan peta konsep",
            "Refleksi proses pembelajaran",
            "Umpan balik dan apresiasi",
            "Penugasan lanjutan",
            "Doa dan salam penutup"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Kurang (D)", "Belum memahami konsep akademik, skor < 60"],
            ["Cukup (C)", "Memahami konsep dasar, skor 60-74"],
            ["Baik (B)", "Memahami dan mengaplikasikan, skor 75-89"],
            ["Sangat Baik (A)", "Menganalisis dan mencipta, skor 90-100"]
        ],
        keterampilan: [
            ["Kurang", "Belum mampu memproduksi karya akademik"],
            ["Cukup", "Memproduksi karya dengan bimbingan"],
            ["Baik", "Memproduksi karya mandiri dengan kualitas baik"],
            ["Sangat Baik", "Memproduksi karya berkualitas tinggi dan orisinal"]
        ],
        sikap: [
            ["Kurang", "Tidak menunjukkan integritas akademik"],
            ["Cukup", "Mulai menunjukkan integritas akademik"],
            ["Baik", "Konsisten menunjukkan integritas akademik"],
            ["Sangat Baik", "Menjadi teladan integritas akademik"]
        ]
    }
};

// Export helper
export function getBindoAdminByFase(fase: string): BahasaIndonesiaFaseContent {
    const f = fase.toUpperCase();
    if (f.includes('A') || f.includes('1') || f.includes('2')) {
        const { BINDO_ADMIN_FASE_A } = require('./bindoAdminFaseABC');
        return BINDO_ADMIN_FASE_A;
    }
    if (f.includes('B') || f.includes('3') || f.includes('4')) {
        const { BINDO_ADMIN_FASE_B } = require('./bindoAdminFaseABC');
        return BINDO_ADMIN_FASE_B;
    }
    if (f.includes('C') || f.includes('5') || f.includes('6')) {
        const { BINDO_ADMIN_FASE_C } = require('./bindoAdminFaseABC');
        return BINDO_ADMIN_FASE_C;
    }
    if (f.includes('D') || f.includes('7') || f.includes('8') || f.includes('9') || f.includes('SMP')) {
        return BINDO_ADMIN_FASE_D;
    }
    if (f.includes('E') || f.includes('10') || f.includes('X')) {
        return BINDO_ADMIN_FASE_E;
    }
    if (f.includes('F') || f.includes('11') || f.includes('12') || f.includes('XI') || f.includes('XII')) {
        return BINDO_ADMIN_FASE_F;
    }
    return BINDO_ADMIN_FASE_D; // Default
}
