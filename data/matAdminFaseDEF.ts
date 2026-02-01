/**
 * Matematika Administrative Content - Fase D, E, F (SMP-SMA)
 * Complete Materials for All Document Types
 */

import { MatematikFaseContent, TujuanPembelajaran, KriteriaTercapaian, MateriProta, MateriPromes } from './matAdminFaseABC';

// ============ FASE D (Kelas 7-9 SMP) ============
export const MATEMATIKA_ADMIN_FASE_D: MatematikFaseContent = {
    capaianPembelajaran: "Peserta didik dapat menggunakan berbagai strategi untuk menyelesaikan masalah yang berkaitan dengan bilangan bulat, pecahan, desimal, persentase, perbandingan, dan proporsi. Peserta didik memahami konsep aljabar, persamaan, pertidaksamaan, fungsi, serta geometri datar dan ruang.",
    elemenCP: ["Bilangan", "Aljabar", "Pengukuran", "Geometri", "Analisis Data dan Peluang"],
    tujuanPembelajaran: [
        {
            kode: "TP.D.1",
            tujuan: "Memahami dan mengoperasikan bilangan bulat serta bilangan rasional",
            indikator: ["Melakukan operasi hitung bilangan bulat", "Melakukan operasi hitung bilangan rasional", "Menyelesaikan masalah kontekstual bilangan bulat dan rasional"],
            alokasi: "16 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.D.2",
            tujuan: "Memahami bentuk aljabar dan operasinya",
            indikator: ["Mengidentifikasi variabel, koefisien, dan konstanta", "Melakukan operasi bentuk aljabar", "Memfaktorkan bentuk aljabar"],
            alokasi: "20 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.D.3",
            tujuan: "Menyelesaikan persamaan dan pertidaksamaan linear satu variabel",
            indikator: ["Menentukan penyelesaian PLSV", "Menentukan penyelesaian PtLSV", "Menerapkan PLSV dalam masalah nyata"],
            alokasi: "16 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.D.4",
            tujuan: "Memahami konsep fungsi linear dan menggambar grafiknya",
            indikator: ["Menentukan domain, kodomain, dan range", "Membuat tabel fungsi", "Menggambar grafik fungsi linear"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.D.5",
            tujuan: "Memahami teorema Pythagoras dan penerapannya",
            indikator: ["Membuktikan teorema Pythagoras", "Menghitung panjang sisi segitiga siku-siku", "Menerapkan teorema Pythagoras dalam masalah nyata"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Gotong Royong"]
        },
        {
            kode: "TP.D.6",
            tujuan: "Menghitung luas permukaan dan volume bangun ruang sisi datar",
            indikator: ["Menghitung luas permukaan kubus, balok, prisma", "Menghitung volume kubus, balok, prisma, limas", "Menyelesaikan soal cerita bangun ruang"],
            alokasi: "16 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.D.7",
            tujuan: "Memahami statistika: mean, median, modus, dan penyajian data",
            indikator: ["Menghitung mean, median, modus data tunggal", "Menyajikan data dalam tabel dan diagram", "Menginterpretasi data statistik"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Gotong Royong"]
        },
        {
            kode: "TP.D.8",
            tujuan: "Memahami peluang kejadian sederhana",
            indikator: ["Menentukan ruang sampel", "Menghitung peluang kejadian", "Menyelesaikan masalah peluang sederhana"],
            alokasi: "10 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.D.2",
            kriteria: ["Mengidentifikasi unsur-unsur aljabar dengan benar", "Melakukan operasi aljabar dengan tepat", "Memfaktorkan bentuk aljabar dengan benar"],
            teknikAsesmen: ["Tes Tertulis", "Penugasan"],
            bentukInstrumen: ["Soal uraian", "Tugas proyek"]
        },
        {
            tpKode: "TP.D.5",
            kriteria: ["Menerapkan rumus Pythagoras dengan benar", "Menyelesaikan soal kontekstual dengan tepat"],
            teknikAsesmen: ["Tes Tertulis", "Praktik"],
            bentukInstrumen: ["Soal pilihan ganda dan uraian", "Praktik pengukuran"]
        },
        {
            tpKode: "TP.D.7",
            kriteria: ["Menghitung ukuran pemusatan data dengan benar", "Menyajikan dan menginterpretasi data dengan tepat"],
            teknikAsesmen: ["Tes Tertulis", "Proyek"],
            bentukInstrumen: ["Soal uraian", "Proyek analisis data"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Bilangan bulat dan operasinya", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 1, materi: "Bilangan rasional", alokasi: "8 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 3, materi: "Bentuk aljabar", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 2, materi: "Operasi bentuk aljabar", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "Oktober", minggu: 1, materi: "PLSV dan PtLSV", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "November", minggu: 1, materi: "Perbandingan dan skala", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "Garis dan sudut", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Februari", minggu: 1, materi: "Segitiga dan segi empat", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "Maret", minggu: 1, materi: "Teorema Pythagoras", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "April", minggu: 1, materi: "Statistika", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Mei", minggu: 1, materi: "Peluang", alokasi: "8 JP", keterangan: "-" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "MPLS", jp: 0, keterangan: "Orientasi" },
            { minggu: 2, materi: "Bilangan bulat positif dan negatif", jp: 5, keterangan: "-" },
            { minggu: 3, materi: "Operasi bilangan bulat", jp: 5, keterangan: "-" },
            { minggu: 4, materi: "Bilangan pecahan", jp: 5, keterangan: "-" },
            { minggu: 5, materi: "Operasi bilangan pecahan", jp: 5, keterangan: "-" },
            { minggu: 6, materi: "Mengenal bentuk aljabar", jp: 5, keterangan: "-" },
            { minggu: 7, materi: "Operasi penjumlahan dan pengurangan aljabar", jp: 5, keterangan: "-" },
            { minggu: 8, materi: "Operasi perkalian bentuk aljabar", jp: 5, keterangan: "-" },
            { minggu: 9, materi: "PTS", jp: 5, keterangan: "Penilaian" },
            { minggu: 10, materi: "Faktorisasi bentuk aljabar", jp: 5, keterangan: "-" },
            { minggu: 11, materi: "Persamaan linear satu variabel", jp: 5, keterangan: "-" },
            { minggu: 12, materi: "Pertidaksamaan linear satu variabel", jp: 5, keterangan: "-" },
            { minggu: 13, materi: "Penerapan PLSV dalam kehidupan", jp: 5, keterangan: "-" },
            { minggu: 14, materi: "Perbandingan senilai dan berbalik nilai", jp: 5, keterangan: "-" },
            { minggu: 15, materi: "Skala dan perbandingan", jp: 5, keterangan: "-" },
            { minggu: 16, materi: "PAS", jp: 5, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review semester 1", jp: 5, keterangan: "-" },
            { minggu: 2, materi: "Garis dan sudut", jp: 5, keterangan: "-" },
            { minggu: 3, materi: "Hubungan antar sudut", jp: 5, keterangan: "-" },
            { minggu: 4, materi: "Jenis-jenis segitiga", jp: 5, keterangan: "-" },
            { minggu: 5, materi: "Keliling dan luas segitiga", jp: 5, keterangan: "-" },
            { minggu: 6, materi: "Jenis-jenis segi empat", jp: 5, keterangan: "-" },
            { minggu: 7, materi: "Keliling dan luas segi empat", jp: 5, keterangan: "-" },
            { minggu: 8, materi: "PTS", jp: 5, keterangan: "Penilaian" },
            { minggu: 9, materi: "Teorema Pythagoras", jp: 5, keterangan: "-" },
            { minggu: 10, materi: "Penerapan Pythagoras", jp: 5, keterangan: "-" },
            { minggu: 11, materi: "Pengumpulan dan penyajian data", jp: 5, keterangan: "-" },
            { minggu: 12, materi: "Mean, median, modus", jp: 5, keterangan: "-" },
            { minggu: 13, materi: "Ruang sampel dan peluang", jp: 5, keterangan: "-" },
            { minggu: 14, materi: "Peluang kejadian", jp: 5, keterangan: "-" },
            { minggu: 15, materi: "Review materi", jp: 5, keterangan: "-" },
            { minggu: 16, materi: "PAS", jp: 5, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Guru membuka pelajaran dengan salam dan berdoa bersama",
            "Guru mengecek kehadiran dan kesiapan siswa",
            "Apersepsi: mengaitkan materi dengan pengetahuan sebelumnya",
            "Motivasi: menampilkan masalah kontekstual yang membutuhkan aljabar/geometri",
            "Menyampaikan tujuan pembelajaran dan indikator pencapaian"
        ],
        inti: [
            "Fase Orientasi: Guru menyajikan masalah kontekstual sebagai stimulus",
            "Fase Organisasi: Siswa dibagi dalam kelompok heterogen",
            "Fase Investigasi: Siswa mengeksplorasi konsep melalui LKS",
            "Fase Presentasi: Perwakilan kelompok mempresentasikan hasil",
            "Fase Analisis: Diskusi kelas untuk menganalisis berbagai strategi penyelesaian",
            "Fase Evaluasi: Guru memberikan konfirmasi dan penguatan konsep",
            "Latihan soal bertingkat untuk pendalaman",
            "Menggunakan GeoGebra atau software matematika untuk visualisasi"
        ],
        penutup: [
            "Siswa dengan bimbingan guru menyimpulkan materi",
            "Kuis formatif untuk mengecek pemahaman",
            "Refleksi: apa yang sudah dipahami dan masih perlu dipelajari",
            "Penugasan rumah yang relevan dengan materi",
            "Informasi materi pertemuan berikutnya",
            "Doa penutup dan salam"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Kurang", "Belum memahami konsep dasar, skor < 60"],
            ["Cukup", "Memahami konsep dengan bantuan, skor 60-74"],
            ["Baik", "Memahami dan menerapkan konsep, skor 75-89"],
            ["Sangat Baik", "Menguasai dan dapat mengajarkan, skor 90-100"]
        ],
        keterampilan: [
            ["Kurang", "Belum mampu menggunakan prosedur dengan benar"],
            ["Cukup", "Mampu menggunakan prosedur dengan bantuan"],
            ["Baik", "Mampu menggunakan prosedur secara mandiri"],
            ["Sangat Baik", "Mampu memodifikasi prosedur untuk masalah baru"]
        ],
        sikap: [
            ["Kurang", "Tidak menunjukkan sikap bernalar kritis"],
            ["Cukup", "Mulai menunjukkan sikap bernalar kritis"],
            ["Baik", "Konsisten menunjukkan sikap bernalar kritis"],
            ["Sangat Baik", "Menjadi teladan dalam bernalar kritis"]
        ]
    }
};

// ============ FASE E (Kelas 10 SMA) ============
export const MATEMATIKA_ADMIN_FASE_E: MatematikFaseContent = {
    capaianPembelajaran: "Peserta didik dapat menggunakan berbagai strategi dalam permasalahan yang berkaitan dengan fungsi, persamaan, pertidaksamaan, dan fungsi eksponensial serta logaritma. Peserta didik memahami konsep trigonometri, statistika, dan limit fungsi.",
    elemenCP: ["Bilangan", "Aljabar", "Pengukuran", "Geometri", "Analisis Data dan Peluang", "Kalkulus"],
    tujuanPembelajaran: [
        {
            kode: "TP.E.1",
            tujuan: "Memahami dan menganalisis fungsi eksponen dan logaritma",
            indikator: ["Menjelaskan sifat-sifat eksponen", "Menjelaskan sifat-sifat logaritma", "Menyelesaikan persamaan eksponen dan logaritma", "Menggambar grafik fungsi eksponen dan logaritma"],
            alokasi: "20 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.E.2",
            tujuan: "Memahami konsep trigonometri pada segitiga dan koordinat",
            indikator: ["Menentukan nilai perbandingan trigonometri", "Menggunakan identitas trigonometri", "Menggambar grafik fungsi trigonometri", "Menerapkan trigonometri dalam masalah nyata"],
            alokasi: "24 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.E.3",
            tujuan: "Menganalisis dan menyelesaikan sistem persamaan linear dan kuadrat",
            indikator: ["Menyelesaikan SPL dua dan tiga variabel", "Menyelesaikan persamaan kuadrat", "Menganalisis diskriminan", "Menerapkan dalam masalah kontekstual"],
            alokasi: "20 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.E.4",
            tujuan: "Memahami konsep barisan dan deret aritmetika serta geometri",
            indikator: ["Menentukan suku ke-n barisan aritmetika dan geometri", "Menghitung jumlah n suku pertama deret", "Menerapkan deret dalam masalah kontekstual"],
            alokasi: "16 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.E.5",
            tujuan: "Memahami konsep limit fungsi aljabar",
            indikator: ["Menghitung limit fungsi aljabar", "Menggunakan teorema limit", "Menentukan limit fungsi di titik tertentu"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.E.6",
            tujuan: "Memahami turunan fungsi aljabar dan penerapannya",
            indikator: ["Menentukan turunan fungsi aljabar", "Menggunakan aturan turunan", "Menentukan nilai maksimum/minimum", "Menerapkan turunan dalam masalah optimasi"],
            alokasi: "20 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.E.7",
            tujuan: "Mengolah dan menganalisis data statistika",
            indikator: ["Menghitung ukuran pemusatan data berkelompok", "Menghitung ukuran penyebaran data", "Menginterpretasi data statistik"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Gotong Royong"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.E.1",
            kriteria: ["Menerapkan sifat eksponen/logaritma dengan benar", "Menyelesaikan persamaan eksponen/logaritma", "Menggambar grafik dengan tepat"],
            teknikAsesmen: ["Tes Tertulis", "Penugasan"],
            bentukInstrumen: ["Soal uraian", "Tugas proyek grafik"]
        },
        {
            tpKode: "TP.E.2",
            kriteria: ["Menghitung nilai trigonometri dengan benar", "Menerapkan identitas trigonometri", "Menggambar grafik fungsi trigonometri"],
            teknikAsesmen: ["Tes Tertulis", "Praktik"],
            bentukInstrumen: ["Soal pilihan ganda dan uraian", "Praktik dengan busur derajat"]
        },
        {
            tpKode: "TP.E.6",
            kriteria: ["Menghitung turunan dengan benar", "Menentukan titik ekstrem", "Menyelesaikan masalah optimasi"],
            teknikAsesmen: ["Tes Tertulis", "Proyek"],
            bentukInstrumen: ["Soal uraian", "Proyek optimasi"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Eksponen dan sifat-sifatnya", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 1, materi: "Logaritma dan sifat-sifatnya", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 3, materi: "Fungsi eksponen dan logaritma", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 2, materi: "Perbandingan trigonometri", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "Oktober", minggu: 1, materi: "Identitas trigonometri", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "November", minggu: 1, materi: "Grafik fungsi trigonometri", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "SPL dua dan tiga variabel", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "Februari", minggu: 1, materi: "Persamaan kuadrat", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "Maret", minggu: 1, materi: "Barisan dan deret", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "April", minggu: 1, materi: "Limit fungsi", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Mei", minggu: 1, materi: "Turunan fungsi", alokasi: "12 JP", keterangan: "-" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "MPLS", jp: 0, keterangan: "Orientasi" },
            { minggu: 2, materi: "Bentuk pangkat", jp: 4, keterangan: "-" },
            { minggu: 3, materi: "Sifat-sifat eksponen", jp: 4, keterangan: "-" },
            { minggu: 4, materi: "Persamaan eksponen", jp: 4, keterangan: "-" },
            { minggu: 5, materi: "Bentuk logaritma", jp: 4, keterangan: "-" },
            { minggu: 6, materi: "Sifat-sifat logaritma", jp: 4, keterangan: "-" },
            { minggu: 7, materi: "Persamaan logaritma", jp: 4, keterangan: "-" },
            { minggu: 8, materi: "Grafik eksponen dan logaritma", jp: 4, keterangan: "-" },
            { minggu: 9, materi: "PTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 10, materi: "Perbandingan trigonometri sudut istimewa", jp: 4, keterangan: "-" },
            { minggu: 11, materi: "Perbandingan trigonometri sudut berelasi", jp: 4, keterangan: "-" },
            { minggu: 12, materi: "Identitas trigonometri dasar", jp: 4, keterangan: "-" },
            { minggu: 13, materi: "Rumus jumlah dan selisih sudut", jp: 4, keterangan: "-" },
            { minggu: 14, materi: "Grafik fungsi sinus dan kosinus", jp: 4, keterangan: "-" },
            { minggu: 15, materi: "Penerapan trigonometri", jp: 4, keterangan: "-" },
            { minggu: 16, materi: "PAS", jp: 4, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review semester 1", jp: 4, keterangan: "-" },
            { minggu: 2, materi: "SPLDV metode substitusi", jp: 4, keterangan: "-" },
            { minggu: 3, materi: "SPLDV metode eliminasi", jp: 4, keterangan: "-" },
            { minggu: 4, materi: "SPLTV", jp: 4, keterangan: "-" },
            { minggu: 5, materi: "Persamaan kuadrat", jp: 4, keterangan: "-" },
            { minggu: 6, materi: "Diskriminan dan akar persamaan", jp: 4, keterangan: "-" },
            { minggu: 7, materi: "Barisan aritmetika", jp: 4, keterangan: "-" },
            { minggu: 8, materi: "PTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 9, materi: "Deret aritmetika", jp: 4, keterangan: "-" },
            { minggu: 10, materi: "Barisan dan deret geometri", jp: 4, keterangan: "-" },
            { minggu: 11, materi: "Limit fungsi aljabar", jp: 4, keterangan: "-" },
            { minggu: 12, materi: "Turunan fungsi aljabar", jp: 4, keterangan: "-" },
            { minggu: 13, materi: "Turunan dan kemiringan garis singgung", jp: 4, keterangan: "-" },
            { minggu: 14, materi: "Nilai maksimum dan minimum", jp: 4, keterangan: "-" },
            { minggu: 15, materi: "Review materi", jp: 4, keterangan: "-" },
            { minggu: 16, materi: "PAS", jp: 4, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Guru mengucapkan salam dan mengajak berdoa",
            "Guru memeriksa kehadiran dan kesiapan belajar",
            "Apersepsi: review materi prasyarat yang relevan",
            "Motivasi: menampilkan aplikasi materi dalam kehidupan nyata (pertumbuhan populasi, peluruhan radioaktif, dll)",
            "Menyampaikan tujuan pembelajaran dan cakupan materi"
        ],
        inti: [
            "Stimulasi: Guru menampilkan masalah kontekstual tentang pertumbuhan/peluruhan",
            "Identifikasi Masalah: Siswa mengidentifikasi variabel dan hubungan antar variabel",
            "Pengumpulan Data: Siswa mengeksplorasi sifat-sifat eksponen/logaritma melalui LKS",
            "Pengolahan Data: Diskusi kelompok untuk menemukan pola dan hubungan",
            "Pembuktian: Siswa membuktikan sifat-sifat secara formal",
            "Generalisasi: Merumuskan konsep umum dan prosedur penyelesaian",
            "Latihan terbimbing dengan soal bertingkat",
            "Menggunakan software matematika (GeoGebra, Desmos) untuk visualisasi grafik"
        ],
        penutup: [
            "Siswa menyimpulkan pembelajaran dengan bimbingan guru",
            "Kuis singkat (5 soal) untuk mengecek pemahaman",
            "Refleksi pembelajaran: apa yang dipelajari dan bagaimana mempelajarinya",
            "Penugasan mandiri untuk pendalaman",
            "Preview materi pertemuan selanjutnya",
            "Doa dan salam penutup"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Kurang (D)", "Belum memahami konsep, skor < 60"],
            ["Cukup (C)", "Memahami konsep dasar, skor 60-74"],
            ["Baik (B)", "Memahami dan menerapkan konsep, skor 75-89"],
            ["Sangat Baik (A)", "Menguasai dan menganalisis, skor 90-100"]
        ],
        keterampilan: [
            ["Kurang", "Belum mampu menyelesaikan masalah matematika"],
            ["Cukup", "Mampu menyelesaikan masalah rutin dengan bantuan"],
            ["Baik", "Mampu menyelesaikan masalah rutin secara mandiri"],
            ["Sangat Baik", "Mampu menyelesaikan masalah non-rutin"]
        ],
        sikap: [
            ["Kurang", "Tidak menunjukkan sikap tekun dan teliti"],
            ["Cukup", "Kadang menunjukkan sikap tekun dan teliti"],
            ["Baik", "Konsisten tekun dan teliti"],
            ["Sangat Baik", "Menjadi teladan dalam ketekunan dan ketelitian"]
        ]
    }
};

// ============ FASE F (Kelas 11-12 SMA) ============
export const MATEMATIKA_ADMIN_FASE_F: MatematikFaseContent = {
    capaianPembelajaran: "Peserta didik dapat menggunakan berbagai strategi dalam permasalahan yang berkaitan dengan turunan dan integral, vektor, matriks, serta statistika dan peluang lanjutan. Peserta didik mampu menggunakan matematika untuk pemecahan masalah kompleks.",
    elemenCP: ["Bilangan", "Aljabar", "Pengukuran", "Geometri", "Analisis Data dan Peluang", "Kalkulus"],
    tujuanPembelajaran: [
        {
            kode: "TP.F.1",
            tujuan: "Memahami integral tak tentu dan tentu serta penerapannya",
            indikator: ["Menentukan integral tak tentu", "Menghitung integral tentu", "Menghitung luas daerah dengan integral", "Menghitung volume benda putar"],
            alokasi: "24 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.F.2",
            tujuan: "Memahami operasi matriks dan penerapannya",
            indikator: ["Melakukan operasi matriks", "Menentukan determinan dan invers matriks", "Menyelesaikan SPL dengan matriks", "Menerapkan matriks transformasi"],
            alokasi: "20 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        },
        {
            kode: "TP.F.3",
            tujuan: "Memahami vektor di R² dan R³ serta operasinya",
            indikator: ["Melakukan operasi vektor", "Menentukan perkalian skalar dan perkalian titik", "Menghitung panjang dan sudut vektor", "Menerapkan vektor dalam geometri"],
            alokasi: "16 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.F.4",
            tujuan: "Memahami persamaan lingkaran dan irisan kerucut",
            indikator: ["Menentukan persamaan lingkaran", "Menentukan persamaan parabola", "Menentukan persamaan elips dan hiperbola"],
            alokasi: "16 JP",
            profilPelajar: ["Bernalar Kritis", "Kreatif"]
        },
        {
            kode: "TP.F.5",
            tujuan: "Menganalisis distribusi peluang diskrit dan kontinu",
            indikator: ["Menghitung distribusi binomial", "Memahami distribusi normal", "Menerapkan distribusi dalam masalah nyata"],
            alokasi: "16 JP",
            profilPelajar: ["Bernalar Kritis", "Gotong Royong"]
        },
        {
            kode: "TP.F.6",
            tujuan: "Melakukan inferensi statistik sederhana",
            indikator: ["Memahami sampling dan estimasi", "Melakukan uji hipotesis sederhana", "Menginterpretasi hasil inferensi"],
            alokasi: "12 JP",
            profilPelajar: ["Bernalar Kritis", "Mandiri"]
        }
    ],
    kktp: [
        {
            tpKode: "TP.F.1",
            kriteria: ["Menghitung integral dengan benar", "Menentukan luas daerah dengan integral", "Menghitung volume benda putar"],
            teknikAsesmen: ["Tes Tertulis", "Proyek"],
            bentukInstrumen: ["Soal uraian", "Proyek aplikasi integral"]
        },
        {
            tpKode: "TP.F.2",
            kriteria: ["Melakukan operasi matriks dengan benar", "Menentukan determinan dan invers", "Menyelesaikan SPL dengan matriks"],
            teknikAsesmen: ["Tes Tertulis", "Penugasan"],
            bentukInstrumen: ["Soal pilihan ganda dan uraian", "Tugas pemrograman"]
        },
        {
            tpKode: "TP.F.5",
            kriteria: ["Menghitung peluang distribusi binomial", "Menggunakan tabel normal", "Menginterpretasi hasil distribusi"],
            teknikAsesmen: ["Tes Tertulis", "Proyek"],
            bentukInstrumen: ["Soal uraian", "Proyek analisis data"]
        }
    ],
    prota: [
        { semester: 1, bulan: "Juli", minggu: 3, materi: "Integral tak tentu", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "Agustus", minggu: 2, materi: "Integral tentu", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "September", minggu: 1, materi: "Aplikasi integral (luas dan volume)", alokasi: "12 JP", keterangan: "-" },
        { semester: 1, bulan: "Oktober", minggu: 1, materi: "Operasi matriks", alokasi: "10 JP", keterangan: "-" },
        { semester: 1, bulan: "November", minggu: 1, materi: "Determinan dan invers matriks", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Januari", minggu: 2, materi: "Vektor di R² dan R³", alokasi: "12 JP", keterangan: "-" },
        { semester: 2, bulan: "Februari", minggu: 2, materi: "Persamaan lingkaran dan irisan kerucut", alokasi: "14 JP", keterangan: "-" },
        { semester: 2, bulan: "Maret", minggu: 2, materi: "Distribusi binomial", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "April", minggu: 2, materi: "Distribusi normal", alokasi: "10 JP", keterangan: "-" },
        { semester: 2, bulan: "Mei", minggu: 1, materi: "Inferensi statistik", alokasi: "10 JP", keterangan: "-" }
    ],
    promes: {
        semester1: [
            { minggu: 1, materi: "MPLS", jp: 0, keterangan: "Orientasi" },
            { minggu: 2, materi: "Review turunan", jp: 4, keterangan: "-" },
            { minggu: 3, materi: "Integral sebagai anti-turunan", jp: 4, keterangan: "-" },
            { minggu: 4, materi: "Integral fungsi aljabar", jp: 4, keterangan: "-" },
            { minggu: 5, materi: "Integral substitusi", jp: 4, keterangan: "-" },
            { minggu: 6, materi: "Integral tentu", jp: 4, keterangan: "-" },
            { minggu: 7, materi: "Luas daerah dengan integral", jp: 4, keterangan: "-" },
            { minggu: 8, materi: "Volume benda putar", jp: 4, keterangan: "-" },
            { minggu: 9, materi: "PTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 10, materi: "Pengertian dan notasi matriks", jp: 4, keterangan: "-" },
            { minggu: 11, materi: "Operasi matriks", jp: 4, keterangan: "-" },
            { minggu: 12, materi: "Determinan matriks 2x2 dan 3x3", jp: 4, keterangan: "-" },
            { minggu: 13, materi: "Invers matriks", jp: 4, keterangan: "-" },
            { minggu: 14, materi: "SPL dengan matriks", jp: 4, keterangan: "-" },
            { minggu: 15, materi: "Transformasi geometri dengan matriks", jp: 4, keterangan: "-" },
            { minggu: 16, materi: "PAS", jp: 4, keterangan: "Penilaian" }
        ],
        semester2: [
            { minggu: 1, materi: "Review semester 1", jp: 4, keterangan: "-" },
            { minggu: 2, materi: "Vektor di R²", jp: 4, keterangan: "-" },
            { minggu: 3, materi: "Vektor di R³", jp: 4, keterangan: "-" },
            { minggu: 4, materi: "Hasil kali skalar dan hasil kali titik", jp: 4, keterangan: "-" },
            { minggu: 5, materi: "Persamaan lingkaran", jp: 4, keterangan: "-" },
            { minggu: 6, materi: "Persamaan parabola", jp: 4, keterangan: "-" },
            { minggu: 7, materi: "Elips dan hiperbola", jp: 4, keterangan: "-" },
            { minggu: 8, materi: "PTS", jp: 4, keterangan: "Penilaian" },
            { minggu: 9, materi: "Distribusi binomial", jp: 4, keterangan: "-" },
            { minggu: 10, materi: "Nilai harapan dan variansi", jp: 4, keterangan: "-" },
            { minggu: 11, materi: "Distribusi normal", jp: 4, keterangan: "-" },
            { minggu: 12, materi: "Tabel z dan aplikasinya", jp: 4, keterangan: "-" },
            { minggu: 13, materi: "Sampling dan estimasi", jp: 4, keterangan: "-" },
            { minggu: 14, materi: "Uji hipotesis sederhana", jp: 4, keterangan: "-" },
            { minggu: 15, materi: "Review materi", jp: 4, keterangan: "-" },
            { minggu: 16, materi: "PAS", jp: 4, keterangan: "Penilaian" }
        ]
    },
    kegiatanPembelajaran: {
        pendahuluan: [
            "Guru mengucapkan salam dan memimpin doa",
            "Memeriksa kehadiran dan kesiapan siswa",
            "Apersepsi: mengaitkan dengan materi prasyarat (turunan untuk integral)",
            "Motivasi: menampilkan aplikasi integral dalam fisika, ekonomi, teknik",
            "Menyampaikan tujuan pembelajaran dan indikator keberhasilan"
        ],
        inti: [
            "Fase Orientasi: Guru menyajikan masalah kontekstual (menghitung luas tak beraturan)",
            "Fase Perumusan: Siswa merumuskan hipotesis tentang hubungan turunan dan integral",
            "Fase Eksplorasi: Siswa mengeksplorasi konsep anti-turunan melalui investigasi",
            "Fase Pembuktian: Siswa membuktikan teorema dasar kalkulus",
            "Fase Aplikasi: Menerapkan integral untuk menghitung luas dan volume",
            "Latihan soal dengan tingkat kesulitan bertingkat",
            "Menggunakan software CAS (Computer Algebra System) untuk verifikasi",
            "Presentasi hasil kerja kelompok"
        ],
        penutup: [
            "Siswa menyimpulkan materi dengan peta konsep",
            "Kuis formatif untuk mengecek pemahaman",
            "Refleksi: strategi belajar yang efektif untuk materi ini",
            "Penugasan mandiri: soal aplikasi integral",
            "Informasi persiapan pertemuan selanjutnya",
            "Doa dan salam penutup"
        ]
    },
    rubrikPenilaian: {
        pengetahuan: [
            ["Kurang (D)", "Belum menguasai konsep, skor < 60"],
            ["Cukup (C)", "Menguasai konsep dasar, skor 60-74"],
            ["Baik (B)", "Menguasai dan menerapkan konsep, skor 75-89"],
            ["Sangat Baik (A)", "Menguasai, menerapkan, dan menganalisis, skor 90-100"]
        ],
        keterampilan: [
            ["Kurang", "Belum mampu menyelesaikan masalah matematika tingkat lanjut"],
            ["Cukup", "Mampu menyelesaikan masalah rutin dengan panduan"],
            ["Baik", "Mampu menyelesaikan masalah rutin dan semi-kompleks"],
            ["Sangat Baik", "Mampu menyelesaikan masalah kompleks dan mengembangkan strategi baru"]
        ],
        sikap: [
            ["Kurang", "Tidak menunjukkan ketekunan dan kreativitas"],
            ["Cukup", "Kadang menunjukkan ketekunan dan kreativitas"],
            ["Baik", "Konsisten menunjukkan ketekunan dan kreativitas"],
            ["Sangat Baik", "Menjadi inspirasi dalam ketekunan dan kreativitas"]
        ]
    }
};

// Export helper function
export function getMatematikaAdminByFase(fase: string): MatematikFaseContent {
    const f = fase.toUpperCase();
    if (f.includes('A') || f.includes('1') || f.includes('2')) {
        // Import dynamically to avoid circular dependency
        const { MATEMATIKA_ADMIN_FASE_A } = require('./matAdminFaseABC');
        return MATEMATIKA_ADMIN_FASE_A;
    }
    if (f.includes('B') || f.includes('3') || f.includes('4')) {
        const { MATEMATIKA_ADMIN_FASE_B } = require('./matAdminFaseABC');
        return MATEMATIKA_ADMIN_FASE_B;
    }
    if (f.includes('C') || f.includes('5') || f.includes('6')) {
        const { MATEMATIKA_ADMIN_FASE_C } = require('./matAdminFaseABC');
        return MATEMATIKA_ADMIN_FASE_C;
    }
    if (f.includes('D') || f.includes('7') || f.includes('8') || f.includes('9') || f.includes('SMP')) {
        return MATEMATIKA_ADMIN_FASE_D;
    }
    if (f.includes('E') || f.includes('10') || f.includes('X')) {
        return MATEMATIKA_ADMIN_FASE_E;
    }
    if (f.includes('F') || f.includes('11') || f.includes('12') || f.includes('XI') || f.includes('XII')) {
        return MATEMATIKA_ADMIN_FASE_F;
    }
    return MATEMATIKA_ADMIN_FASE_D; // Default to SMP
}
