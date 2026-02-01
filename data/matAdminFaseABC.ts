/**
 * Matematika Administrative Content - Complete Materials for All Document Types
 * Includes: Tujuan Pembelajaran, ATP, KKTP, Prota, Promes for each Fase
 */

// ============ INTERFACES ============
export interface TujuanPembelajaran {
    kode: string;
    tujuan: string;
    indikator: string[];
    alokasi: string;
    profilPelajar: string[];
}

export interface MateriATP {
    semester: number;
    minggu: string;
    tp: TujuanPembelajaran[];
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

export interface MatematikFaseContent {
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
export const MATEMATIKA_ADMIN_FASE_A: MatematikFaseContent = {
    capaianPembelajaran: "Peserta didik dapat menunjukkan pemahaman dan memiliki intuisi bilangan (number sense) pada bilangan cacah sampai 100, termasuk melakukan operasi penjumlahan dan pengurangan. Peserta didik dapat membandingkan dan mengurutkan aneka benda berdasarkan panjang, berat, atau atribut lainnya.",
    elemenCP: ["Bilangan", "Aljabar", "Pengukuran", "Geometri"],
    tujuanPembelajaran: [
        {
            kode: "TP.A.1",
            tujuan: "Mengenal dan membilang bilangan cacah 1-100",
            indikator: ["Menghitung benda konkret 1-100", "Menulis lambang bilangan", "Membaca lambang bilangan", "Mengurutkan bilangan"],
            alokasi: "8 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.A.2",
            tujuan: "Melakukan operasi penjumlahan bilangan cacah sampai 100",
            indikator: ["Menjumlahkan dua bilangan tanpa menyimpan", "Menjumlahkan dua bilangan dengan menyimpan", "Menyelesaikan soal cerita penjumlahan"],
            alokasi: "10 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.A.3",
            tujuan: "Melakukan operasi pengurangan bilangan cacah sampai 100",
            indikator: ["Mengurangkan dua bilangan tanpa meminjam", "Mengurangkan dua bilangan dengan meminjam", "Menyelesaikan soal cerita pengurangan"],
            alokasi: "10 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.A.4",
            tujuan: "Mengenal nilai tempat (satuan dan puluhan)",
            indikator: ["Mengidentifikasi nilai tempat satuan", "Mengidentifikasi nilai tempat puluhan", "Menulis bentuk panjang bilangan"],
            alokasi: "6 JP",
            profilPelajar: ["Bernalar Kritis"]
        },
        {
            kode: "TP.A.5",
            tujuan: "Membandingkan dan mengurutkan panjang benda",
            indikator: ["Membandingkan panjang dua benda", "Mengurutkan benda dari terpendek ke terpanjang", "Mengukur panjang dengan satuan tidak baku"],
            alokasi: "6 JP",
            profilPelajar: ["Bernalar Kritis", "Gotong Royong"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.A.1",
            kriteria: ["Menghitung dengan benar", "Menulis lambang bilangan dengan tepat", "Membaca bilangan dengan lancar"],
            teknikAsesmen: ["Tes Lisan", "Tes Tertulis", "Praktik"],
            bentukInstrumen: ["Lembar observasi", "Soal pilihan ganda", "Tugas menghitung benda"]
        },
        {
            tpKode: "TP.A.2",
            kriteria: ["Menjumlahkan dengan benar", "Menyelesaikan soal cerita dengan tepat"],
            teknikAsesmen: ["Tes Tertulis", "Penugasan"],
            bentukInstrumen: ["Soal uraian singkat", "Lembar kerja"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Mengenal bilangan 1-20", alokasi: "6 JP", keterangan: "Pengenalan" },
        { semester: 1, bulan: "Juli", minggu: 4, materi: "Membilang dan menulis bilangan 1-20", alokasi: "6 JP", keterangan: "Latihan" },
        { semester: 1, bulan: "Agustus", minggu: 1, materi: "Mengenal bilangan 21-50", alokasi: "6 JP", keterangan: "Pengenalan" },
        { semester: 1, bulan: "Agustus", minggu: 2, materi: "Penjumlahan bilangan 1-20", alokasi: "8 JP", keterangan: "Operasi dasar" },
        { semester: 1, bulan: "Agustus", minggu: 3, materi: "Pengurangan bilangan 1-20", alokasi: "8 JP", keterangan: "Operasi dasar" },
        { semester: 1, bulan: "September", minggu: 1, materi: "Mengenal bilangan 51-100", alokasi: "6 JP", keterangan: "Pengenalan" },
        { semester: 1, bulan: "September", minggu: 2, materi: "Nilai tempat satuan dan puluhan", alokasi: "6 JP", keterangan: "Konsep" },
        { semester: 1, bulan: "Oktober", minggu: 1, materi: "Penjumlahan dengan menyimpan", alokasi: "8 JP", keterangan: "Operasi lanjut" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "Pengurangan dengan meminjam", alokasi: "8 JP", keterangan: "Operasi lanjut" },
        { semester: 2, bulan: "Februari", minggu: 1, materi: "Membandingkan panjang benda", alokasi: "6 JP", keterangan: "Pengukuran" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "Orientasi dan pengenalan", jp: 4, keterangan: "MPLS" },
            { minggu: 2, materi: "Mengenal bilangan 1-10", jp: 6, keterangan: "-" },
            { minggu: 3, materi: "Mengenal bilangan 11-20", jp: 6, keterangan: "-" },
            { minggu: 4, materi: "Membilang bilangan 1-20", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Mengurutkan bilangan 1-20", jp: 6, keterangan: "-" },
            { minggu: 6, materi: "Mengenal bilangan 21-50", jp: 6, keterangan: "-" },
            { minggu: 7, materi: "Penjumlahan 1-10", jp: 8, keterangan: "-" },
            { minggu: 8, materi: "Penjumlahan 11-20", jp: 8, keterangan: "-" },
            { minggu: 9, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 10, materi: "Pengurangan 1-10", jp: 8, keterangan: "-" },
            { minggu: 11, materi: "Pengurangan 11-20", jp: 8, keterangan: "-" },
            { minggu: 12, materi: "Soal cerita penjumlahan", jp: 6, keterangan: "-" },
            { minggu: 13, materi: "Soal cerita pengurangan", jp: 6, keterangan: "-" },
            { minggu: 14, materi: "Nilai tempat", jp: 6, keterangan: "-" },
            { minggu: 15, materi: "Bilangan 51-100", jp: 6, keterangan: "-" },
            { minggu: 16, materi: "Review dan UAS", jp: 6, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review semester 1", jp: 4, keterangan: "-" },
            { minggu: 2, materi: "Penjumlahan dengan menyimpan", jp: 8, keterangan: "-" },
            { minggu: 3, materi: "Latihan penjumlahan menyimpan", jp: 8, keterangan: "-" },
            { minggu: 4, materi: "Pengurangan dengan meminjam", jp: 8, keterangan: "-" },
            { minggu: 5, materi: "Latihan pengurangan meminjam", jp: 8, keterangan: "-" },
            { minggu: 6, materi: "Membandingkan panjang", jp: 6, keterangan: "-" },
            { minggu: 7, materi: "Mengurutkan panjang", jp: 6, keterangan: "-" },
            { minggu: 8, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 9, materi: "Mengenal bangun datar", jp: 6, keterangan: "-" },
            { minggu: 10, materi: "Membaca jam", jp: 6, keterangan: "-" },
            { minggu: 11, materi: "Mengenal uang", jp: 6, keterangan: "-" },
            { minggu: 12, materi: "Latihan soal cerita", jp: 6, keterangan: "-" },
            { minggu: 13, materi: "Review materi", jp: 6, keterangan: "-" },
            { minggu: 14, materi: "UAS", jp: 4, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Guru mengajak siswa berdoa bersama sebelum memulai pembelajaran",
            "Guru menyapa siswa dengan ramah dan mengecek kehadiran",
            "Siswa menyanyikan lagu tentang bilangan bersama-sama",
            "Guru menunjukkan benda-benda konkret yang akan dihitung",
            "Guru menyampaikan tujuan pembelajaran hari ini dengan bahasa sederhana"
        ],
        inti: [
            "Siswa mengamati benda-benda konkret di sekitar kelas (pensil, buku, bola)",
            "Siswa menghitung benda satu per satu dengan bimbingan guru",
            "Siswa menuliskan lambang bilangan di papan tulis secara bergantian",
            "Bermain 'Toko-tokoan' untuk melatih penjumlahan dan pengurangan",
            "Menggunakan balok/kelereng untuk visualisasi operasi hitung",
            "Siswa mengerjakan lembar kerja secara berpasangan",
            "Guru memberikan contoh soal cerita sederhana dari kehidupan sehari-hari",
            "Siswa mempresentasikan hasil kerja di depan kelas"
        ],
        penutup: [
            "Siswa menyimpulkan pelajaran dengan bimbingan guru",
            "Kuis lisan singkat: guru menyebutkan soal, siswa menjawab",
            "Refleksi: Apa yang sudah dipahami? Apa yang masih bingung?",
            "Guru memberikan apresiasi positif kepada semua siswa",
            "Berdoa bersama sebelum pulang"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Belum Berkembang", "Belum mampu menghitung benda dengan benar"],
            ["Mulai Berkembang", "Mampu menghitung benda dengan sedikit bantuan"],
            ["Berkembang Sesuai Harapan", "Mampu menghitung benda dengan benar secara mandiri"],
            ["Sangat Berkembang", "Mampu menghitung dan menjelaskan kepada teman"]
        ],
        keterampilan: [
            ["Belum Berkembang", "Belum mampu menuliskan lambang bilangan"],
            ["Mulai Berkembang", "Mampu menulis lambang bilangan dengan bantuan"],
            ["Berkembang Sesuai Harapan", "Mampu menulis lambang bilangan dengan rapi"],
            ["Sangat Berkembang", "Mampu menulis dan membaca lambang bilangan dengan lancar"]
        ],
        sikap: [
            ["Belum Berkembang", "Belum menunjukkan ketelitian dalam berhitung"],
            ["Mulai Berkembang", "Mulai menunjukkan ketelitian dengan pengingatan"],
            ["Berkembang Sesuai Harapan", "Konsisten teliti dalam berhitung"],
            ["Sangat Berkembang", "Menjadi contoh ketelitian bagi teman-teman"]
        ]
    }
};

// ============ FASE B (Kelas 3-4 SD) ============
export const MATEMATIKA_ADMIN_FASE_B: MatematikFaseContent = {
    capaianPembelajaran: "Peserta didik dapat menunjukkan pemahaman dan intuisi bilangan pada bilangan cacah sampai 10.000. Peserta didik dapat melakukan operasi perkalian dan pembagian bilangan cacah sampai 100. Peserta didik memahami pecahan sebagai bagian dari keseluruhan.",
    elemenCP: ["Bilangan", "Aljabar", "Pengukuran", "Geometri", "Analisis Data"],
    tujuanPembelajaran: [
        {
            kode: "TP.B.1",
            tujuan: "Memahami dan melakukan perkalian bilangan cacah sampai 100",
            indikator: ["Menghafal perkalian dasar 1-10", "Menggunakan perkalian dalam soal cerita", "Menyelesaikan perkalian bersusun"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.B.2",
            tujuan: "Memahami dan melakukan pembagian bilangan cacah sampai 100",
            indikator: ["Memahami pembagian sebagai kebalikan perkalian", "Menyelesaikan pembagian sederhana", "Menggunakan pembagian dalam soal cerita"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.B.3",
            tujuan: "Mengenal dan memahami pecahan sederhana",
            indikator: ["Mengenal pecahan sebagai bagian dari keseluruhan", "Membaca dan menulis pecahan", "Membandingkan pecahan sederhana"],
            alokasi: "10 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.B.4",
            tujuan: "Menghitung keliling dan luas bangun datar sederhana",
            indikator: ["Menghitung keliling persegi dan persegi panjang", "Menghitung luas persegi dan persegi panjang", "Menyelesaikan soal cerita keliling dan luas"],
            alokasi: "10 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.B.1",
            kriteria: ["Menghafal perkalian 1-10 dengan lancar", "Menyelesaikan perkalian bersusun dengan benar"],
            teknikAsesmen: ["Tes Lisan", "Tes Tertulis"],
            bentukInstrumen: ["Kartu flash perkalian", "Soal uraian"]
        },
        {
            tpKode: "TP.B.3",
            kriteria: ["Mengidentifikasi pecahan dengan benar", "Membandingkan pecahan dengan tepat"],
            teknikAsesmen: ["Tes Tertulis", "Praktik"],
            bentukInstrumen: ["Soal pilihan ganda", "Demonstrasi dengan kertas lipat"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Perkalian dasar 2, 3, 4", alokasi: "8 JP", keterangan: "Pengenalan" },
        { semester: 1, bulan: "Agustus", minggu: 1, materi: "Perkalian dasar 5, 6, 7", alokasi: "8 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 3, materi: "Perkalian dasar 8, 9, 10", alokasi: "8 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 1, materi: "Pembagian dasar 1-5", alokasi: "8 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 3, materi: "Pembagian dasar 6-10", alokasi: "8 JP", keterangan: "-" },
        { semester: 1, bulan: "Oktober", minggu: 1, materi: "Pecahan sederhana", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "Keliling bangun datar", alokasi: "8 JP", keterangan: "-" },
        { semester: 2, bulan: "Februari", minggu: 1, materi: "Luas bangun datar", alokasi: "8 JP", keterangan: "-" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "Orientasi", jp: 4, keterangan: "MPLS" },
            { minggu: 2, materi: "Review bilangan 1-1000", jp: 6, keterangan: "-" },
            { minggu: 3, materi: "Perkalian 2 dan 3", jp: 8, keterangan: "-" },
            { minggu: 4, materi: "Perkalian 4 dan 5", jp: 8, keterangan: "-" },
            { minggu: 5, materi: "Perkalian 6 dan 7", jp: 8, keterangan: "-" },
            { minggu: 6, materi: "Perkalian 8, 9, 10", jp: 8, keterangan: "-" },
            { minggu: 7, materi: "Pembagian 2-5", jp: 8, keterangan: "-" },
            { minggu: 8, materi: "Pembagian 6-10", jp: 8, keterangan: "-" },
            { minggu: 9, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 10, materi: "Mengenal pecahan 1/2, 1/4", jp: 6, keterangan: "-" },
            { minggu: 11, materi: "Pecahan senilai", jp: 6, keterangan: "-" },
            { minggu: 12, materi: "Membandingkan pecahan", jp: 6, keterangan: "-" },
            { minggu: 13, materi: "Operasi pecahan sederhana", jp: 8, keterangan: "-" },
            { minggu: 14, materi: "Review materi", jp: 6, keterangan: "-" },
            { minggu: 15, materi: "UAS", jp: 4, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review semester 1", jp: 4, keterangan: "-" },
            { minggu: 2, materi: "Mengenal bangun datar", jp: 6, keterangan: "-" },
            { minggu: 3, materi: "Keliling persegi", jp: 8, keterangan: "-" },
            { minggu: 4, materi: "Keliling persegi panjang", jp: 8, keterangan: "-" },
            { minggu: 5, materi: "Luas persegi", jp: 8, keterangan: "-" },
            { minggu: 6, materi: "Luas persegi panjang", jp: 8, keterangan: "-" },
            { minggu: 7, materi: "Soal cerita keliling luas", jp: 8, keterangan: "-" },
            { minggu: 8, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 9, materi: "Pengolahan data sederhana", jp: 6, keterangan: "-" },
            { minggu: 10, materi: "Diagram batang", jp: 6, keterangan: "-" },
            { minggu: 11, materi: "Satuan waktu", jp: 6, keterangan: "-" },
            { minggu: 12, materi: "Satuan panjang", jp: 6, keterangan: "-" },
            { minggu: 13, materi: "Satuan berat", jp: 6, keterangan: "-" },
            { minggu: 14, materi: "UAS", jp: 4, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Guru membuka pembelajaran dengan salam dan doa",
            "Apersepsi dengan kuis perkalian cepat (flash card)",
            "Guru menampilkan masalah kontekstual terkait perkalian/pembagian",
            "Menyampaikan tujuan pembelajaran dan manfaatnya"
        ],
        inti: [
            "Eksplorasi: Siswa mengamati contoh perkalian dalam kehidupan (batang korek, telur dalam kotak)",
            "Siswa menemukan pola perkalian menggunakan tabel perkalian",
            "Latihan hafalan perkalian dengan lagu/yel-yel",
            "Praktik mengukur dan menghitung keliling/luas benda di kelas",
            "Kerja kelompok menyelesaikan soal cerita",
            "Presentasi hasil kerja kelompok",
            "Konfirmasi dan penguatan dari guru"
        ],
        penutup: [
            "Siswa menyimpulkan pembelajaran hari ini",
            "Kuis singkat untuk mengecek pemahaman",
            "Refleksi: apa yang mudah dan sulit?",
            "Penugasan (PR) yang relevan",
            "Doa penutup"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Belum Berkembang", "Belum menghafal perkalian dasar"],
            ["Mulai Berkembang", "Menghafal sebagian perkalian dengan bantuan"],
            ["Berkembang Sesuai Harapan", "Menghafal perkalian 1-10 dengan lancar"],
            ["Sangat Berkembang", "Menghafal dan mengaplikasikan dalam soal cerita"]
        ],
        keterampilan: [
            ["Belum Berkembang", "Belum mampu menghitung keliling/luas"],
            ["Mulai Berkembang", "Mampu menghitung dengan banyak bantuan"],
            ["Berkembang Sesuai Harapan", "Mampu menghitung keliling/luas dengan tepat"],
            ["Sangat Berkembang", "Mampu menyelesaikan soal cerita kompleks"]
        ],
        sikap: [
            ["Belum Berkembang", "Belum menunjukkan ketelitian"],
            ["Mulai Berkembang", "Mulai menunjukkan ketelitian"],
            ["Berkembang Sesuai Harapan", "Teliti dan tekun dalam berhitung"],
            ["Sangat Berkembang", "Menjadi contoh ketelitian bagi teman"]
        ]
    }
};

// ============ FASE C (Kelas 5-6 SD) ============
export const MATEMATIKA_ADMIN_FASE_C: MatematikFaseContent = {
    capaianPembelajaran: "Peserta didik dapat menyelesaikan masalah yang berkaitan dengan FPB dan KPK, operasi pecahan, desimal, dan persen. Peserta didik dapat menghitung volume dan luas permukaan bangun ruang sederhana.",
    elemenCP: ["Bilangan", "Aljabar", "Pengukuran", "Geometri", "Analisis Data dan Peluang"],
    tujuanPembelajaran: [
        {
            kode: "TP.C.1",
            tujuan: "Menentukan FPB dan KPK dari dua atau tiga bilangan",
            indikator: ["Menentukan faktor prima", "Menghitung FPB dengan faktorisasi", "Menghitung KPK dengan faktorisasi", "Menyelesaikan soal cerita FPB dan KPK"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.C.2",
            tujuan: "Melakukan operasi hitung pecahan, desimal, dan persen",
            indikator: ["Menjumlahkan dan mengurangkan pecahan", "Mengalikan dan membagi pecahan", "Mengkonversi pecahan-desimal-persen"],
            alokasi: "16 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.C.3",
            tujuan: "Menghitung volume bangun ruang sederhana",
            indikator: ["Menghitung volume kubus", "Menghitung volume balok", "Menyelesaikan soal cerita volume"],
            alokasi: "10 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.C.4",
            tujuan: "Mengolah dan menyajikan data dalam diagram",
            indikator: ["Mengumpulkan dan mengolah data", "Menyajikan data dalam diagram batang/lingkaran", "Menginterpretasi diagram"],
            alokasi: "8 JP",
            profilPelajar: ["Bernalar Kritis", "Gotong Royong"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.C.1",
            kriteria: ["Menentukan FPB dengan benar", "Menentukan KPK dengan benar", "Menyelesaikan soal cerita dengan tepat"],
            teknikAsesmen: ["Tes Tertulis", "Penugasan"],
            bentukInstrumen: ["Soal uraian", "Proyek pemecahan masalah"]
        },
        {
            tpKode: "TP.C.3",
            kriteria: ["Menghitung volume kubus dengan rumus", "Menghitung volume balok dengan rumus"],
            teknikAsesmen: ["Tes Tertulis", "Praktik"],
            bentukInstrumen: ["Soal pilihan ganda dan uraian", "Praktik mengukur kotak"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Faktor dan kelipatan", alokasi: "8 JP", keterangan: "Konsep dasar" },
        { semester: 1, bulan: "Agustus", minggu: 1, materi: "FPB", alokasi: "8 JP", keterangan: "Operasi" },
        { semester: 1, bulan: "Agustus", minggu: 3, materi: "KPK", alokasi: "8 JP", keterangan: "Operasi" },
        { semester: 1, bulan: "September", minggu: 1, materi: "Operasi pecahan biasa", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "Oktober", minggu: 1, materi: "Desimal dan persen", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "Volume kubus", alokasi: "8 JP", keterangan: "-" },
        { semester: 2, bulan: "Februari", minggu: 1, materi: "Volume balok", alokasi: "8 JP", keterangan: "-" },
        { semester: 2, bulan: "Maret", minggu: 1, materi: "Pengolahan data", alokasi: "8 JP", keterangan: "-" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "Orientasi", jp: 4, keterangan: "MPLS" },
            { minggu: 2, materi: "Faktor bilangan", jp: 6, keterangan: "-" },
            { minggu: 3, materi: "Kelipatan bilangan", jp: 6, keterangan: "-" },
            { minggu: 4, materi: "Bilangan prima", jp: 6, keterangan: "-" },
            { minggu: 5, materi: "Faktorisasi prima", jp: 8, keterangan: "-" },
            { minggu: 6, materi: "FPB dua bilangan", jp: 8, keterangan: "-" },
            { minggu: 7, materi: "KPK dua bilangan", jp: 8, keterangan: "-" },
            { minggu: 8, materi: "Soal cerita FPB KPK", jp: 8, keterangan: "-" },
            { minggu: 9, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 10, materi: "Penjumlahan pecahan", jp: 8, keterangan: "-" },
            { minggu: 11, materi: "Pengurangan pecahan", jp: 8, keterangan: "-" },
            { minggu: 12, materi: "Perkalian pecahan", jp: 8, keterangan: "-" },
            { minggu: 13, materi: "Pembagian pecahan", jp: 8, keterangan: "-" },
            { minggu: 14, materi: "Desimal dan persen", jp: 8, keterangan: "-" },
            { minggu: 15, materi: "UAS", jp: 4, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review semester 1", jp: 4, keterangan: "-" },
            { minggu: 2, materi: "Mengenal bangun ruang", jp: 6, keterangan: "-" },
            { minggu: 3, materi: "Volume kubus", jp: 8, keterangan: "-" },
            { minggu: 4, materi: "Volume balok", jp: 8, keterangan: "-" },
            { minggu: 5, materi: "Soal cerita volume", jp: 8, keterangan: "-" },
            { minggu: 6, materi: "Luas permukaan kubus", jp: 8, keterangan: "-" },
            { minggu: 7, materi: "Luas permukaan balok", jp: 8, keterangan: "-" },
            { minggu: 8, materi: "UTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 9, materi: "Pengumpulan data", jp: 6, keterangan: "-" },
            { minggu: 10, materi: "Diagram batang", jp: 6, keterangan: "-" },
            { minggu: 11, materi: "Diagram lingkaran", jp: 6, keterangan: "-" },
            { minggu: 12, materi: "Mean, median, modus", jp: 8, keterangan: "-" },
            { minggu: 13, materi: "Review materi", jp: 6, keterangan: "-" },
            { minggu: 14, materi: "UAS", jp: 4, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Salam, doa, dan presensi",
            "Apersepsi: mengingat kembali materi sebelumnya",
            "Motivasi dengan menampilkan masalah kontekstual",
            "Menyampaikan tujuan pembelajaran"
        ],
        inti: [
            "Eksplorasi: Siswa mengamati masalah FPB/KPK dalam kehidupan nyata",
            "Diskusi kelompok untuk menemukan konsep",
            "Presentasi hasil diskusi",
            "Konfirmasi dan penguatan dari guru",
            "Latihan soal bertingkat (mudah-sedang-sulit)",
            "Proyek membuat diagram dari data kelas"
        ],
        penutup: [
            "Menyimpulkan materi bersama-sama",
            "Kuis formatif",
            "Refleksi pembelajaran",
            "Penugasan rumah",
            "Doa penutup"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Belum Berkembang", "Belum memahami konsep FPB/KPK"],
            ["Mulai Berkembang", "Memahami dengan banyak bantuan"],
            ["Berkembang Sesuai Harapan", "Memahami dan mengaplikasikan dengan tepat"],
            ["Sangat Berkembang", "Mampu menyelesaikan soal kompleks dan menjelaskan"]
        ],
        keterampilan: [
            ["Belum Berkembang", "Belum mampu menghitung dengan rumus"],
            ["Mulai Berkembang", "Mampu menghitung dengan bantuan"],
            ["Berkembang Sesuai Harapan", "Mampu menghitung secara mandiri"],
            ["Sangat Berkembang", "Mampu menyelesaikan masalah open-ended"]
        ],
        sikap: [
            ["Belum Berkembang", "Belum menunjukkan tanggung jawab"],
            ["Mulai Berkembang", "Mulai menunjukkan tanggung jawab"],
            ["Berkembang Sesuai Harapan", "Konsisten bertanggung jawab"],
            ["Sangat Berkembang", "Menjadi teladan tanggung jawab"]
        ]
    }
};

// Export helper function
export function getMatematikaAdminByFase(fase: string): MatematikFaseContent {
    const f = fase.toUpperCase();
    if (f.includes('A') || f.includes('1') || f.includes('2')) return MATEMATIKA_ADMIN_FASE_A;
    if (f.includes('B') || f.includes('3') || f.includes('4')) return MATEMATIKA_ADMIN_FASE_B;
    if (f.includes('C') || f.includes('5') || f.includes('6')) return MATEMATIKA_ADMIN_FASE_C;
    // Default to Fase C for now (more comprehensive)
    return MATEMATIKA_ADMIN_FASE_C;
}
