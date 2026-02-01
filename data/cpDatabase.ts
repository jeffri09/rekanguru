/**
 * Database Capaian Pembelajaran (CP) Resmi Kurikulum Merdeka
 * Sumber: Kemendikbudristek RI
 */

export interface CPData {
    fase: string;
    mapel: string;
    elemen: string;
    capaian: string;
    tujuanPembelajaran: string[];
}

// 8 Dimensi Profil Pelajar Pancasila (Deep Learning)
export const PROFIL_PELAJAR_PANCASILA = [
    {
        dimensi: "Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia",
        deskripsi: "Peserta didik Indonesia yang beriman dan bertakwa kepada Tuhan YME serta berakhlak mulia dalam hubungannya dengan Tuhan Yang Maha Esa, diri sendiri, sesama manusia, dan alam."
    },
    {
        dimensi: "Berkebinekaan Global",
        deskripsi: "Peserta didik mempertahankan budaya luhur, lokalitas dan identitasnya, dan tetap berpikiran terbuka dalam berinteraksi dengan budaya lain."
    },
    {
        dimensi: "Bergotong Royong",
        deskripsi: "Peserta didik memiliki kemampuan bergotong royong, yaitu kemampuan untuk melakukan kegiatan secara bersama-sama dengan suka rela."
    },
    {
        dimensi: "Mandiri",
        deskripsi: "Peserta didik secara independen mampu merefleksi dan mengevaluasi dirinya sendiri serta kebutuhannya."
    },
    {
        dimensi: "Bernalar Kritis",
        deskripsi: "Peserta didik mampu secara objektif memproses informasi baik kualitatif maupun kuantitatif, membangun keterkaitan, dan menganalisis informasi."
    },
    {
        dimensi: "Kreatif",
        deskripsi: "Peserta didik mampu memodifikasi dan menghasilkan sesuatu yang orisinal, bermakna, bermanfaat, dan berdampak."
    }
];

// Struktur Rubrik Penilaian Standar 4 Level
export const RUBRIK_STANDAR = {
    levels: [
        { level: 1, nama: "Mulai Berkembang", rentang: "0-25%" },
        { level: 2, nama: "Sedang Berkembang", rentang: "26-50%" },
        { level: 3, nama: "Berkembang Sesuai Harapan", rentang: "51-75%" },
        { level: 4, nama: "Sangat Berkembang", rentang: "76-100%" }
    ]
};

// Database CP per Fase dan Mata Pelajaran
export const CP_DATABASE: CPData[] = [
    // ===================== FASE A (Kelas 1-2 SD) =====================
    {
        fase: "Fase A (Kelas 1-2 SD)",
        mapel: "Bahasa Indonesia",
        elemen: "Menyimak",
        capaian: "Peserta didik mampu bersikap menjadi pendengar yang penuh perhatian. Peserta didik menunjukkan minat pada tuturan yang didengar serta mampu memahami pesan lisan dan informasi dari media audio.",
        tujuanPembelajaran: [
            "Menyimak dengan penuh perhatian",
            "Memahami pesan lisan sederhana",
            "Merespons tuturan dengan tepat"
        ]
    },
    {
        fase: "Fase A (Kelas 1-2 SD)",
        mapel: "Bahasa Indonesia",
        elemen: "Membaca dan Memirsa",
        capaian: "Peserta didik mampu memahami informasi dari bacaan dan tayangan yang dipirsa tentang diri dan lingkungan, narasi imajinatif, dan puisi anak.",
        tujuanPembelajaran: [
            "Membaca nyaring dengan lafal yang tepat",
            "Memahami isi teks bacaan sederhana",
            "Menceritakan kembali isi bacaan"
        ]
    },
    {
        fase: "Fase A (Kelas 1-2 SD)",
        mapel: "Matematika",
        elemen: "Bilangan",
        capaian: "Peserta didik dapat membaca, menulis, dan membandingkan bilangan cacah sampai 100, serta mengurutkan dan menyusun bilangan.",
        tujuanPembelajaran: [
            "Membaca dan menulis bilangan 1-100",
            "Membandingkan dua bilangan",
            "Mengurutkan bilangan dari terkecil/terbesar"
        ]
    },
    {
        fase: "Fase A (Kelas 1-2 SD)",
        mapel: "Matematika",
        elemen: "Operasi Hitung",
        capaian: "Peserta didik dapat melakukan penjumlahan dan pengurangan bilangan cacah sampai 100.",
        tujuanPembelajaran: [
            "Menjumlahkan dua bilangan",
            "Mengurangkan dua bilangan",
            "Menyelesaikan soal cerita penjumlahan dan pengurangan"
        ]
    },
    {
        fase: "Fase A (Kelas 1-2 SD)",
        mapel: "IPAS",
        elemen: "Makhluk Hidup",
        capaian: "Peserta didik mengamati dan mengidentifikasi bagian-bagian tubuh manusia serta fungsinya, dan mendeskripsikan kebutuhan hidup makhluk hidup.",
        tujuanPembelajaran: [
            "Mengidentifikasi bagian tubuh dan fungsinya",
            "Menyebutkan kebutuhan hidup makhluk hidup",
            "Membedakan makhluk hidup dan benda mati"
        ]
    },

    // ===================== FASE B (Kelas 3-4 SD) =====================
    {
        fase: "Fase B (Kelas 3-4 SD)",
        mapel: "Bahasa Indonesia",
        elemen: "Menyimak",
        capaian: "Peserta didik mampu memahami ide pokok (gagasan) suatu pesan lisan, informasi dari media audio, dan teks aural.",
        tujuanPembelajaran: [
            "Menentukan ide pokok dari teks yang didengar",
            "Menyimpulkan informasi dari audio",
            "Merespons pertanyaan tentang isi tuturan"
        ]
    },
    {
        fase: "Fase B (Kelas 3-4 SD)",
        mapel: "Matematika",
        elemen: "Bilangan",
        capaian: "Peserta didik dapat membaca, menulis, dan membandingkan bilangan cacah sampai 10.000 dan pecahan sederhana.",
        tujuanPembelajaran: [
            "Membaca dan menulis bilangan sampai 10.000",
            "Memahami nilai tempat bilangan",
            "Memahami pecahan sederhana"
        ]
    },
    {
        fase: "Fase B (Kelas 3-4 SD)",
        mapel: "Matematika",
        elemen: "Geometri",
        capaian: "Peserta didik dapat mengenal bangun datar dan bangun ruang serta sifat-sifatnya.",
        tujuanPembelajaran: [
            "Mengidentifikasi bangun datar",
            "Menghitung keliling dan luas bangun datar sederhana",
            "Mengenal bangun ruang sederhana"
        ]
    },
    {
        fase: "Fase B (Kelas 3-4 SD)",
        mapel: "IPAS",
        elemen: "Energi dan Perubahannya",
        capaian: "Peserta didik mengidentifikasi sumber energi, bentuk energi, dan perubahan bentuk energi dalam kehidupan sehari-hari.",
        tujuanPembelajaran: [
            "Mengidentifikasi sumber energi",
            "Menjelaskan perubahan bentuk energi",
            "Menerapkan penghematan energi"
        ]
    },

    // ===================== FASE C (Kelas 5-6 SD) =====================
    {
        fase: "Fase C (Kelas 5-6 SD)",
        mapel: "Bahasa Indonesia",
        elemen: "Menulis",
        capaian: "Peserta didik mampu menulis teks eksposisi, teks prosedur, dan teks cerita dengan benar sesuai kaidah kebahasaan.",
        tujuanPembelajaran: [
            "Menulis teks eksposisi dengan struktur yang tepat",
            "Menyusun teks prosedur secara sistematis",
            "Mengembangkan cerita dengan alur yang jelas"
        ]
    },
    {
        fase: "Fase C (Kelas 5-6 SD)",
        mapel: "Matematika",
        elemen: "Bilangan",
        capaian: "Peserta didik dapat membaca, menulis, dan membandingkan bilangan cacah sampai 1.000.000, pecahan, dan desimal.",
        tujuanPembelajaran: [
            "Operasi hitung bilangan besar",
            "Mengonversi pecahan ke desimal",
            "Menyelesaikan masalah bilangan dalam kehidupan"
        ]
    },
    {
        fase: "Fase C (Kelas 5-6 SD)",
        mapel: "IPAS",
        elemen: "Sistem dalam Tubuh Manusia",
        capaian: "Peserta didik menjelaskan sistem organ pada manusia dan menghubungkannya dengan kesehatan.",
        tujuanPembelajaran: [
            "Menjelaskan sistem pencernaan manusia",
            "Menjelaskan sistem pernapasan manusia",
            "Menerapkan pola hidup sehat"
        ]
    },

    // ===================== FASE D (Kelas 7-9 SMP) =====================
    {
        fase: "Fase D (SMP Kelas 7-9)",
        mapel: "Bahasa Indonesia",
        elemen: "Membaca",
        capaian: "Peserta didik mampu menganalisis dan menginterpretasi teks sastra dan teks informasional secara kritis.",
        tujuanPembelajaran: [
            "Menganalisis struktur teks",
            "Mengidentifikasi unsur intrinsik dan ekstrinsik",
            "Memberikan tanggapan kritis terhadap teks"
        ]
    },
    {
        fase: "Fase D (SMP Kelas 7-9)",
        mapel: "Matematika",
        elemen: "Aljabar",
        capaian: "Peserta didik dapat memahami dan menerapkan konsep aljabar termasuk persamaan dan pertidaksamaan linear.",
        tujuanPembelajaran: [
            "Menyelesaikan persamaan linear satu variabel",
            "Menyelesaikan sistem persamaan linear dua variabel",
            "Menerapkan aljabar dalam pemecahan masalah"
        ]
    },
    {
        fase: "Fase D (SMP Kelas 7-9)",
        mapel: "IPA",
        elemen: "Sistem Organisasi Kehidupan",
        capaian: "Peserta didik dapat menjelaskan keterkaitan antara struktur dan fungsi jaringan, organ, dan sistem organ.",
        tujuanPembelajaran: [
            "Menjelaskan struktur sel",
            "Membedakan jaringan tumbuhan dan hewan",
            "Menganalisis sistem organ manusia"
        ]
    },

    // ===================== FASE E (Kelas 10 SMA) =====================
    {
        fase: "Fase E (SMA Kelas 10)",
        mapel: "Bahasa Indonesia",
        elemen: "Menulis",
        capaian: "Peserta didik mampu menulis teks akademik dan nonakademik dengan menggunakan ragam bahasa yang tepat.",
        tujuanPembelajaran: [
            "Menulis teks argumentasi",
            "Menyusun makalah sederhana",
            "Menulis teks eksposisi ilmiah"
        ]
    },
    {
        fase: "Fase E (SMA Kelas 10)",
        mapel: "Matematika",
        elemen: "Fungsi",
        capaian: "Peserta didik dapat memahami konsep fungsi linear, kuadrat, dan eksponensial serta penerapannya.",
        tujuanPembelajaran: [
            "Menganalisis fungsi linear dan grafiknya",
            "Menyelesaikan persamaan kuadrat",
            "Menerapkan fungsi dalam pemodelan"
        ]
    },

    // ===================== FASE F (Kelas 11-12 SMA) =====================
    {
        fase: "Fase F (SMA Kelas 11-12)",
        mapel: "Bahasa Indonesia",
        elemen: "Menulis",
        capaian: "Peserta didik mampu menghasilkan karya tulis ilmiah dan karya sastra dengan memperhatikan struktur, kaidah kebahasaan, dan konteks.",
        tujuanPembelajaran: [
            "Menyusun karya tulis ilmiah",
            "Menulis kritik dan esai",
            "Menghasilkan karya sastra orisinal"
        ]
    },
    {
        fase: "Fase F (SMA Kelas 11-12)",
        mapel: "Matematika",
        elemen: "Kalkulus",
        capaian: "Peserta didik dapat memahami konsep limit, turunan, dan integral serta penerapannya.",
        tujuanPembelajaran: [
            "Menghitung limit fungsi",
            "Menentukan turunan fungsi",
            "Menghitung integral tak tentu dan tentu"
        ]
    }
];

// Helper function to get CP by Fase and Mapel
export function getCPByFaseAndMapel(fase: string, mapel: string): CPData[] {
    return CP_DATABASE.filter(cp =>
        cp.fase.includes(fase.replace("Fase ", "")) &&
        cp.mapel.toLowerCase().includes(mapel.toLowerCase())
    );
}

// Helper to get all available Elemen for a Fase/Mapel combination
export function getElemenByFaseAndMapel(fase: string, mapel: string): string[] {
    const cps = getCPByFaseAndMapel(fase, mapel);
    return [...new Set(cps.map(cp => cp.elemen))];
}

// Get specific CP data
export function getSpecificCP(fase: string, mapel: string, elemen: string): CPData | undefined {
    return CP_DATABASE.find(cp =>
        cp.fase.includes(fase.replace("Fase ", "")) &&
        cp.mapel.toLowerCase().includes(mapel.toLowerCase()) &&
        cp.elemen.toLowerCase() === elemen.toLowerCase()
    );
}
