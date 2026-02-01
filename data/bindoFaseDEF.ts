/**
 * Bahasa Indonesia Content Bank - Fase D, E, F (SMP-SMA)
 */

import { SoalBank, SoalUraian, MateriKonten, KegiatanPembelajaran } from './contentBank';

// ============ FASE D (Kelas 7-9 SMP) ============
export const BAHASA_INDONESIA_FASE_D: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Struktur teks deskripsi terdiri dari...", opsiA: "tesis, argumen, simpulan", opsiB: "identifikasi, deskripsi bagian, simpulan", opsiC: "orientasi, komplikasi, resolusi", opsiD: "pernyataan umum, urutan langkah", jawaban: "B", pembahasan: "Struktur teks deskripsi: identifikasi, deskripsi bagian, simpulan/kesan.", level: "C1" },
        { soal: "Ciri kalimat langsung adalah...", opsiA: "tidak diapit tanda petik", opsiB: "diapit tanda petik", opsiC: "menggunakan kata 'bahwa'", opsiD: "tidak ada intonasi", jawaban: "B", pembahasan: "Kalimat langsung diapit tanda petik (\"..\") dan menyatakan ucapan sebenarnya.", level: "C1" },
        { soal: "Teks prosedur kompleks berbeda dengan prosedur sederhana karena...", opsiA: "tidak memiliki langkah", opsiB: "memiliki sub-langkah dan aturan tertentu", opsiC: "hanya berisi satu langkah", opsiD: "tidak memerlukan bahan", jawaban: "B", pembahasan: "Prosedur kompleks memiliki sub-langkah, syarat, dan aturan.", level: "C2" },
        { soal: "Kalimat 'Mobil dikendarai oleh ayah' termasuk kalimat...", opsiA: "aktif", opsiB: "pasif", opsiC: "majemuk", opsiD: "perintah", jawaban: "B", pembahasan: "Kalimat pasif ditandai awalan di- dan subjek dikenai pekerjaan.", level: "C2" },
        { soal: "Unsur ekstrinsik karya sastra adalah...", opsiA: "tema, alur, tokoh", opsiB: "latar, amanat", opsiC: "latar belakang penulis, nilai sosial", opsiD: "sudut pandang, penokohan", jawaban: "C", pembahasan: "Unsur ekstrinsik: hal di luar karya (biografi penulis, kondisi sosial, nilai budaya).", level: "C2" },
        { soal: "Konjungsi yang menyatakan pertentangan adalah...", opsiA: "dan, serta", opsiB: "tetapi, namun", opsiC: "karena, sebab", opsiD: "kemudian, lalu", jawaban: "B", pembahasan: "'Tetapi' dan 'namun' menyatakan pertentangan.", level: "C1" },
        { soal: "Teks berita yang baik memenuhi unsur...", opsiA: "3W", opsiB: "5W + 1H", opsiC: "ABC", opsiD: "XYZ", jawaban: "B", pembahasan: "5W+1H: What, Who, When, Where, Why, How.", level: "C1" },
        { soal: "Majas 'Rambutnya bagaikan sutra hitam' termasuk majas...", opsiA: "metafora", opsiB: "personifikasi", opsiC: "simile", opsiD: "hiperbola", jawaban: "C", pembahasan: "Simile = perbandingan dengan kata 'bagaikan', 'seperti', 'laksana'.", level: "C2" },
        { soal: "Teks ulasan berisi...", opsiA: "langkah-langkah kegiatan", opsiB: "penilaian terhadap suatu karya", opsiC: "cerita fiksi", opsiD: "deskripsi tempat", jawaban: "B", pembahasan: "Teks ulasan/resensi berisi penilaian/kritik terhadap karya.", level: "C1" },
        { soal: "Kalimat efektif memiliki ciri...", opsiA: "berbelit-belit dan panjang", opsiB: "singkat, jelas, dan tidak ambigu", opsiC: "menggunakan banyak kata asing", opsiD: "tidak perlu subjek", jawaban: "B", pembahasan: "Kalimat efektif: singkat, jelas, tidak ambigu, dan sesuai EYD.", level: "C1" },
        { soal: "Alur cerita yang dimulai dari akhir kemudian kembali ke awal disebut...", opsiA: "alur maju", opsiB: "alur mundur", opsiC: "alur campuran", opsiD: "alur datar", jawaban: "B", pembahasan: "Alur mundur (flashback) = cerita dimulai dari akhir/klimaks.", level: "C1" },
        { soal: "Kata 'memperbaiki' dibentuk dari...", opsiA: "me- + perbaiki", opsiB: "mem- + per- + baik + -i", opsiC: "memper- + baik + -i", opsiD: "me- + perba + -iki", jawaban: "B", pembahasan: "'memperbaiki' = mem- + per- + baik + -i (imbuhan gabungan).", level: "C2" },
        { soal: "Teks persuasi bertujuan untuk...", opsiA: "menghibur pembaca", opsiB: "membujuk pembaca melakukan sesuatu", opsiC: "menjelaskan proses", opsiD: "mendeskripsikan objek", jawaban: "B", pembahasan: "Persuasi = membujuk/mengajak pembaca.", level: "C1" },
        { soal: "Struktur teks cerita fantasi adalah...", opsiA: "orientasi, komplikasi, resolusi", opsiB: "tesis, argumen, simpulan", opsiC: "pernyataan umum, deretan penjelas", opsiD: "deskripsi, interpretasi", jawaban: "A", pembahasan: "Cerita fantasi = orientasi, komplikasi, resolusi (struktur naratif).", level: "C1" },
        { soal: "Fungsi kutipan dalam karya tulis adalah...", opsiA: "memperpanjang tulisan", opsiB: "memperkuat argumen dengan sumber", opsiC: "mengganti opini penulis", opsiD: "menghilangkan ide penulis", jawaban: "B", pembahasan: "Kutipan memperkuat argumen dengan sumber dan kredibilitas.", level: "C2" },
        { soal: "Kata baku dari 'aktifitas' adalah...", opsiA: "aktifitas", opsiB: "aktipitas", opsiC: "aktivitas", opsiD: "aktivitaz", jawaban: "C", pembahasan: "Bentuk baku: 'aktivitas' (bukan aktifitas).", level: "C1" },
        { soal: "Teks laporan percobaan berisi...", opsiA: "opini penulis", opsiB: "data dan hasil pengamatan ilmiah", opsiC: "cerita fiksi", opsiD: "langkah-langkah membuat makanan", jawaban: "B", pembahasan: "Laporan percobaan berisi data, hasil, dan kesimpulan ilmiah.", level: "C1" },
        { soal: "Kalimat majemuk bertingkat ditandai dengan...", opsiA: "konjungsi 'dan'", opsiB: "konjungsi 'ketika', 'karena', 'jika'", opsiC: "tidak ada penghubung", opsiD: "konjungsi 'tetapi'", jawaban: "B", pembahasan: "Majemuk bertingkat: ada anak kalimat dengan konjungsi subordinatif.", level: "C2" },
        { soal: "Cerpen adalah singkatan dari...", opsiA: "cerita panjang", opsiB: "cerita pendek", opsiC: "cerita penuh", opsiD: "cerita pertama", jawaban: "B", pembahasan: "Cerpen = cerita pendek.", level: "C1" },
        { soal: "Kalimat yang memiliki dua subjek, dua predikat, dan dihubungkan konjungsi disebut kalimat...", opsiA: "tunggal", opsiB: "majemuk", opsiC: "sederhana", opsiD: "minor", jawaban: "B", pembahasan: "Kalimat majemuk memiliki lebih dari satu klausa.", level: "C1" }
    ],
    uraian: [
        { soal: "Ubahlah kalimat langsung berikut menjadi kalimat tidak langsung: Ibu berkata, \"Aku akan pergi ke pasar.\"", kunci: "Ibu berkata bahwa ia akan pergi ke pasar.", skor: 15, level: "C3" },
        { soal: "Analisislah unsur intrinsik cerpen yang telah kamu baca (tokoh, alur, latar, tema, amanat)!", kunci: "Dinilai: kemampuan mengidentifikasi dan menjelaskan setiap unsur dengan bukti dari teks.", skor: 25, level: "C4" },
        { soal: "Buatlah teks prosedur tentang cara membuat minuman kesukaanmu!", kunci: "Dinilai: struktur (tujuan, alat/bahan, langkah-langkah), penggunaan kalimat perintah, dan urutan logis.", skor: 20, level: "C6" },
        { soal: "Tulislah paragraf persuasi untuk mengajak teman menjaga kesehatan!", kunci: "Dinilai: penggunaan kalimat ajakan, argumen yang meyakinkan, dan struktur paragraf.", skor: 20, level: "C5" },
        { soal: "Identifikasi fakta dan opini dalam teks berita yang disediakan!", kunci: "Fakta: pernyataan yang dapat dibuktikan. Opini: pendapat/penilaian subjektif.", skor: 15, level: "C4" }
    ],
    materi: {
        pengertian: "Fase D (SMP) mengembangkan keterampilan memahami dan memproduksi berbagai jenis teks dengan struktur yang lebih kompleks.",
        konsepUtama: ["Teks deskripsi, narasi, prosedur kompleks", "Unsur intrinsik dan ekstrinsik sastra", "Kalimat langsung dan tidak langsung", "Teks ulasan dan persuasi", "Kalimat majemuk"],
        contoh: ["Menulis cerpen", "Membuat resensi buku", "Menulis teks persuasi iklan"],
        rangkuman: ["Kalimat aktif: subjek melakukan, kalimat pasif: subjek dikenai", "Teks persuasi = membujuk pembaca", "Unsur ekstrinsik = di luar karya"]
    },
    kegiatan: {
        pendahuluan: ["Membaca cerpen bersama", "Diskusi tentang pengalaman membaca novel", "Review struktur teks"],
        inti: ["Menganalisis cerpen (unsur intrinsik)", "Menulis resensi buku", "Praktik mengubah kalimat langsung-tidak langsung", "Membuat teks prosedur kompleks"],
        penutup: ["Presentasi hasil karya", "Peer review", "Refleksi pembelajaran"]
    }
};

// ============ FASE E (Kelas 10 SMA) ============
export const BAHASA_INDONESIA_FASE_E: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Struktur teks negosiasi terdiri dari...", opsiA: "orientasi, pengajuan, penawaran, persetujuan, penutup", opsiB: "tesis, argumen, simpulan", opsiC: "abstrak, orientasi, komplikasi", opsiD: "judul, penulis, isi", jawaban: "A", pembahasan: "Struktur negosiasi: orientasi, pengajuan, penawaran, persetujuan, penutup.", level: "C1" },
        { soal: "Teks debat bertujuan untuk...", opsiA: "menyampaikan informasi", opsiB: "mempertahankan pendapat dengan argumen", opsiC: "menghibur penonton", opsiD: "mendeskripsikan objek", jawaban: "B", pembahasan: "Debat = mempertahankan pendapat dengan argumen yang kuat.", level: "C1" },
        { soal: "Jenis majas yang melebih-lebihkan sesuatu adalah...", opsiA: "litotes", opsiB: "hiperbola", opsiC: "simile", opsiD: "personifikasi", jawaban: "B", pembahasan: "Hiperbola = melebih-lebihkan keadaan.", level: "C1" },
        { soal: "Kalimat 'Ia bukan tidak tahu' menggunakan majas...", opsiA: "hiperbola", opsiB: "litotes", opsiC: "ironi", opsiD: "metafora", jawaban: "B", pembahasan: "Litotes = merendahkan/mengecilkan dengan negasi ganda.", level: "C2" },
        { soal: "Teks anekdot memiliki fungsi...", opsiA: "menyampaikan kritik secara humor", opsiB: "menjelaskan proses ilmiah", opsiC: "mendeskripsikan tempat", opsiD: "membujuk pembaca", jawaban: "A", pembahasan: "Anekdot = kritik sosial yang dikemas humor.", level: "C1" },
        { soal: "Struktur teks ceramah adalah...", opsiA: "pembukaan, isi, penutup", opsiB: "orientasi, komplikasi, resolusi", opsiC: "tesis, antitesis, sintesis", opsiD: "abstrak, isi, koda", jawaban: "A", pembahasan: "Ceramah: pembukaan (salam), isi (materi), penutup (simpulan).", level: "C1" },
        { soal: "Karangan ilmiah menggunakan bahasa yang bersifat...", opsiA: "emotif dan puitis", opsiB: "objektif dan lugas", opsiC: "subjektif dan personal", opsiD: "informal dan santai", jawaban: "B", pembahasan: "Karya ilmiah menggunakan bahasa objektif, lugas, dan formal.", level: "C1" },
        { soal: "Kalimat 'Tanganku gatal sekali rasanya ingin mencubit pipinya' mengandung majas...", opsiA: "sinekdoke", opsiB: "metonimia", opsiC: "hiperbola", opsiD: "personifikasi", jawaban: "C", pembahasan: "Hiperbola = 'gatal sekali' menunjukkan kesan berlebihan.", level: "C2" },
        { soal: "Teks editorial adalah teks yang berisi...", opsiA: "berita terkini", opsiB: "opini redaksi media tentang isu aktual", opsiC: "cerita fiksi", opsiD: "iklan produk", jawaban: "B", pembahasan: "Editorial = opini/pandangan redaksi terhadap isu aktual.", level: "C1" },
        { soal: "Proposisi dalam teks debat adalah...", opsiA: "kesimpulan debat", opsiB: "topik/pernyataan yang diperdebatkan", opsiC: "sanggahan", opsiD: "penutup debat", jawaban: "B", pembahasan: "Proposisi/mosi = pernyataan yang menjadi topik perdebatan.", level: "C1" },
        { soal: "Ciri teks biografi adalah...", opsiA: "menceritakan kisah fiksi", opsiB: "menceritakan perjalanan hidup tokoh nyata", opsiC: "berisi langkah-langkah", opsiD: "menggunakan sudut pandang orang pertama", jawaban: "B", pembahasan: "Biografi = perjalanan hidup tokoh nyata oleh penulis lain.", level: "C1" },
        { soal: "Kalimat 'Dia sudah lama mengembara di negeri orang' mengandung makna...", opsiA: "denotatif", opsiB: "konotatif", opsiC: "lugas", opsiD: "eksplisit", jawaban: "B", pembahasan: "'Mengembara di negeri orang' = bekerja di luar negeri (makna kiasan).", level: "C2" },
        { soal: "Tujuan teks eksposisi adalah...", opsiA: "menghibur pembaca", opsiB: "memaparkan informasi secara faktual", opsiC: "menceritakan pengalaman", opsiD: "menggambarkan objek", jawaban: "B", pembahasan: "Eksposisi = memaparkan informasi/pengetahuan secara faktual.", level: "C1" },
        { soal: "Koherensi dalam paragraf artinya...", opsiA: "kepaduan antar kalimat", opsiB: "keterkaitan antar paragraf", opsiC: "penggunaan tanda baca", opsiD: "pemilihan kata", jawaban: "A", pembahasan: "Koherensi = kepaduan makna antar kalimat dalam paragraf.", level: "C1" },
        { soal: "Kata serapan yang benar adalah...", opsiA: "analisa", opsiB: "analisis", opsiC: "analiza", opsiD: "analise", jawaban: "B", pembahasan: "Bentuk baku: 'analisis' (bukan analisa).", level: "C1" },
        { soal: "Paragraf deduktif memiliki kalimat utama di...", opsiA: "akhir paragraf", opsiB: "awal paragraf", opsiC: "tengah paragraf", opsiD: "tidak ada kalimat utama", jawaban: "B", pembahasan: "Deduktif = kalimat utama di awal, diikuti penjelas.", level: "C1" },
        { soal: "Silogisme dalam argumentasi terdiri dari...", opsiA: "premis mayor, premis minor, simpulan", opsiB: "pendahuluan, isi, penutup", opsiC: "tesis, antitesis", opsiD: "fakta dan opini", jawaban: "A", pembahasan: "Silogisme: premis mayor + premis minor = simpulan.", level: "C2" },
        { soal: "Kalimat 'Jakarta sedang berpesta' mengandung majas...", opsiA: "personifikasi", opsiB: "metonimia", opsiC: "sinekdoke", opsiD: "hiperbola", jawaban: "C", pembahasan: "Sinekdoke pars pro toto: Jakarta = penduduk Jakarta.", level: "C3" },
        { soal: "Teks prosedur protokol berbeda dengan prosedur biasa karena...", opsiA: "tidak memiliki langkah", opsiB: "langkah-langkahnya fleksibel", opsiC: "lebih panjang", opsiD: "menggunakan gambar", jawaban: "B", pembahasan: "Prosedur protokol: langkah dapat diubah urutannya (fleksibel).", level: "C2" },
        { soal: "Novel termasuk karya sastra berbentuk...", opsiA: "puisi", opsiB: "prosa", opsiC: "drama", opsiD: "pantun", jawaban: "B", pembahasan: "Novel = prosa fiksi panjang.", level: "C1" }
    ],
    uraian: [
        { soal: "Buatlah contoh negosiasi antara pembeli dan penjual tentang harga barang!", kunci: "Dinilai: struktur negosiasi, penggunaan bahasa santun, dan tercapainya kesepakatan.", skor: 25, level: "C6" },
        { soal: "Analisislah argumen pro dan kontra dalam teks debat tentang ujian nasional!", kunci: "Dinilai: kemampuan mengidentifikasi argumen kedua pihak dan memberikan evaluasi.", skor: 25, level: "C5" },
        { soal: "Tulislah paragraf eksposisi tentang pentingnya literasi digital!", kunci: "Dinilai: struktur (tesis, argumen, simpulan), fakta pendukung, dan bahasa yang objektif.", skor: 20, level: "C5" },
        { soal: "Identifikasi majas dalam puisi dan jelaskan maknanya!", kunci: "Dinilai: ketepatan identifikasi majas dan kedalaman interpretasi makna.", skor: 20, level: "C4" },
        { soal: "Buatlah resensi singkat dari novel yang pernah kamu baca!", kunci: "Dinilai: identitas buku, sinopsis, kelebihan/kekurangan, dan rekomendasi.", skor: 25, level: "C6" }
    ],
    materi: {
        pengertian: "Fase E (Kelas 10) memperdalam kemampuan berpikir kritis melalui teks argumentatif dan negosiasi.",
        konsepUtama: ["Teks negosiasi", "Teks debat", "Teks editorial", "Biografi dan autobiografi", "Majas lanjutan"],
        contoh: ["Simulasi negosiasi", "Debat kelas", "Menulis editorial tentang isu sekolah"],
        rangkuman: ["Negosiasi = tawar-menawar untuk kesepakatan", "Debat = mempertahankan argumen", "Hiperbola = melebihkan, Litotes = merendahkan"]
    },
    kegiatan: {
        pendahuluan: ["Menonton video debat", "Diskusi tentang isu sosial", "Review struktur argumentasi"],
        inti: ["Simulasi negosiasi", "Debat mini dengan topik aktual", "Menulis teks editorial", "Menganalisis biografi tokoh"],
        penutup: ["Refleksi debat", "Evaluasi argumen", "Penugasan menulis"]
    }
};

// ============ FASE F (Kelas 11-12 SMA) ============
export const BAHASA_INDONESIA_FASE_F: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Karya ilmiah yang membahas satu topik secara mendalam disebut...", opsiA: "artikel", opsiB: "makalah", opsiC: "esai", opsiD: "resensi", jawaban: "B", pembahasan: "Makalah = karya tulis yang membahas topik tertentu secara mendalam.", level: "C1" },
        { soal: "Bagian proposal yang berisi latar belakang masalah terdapat di...", opsiA: "penutup", opsiB: "pendahuluan", opsiC: "metode", opsiD: "daftar pustaka", jawaban: "B", pembahasan: "Latar belakang masalah ada di bagian pendahuluan.", level: "C1" },
        { soal: "Teks akademik menggunakan ragam bahasa...", opsiA: "informal", opsiB: "formal", opsiC: "gaul", opsiD: "daerah", jawaban: "B", pembahasan: "Teks akademik menggunakan ragam bahasa formal dan baku.", level: "C1" },
        { soal: "Kritik sastra adalah...", opsiA: "menghina karya sastra", opsiB: "penilaian terhadap karya sastra secara objektif", opsiC: "memuji karya sastra", opsiD: "menyalin karya sastra", jawaban: "B", pembahasan: "Kritik sastra = penilaian/analisis karya sastra secara objektif.", level: "C1" },
        { soal: "Esai berbeda dengan artikel ilmiah karena esai...", opsiA: "tidak memiliki struktur", opsiB: "lebih bersifat personal dan subjektif", opsiC: "tidak memiliki kesimpulan", opsiD: "harus menggunakan data statistik", jawaban: "B", pembahasan: "Esai lebih personal dan subjektif dibanding artikel ilmiah.", level: "C2" },
        { soal: "Daftar pustaka berfungsi untuk...", opsiA: "memperpanjang tulisan", opsiB: "menunjukkan sumber referensi", opsiC: "menghias tulisan", opsiD: "menggantikan isi", jawaban: "B", pembahasan: "Daftar pustaka mencantumkan sumber referensi yang digunakan.", level: "C1" },
        { soal: "Novel sejarah adalah novel yang...", opsiA: "ditulis pada zaman dulu", opsiB: "berlatar peristiwa sejarah", opsiC: "tentang penulis terkenal", opsiD: "tidak memiliki konflik", jawaban: "B", pembahasan: "Novel sejarah = novel dengan latar peristiwa sejarah.", level: "C1" },
        { soal: "Aliran sastra yang mengutamakan kebebasan berekspresi adalah...", opsiA: "klasikisme", opsiB: "romantisisme", opsiC: "realisme", opsiD: "naturalisme", jawaban: "B", pembahasan: "Romantisisme = kebebasan berekspresi dan perasaan.", level: "C2" },
        { soal: "Sistematika penulisan proposal yang benar adalah...", opsiA: "metode, latar belakang, tujuan", opsiB: "latar belakang, tujuan, metode", opsiC: "tujuan, metode, latar belakang", opsiD: "metode, tujuan, latar belakang", jawaban: "B", pembahasan: "Urutan: latar belakang, rumusan masalah, tujuan, manfaat, metode.", level: "C1" },
        { soal: "Kata serapan dari bahasa Arab adalah...", opsiA: "televisi", opsiB: "diskusi", opsiC: "ilmu", opsiD: "sistem", jawaban: "C", pembahasan: "'Ilmu' berasal dari bahasa Arab.", level: "C1" },
        { soal: "Paragraf campuran memiliki kalimat utama di...", opsiA: "awal saja", opsiB: "akhir saja", opsiC: "awal dan akhir", opsiD: "tidak ada", jawaban: "C", pembahasan: "Paragraf campuran: kalimat utama di awal dan diulang di akhir.", level: "C1" },
        { soal: "Menulis dengan mengutip langsung pernyataan sumber disebut...", opsiA: "parafrase", opsiB: "kutipan langsung", opsiC: "plagiarisme", opsiD: "ringkasan", jawaban: "B", pembahasan: "Kutipan langsung = menyalin persis dengan tanda petik.", level: "C1" },
        { soal: "Ciri drama tragedi adalah...", opsiA: "berakhir bahagia", opsiB: "berakhir menyedihkan", opsiC: "tidak ada konflik", opsiD: "hanya ada satu tokoh", jawaban: "B", pembahasan: "Tragedi = drama dengan akhir menyedihkan.", level: "C1" },
        { soal: "Pidato persuasif bertujuan untuk...", opsiA: "menghibur audiens", opsiB: "membujuk audiens melakukan sesuatu", opsiC: "menjelaskan informasi", opsiD: "menceritakan pengalaman", jawaban: "B", pembahasan: "Pidato persuasif = membujuk/mengajak audiens.", level: "C1" },
        { soal: "Sinopsis adalah...", opsiA: "penilaian karya", opsiB: "ringkasan cerita", opsiC: "biografi penulis", opsiD: "kritik sastra", jawaban: "B", pembahasan: "Sinopsis = ringkasan isi cerita/novel/film.", level: "C1" },
        { soal: "Gaya bahasa eufemisme digunakan untuk...", opsiA: "melebih-lebihkan", opsiB: "menghaluskan ungkapan", opsiC: "menyindir", opsiD: "merendahkan", jawaban: "B", pembahasan: "Eufemisme = menghaluskan ungkapan yang dianggap kasar.", level: "C2" },
        { soal: "Teks akademik harus bersifat...", opsiA: "subjektif dan emotif", opsiB: "objektif dan dapat dibuktikan", opsiC: "imajinatif dan kreatif", opsiD: "informal dan santai", jawaban: "B", pembahasan: "Teks akademik: objektif, dapat dibuktikan, dan sistematis.", level: "C1" },
        { soal: "Karangan fiksi berbeda dengan nonfiksi karena...", opsiA: "lebih pendek", opsiB: "berdasarkan imajinasi penulis", opsiC: "tidak memiliki struktur", opsiD: "menggunakan bahasa daerah", jawaban: "B", pembahasan: "Fiksi = berdasarkan imajinasi, nonfiksi = berdasarkan fakta.", level: "C1" },
        { soal: "Teknik pengembangan paragraf dengan contoh-contoh disebut...", opsiA: "definisi", opsiB: "eksemplifikasi", opsiC: "klasifikasi", opsiD: "kronologi", jawaban: "B", pembahasan: "Eksemplifikasi = pengembangan dengan memberikan contoh.", level: "C2" },
        { soal: "Pendahuluan karya ilmiah berisi...", opsiA: "hasil penelitian", opsiB: "latar belakang, rumusan masalah, tujuan", opsiC: "daftar pustaka", opsiD: "lampiran", jawaban: "B", pembahasan: "Pendahuluan: latar belakang, rumusan masalah, tujuan, manfaat.", level: "C1" }
    ],
    uraian: [
        { soal: "Buatlah kerangka proposal penelitian sederhana tentang topik yang kamu minati!", kunci: "Dinilai: kelengkapan unsur (judul, latar belakang, rumusan masalah, tujuan, metode) dan logika berpikir.", skor: 30, level: "C6" },
        { soal: "Tulislah esai argumentatif tentang dampak media sosial terhadap remaja!", kunci: "Dinilai: tesis yang jelas, argumen yang kuat, struktur esai, dan simpulan yang logis.", skor: 25, level: "C5" },
        { soal: "Analisislah unsur intrinsik dan ekstrinsik novel yang pernah kamu baca!", kunci: "Dinilai: ketepatan identifikasi unsur dan kedalaman analisis.", skor: 25, level: "C4" },
        { soal: "Buatlah kritik sastra terhadap puisi kontemporer!", kunci: "Dinilai: pemahaman teori sastra, analisis bentuk dan isi, serta objektivitas penilaian.", skor: 25, level: "C5" },
        { soal: "Tulislah ringkasan dan resensi buku nonfiksi yang relevan dengan pendidikan!", kunci: "Dinilai: ketepatan ringkasan, evaluasi kritis, dan rekomendasi.", skor: 25, level: "C6" }
    ],
    materi: {
        pengertian: "Fase F (Kelas 11-12) fokus pada keterampilan menulis akademik dan mengapresiasi karya sastra secara kritis.",
        konsepUtama: ["Karya ilmiah (makalah, proposal)", "Kritik dan esai sastra", "Menulis akademik", "Apresiasi drama dan prosa", "Pidato dan presentasi"],
        contoh: ["Menulis proposal penelitian", "Menulis esai sastra", "Presentasi makalah"],
        rangkuman: ["Karya ilmiah = sistematis, objektif, dapat dibuktikan", "Esai = tulisan personal dengan argumen", "Kritik sastra = penilaian objektif karya sastra"]
    },
    kegiatan: {
        pendahuluan: ["Review struktur karya ilmiah", "Diskusi tentang karya sastra", "Menonton presentasi akademik"],
        inti: ["Menulis proposal penelitian", "Workshop penulisan esai", "Diskusi kritik sastra", "Praktik presentasi"],
        penutup: ["Presentasi hasil karya", "Peer review", "Refleksi dan evaluasi"]
    }
};
