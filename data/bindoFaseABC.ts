/**
 * Bahasa Indonesia Content Bank - Fase A, B, C (SD)
 */

import { SoalBank, SoalUraian, MateriKonten, KegiatanPembelajaran } from './contentBank';

// ============ FASE A (Kelas 1-2 SD) ============
export const BAHASA_INDONESIA_FASE_A: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Huruf awal nama orang harus ditulis...", opsiA: "huruf kecil", opsiB: "huruf besar", opsiC: "huruf miring", opsiD: "huruf tebal", jawaban: "B", pembahasan: "Nama orang merupakan nama diri sehingga huruf awalnya menggunakan huruf kapital (huruf besar).", level: "C1" },
        { soal: "Kata 'bermain' berasal dari kata dasar...", opsiA: "main", opsiB: "bermain", opsiC: "mainan", opsiD: "mainkan", jawaban: "A", pembahasan: "Kata 'bermain' berasal dari kata dasar 'main' dan mendapat imbuhan ber-.", level: "C1" },
        { soal: "Andi sedang ... buku di perpustakaan.", opsiA: "makan", opsiB: "minum", opsiC: "membaca", opsiD: "bermain", jawaban: "C", pembahasan: "Buku adalah untuk dibaca. Kata yang tepat adalah 'membaca'.", level: "C2" },
        { soal: "Bunyi akhir yang sama pada kata 'topi' dan 'api' disebut...", opsiA: "suku kata", opsiB: "rima", opsiC: "huruf", opsiD: "kata", jawaban: "B", pembahasan: "Bunyi akhir yang sama (-i) pada sajak disebut rima.", level: "C1" },
        { soal: "Setiap kalimat diakhiri dengan tanda...", opsiA: "koma", opsiB: "titik", opsiC: "seru", opsiD: "petik", jawaban: "B", pembahasan: "Kalimat berita diakhiri dengan tanda titik (.).", level: "C1" },
        { soal: "Kata tanya untuk menanyakan tempat adalah...", opsiA: "apa", opsiB: "siapa", opsiC: "di mana", opsiD: "kapan", jawaban: "C", pembahasan: "'Di mana' digunakan untuk menanyakan tempat.", level: "C1" },
        { soal: "Lawan kata dari 'besar' adalah...", opsiA: "tinggi", opsiB: "panjang", opsiC: "luas", opsiD: "kecil", jawaban: "D", pembahasan: "Lawan kata (antonim) dari 'besar' adalah 'kecil'.", level: "C1" },
        { soal: "Ayah pergi ke kantor. Kata 'Ayah' dalam kalimat tersebut adalah...", opsiA: "kata kerja", opsiB: "kata benda", opsiC: "kata sifat", opsiD: "kata tanya", jawaban: "B", pembahasan: "'Ayah' adalah nama untuk orang tua laki-laki, termasuk kata benda.", level: "C2" },
        { soal: "Gabungan huruf 'n' dan 'g' menghasilkan bunyi...", opsiA: "na-ga", opsiB: "eng", opsiC: "ng", opsiD: "ne-ge", jawaban: "C", pembahasan: "'ng' adalah gabungan huruf yang menghasilkan satu bunyi.", level: "C1" },
        { soal: "Kata 'lari' jika ditambah akhiran '-an' menjadi...", opsiA: "berlari", opsiB: "larian", opsiC: "pelari", opsiD: "larikan", jawaban: "B", pembahasan: "'lari' + '-an' = 'larian'.", level: "C2" },
        { soal: "Ibu memasak di...", opsiA: "kamar tidur", opsiB: "dapur", opsiC: "ruang tamu", opsiD: "garasi", jawaban: "B", pembahasan: "Tempat untuk memasak adalah dapur.", level: "C2" },
        { soal: "Kalimat yang benar adalah...", opsiA: "ani pergi ke sekolah", opsiB: "Ani pergi ke sekolah.", opsiC: "ani pergi ke sekolah.", opsiD: "Ani pergi ke Sekolah.", jawaban: "B", pembahasan: "Kalimat yang benar: Huruf pertama kapital, nama orang kapital, diakhiri titik.", level: "C2" },
        { soal: "Persamaan kata dari 'gembira' adalah...", opsiA: "sedih", opsiB: "marah", opsiC: "senang", opsiD: "takut", jawaban: "C", pembahasan: "Sinonim (persamaan kata) dari 'gembira' adalah 'senang'.", level: "C1" },
        { soal: "Kata 'kucing' termasuk nama...", opsiA: "orang", opsiB: "hewan", opsiC: "tumbuhan", opsiD: "tempat", jawaban: "B", pembahasan: "Kucing adalah nama hewan.", level: "C1" },
        { soal: "Tanda baca yang tepat untuk kalimat tanya adalah...", opsiA: ".", opsiB: "!", opsiC: "?", opsiD: ",", jawaban: "C", pembahasan: "Kalimat tanya diakhiri dengan tanda tanya (?).", level: "C1" },
        { soal: "'Bu guru mengajar dengan sabar.' Kata 'sabar' termasuk kata...", opsiA: "benda", opsiB: "kerja", opsiC: "sifat", opsiD: "bilangan", jawaban: "C", pembahasan: "'Sabar' menjelaskan sifat seseorang, termasuk kata sifat.", level: "C2" },
        { soal: "Huruf vokal adalah...", opsiA: "b, c, d, f", opsiB: "a, i, u, e, o", opsiC: "k, l, m, n", opsiD: "p, q, r, s", jawaban: "B", pembahasan: "Huruf vokal: a, i, u, e, o.", level: "C1" },
        { soal: "Kata yang tepat: Adik ... susu setiap pagi.", opsiA: "makan", opsiB: "memakai", opsiC: "minum", opsiD: "membawa", jawaban: "C", pembahasan: "Susu adalah minuman, jadi kata yang tepat adalah 'minum'.", level: "C2" },
        { soal: "Suku kata dari 'sepeda' adalah...", opsiA: "se-pe-da", opsiB: "sep-e-da", opsiC: "se-ped-a", opsiD: "sepe-da", jawaban: "A", pembahasan: "Suku kata 'sepeda' = se-pe-da (3 suku kata).", level: "C1" },
        { soal: "Kalimat perintah diakhiri dengan tanda...", opsiA: "titik", opsiB: "tanya", opsiC: "seru", opsiD: "koma", jawaban: "C", pembahasan: "Kalimat perintah diakhiri dengan tanda seru (!).", level: "C1" }
    ],
    uraian: [
        { soal: "Tulislah 3 kalimat tentang kegiatanmu di pagi hari!", kunci: "Contoh: 1) Aku bangun tidur pukul 06.00. 2) Aku mandi dan berpakaian rapi. 3) Aku sarapan bersama keluarga.", skor: 15, level: "C3" },
        { soal: "Sebutkan 5 kata benda yang ada di dalam kelas!", kunci: "Contoh: meja, kursi, papan tulis, buku, pensil.", skor: 10, level: "C1" },
        { soal: "Tulislah nama lengkapmu dengan huruf kapital yang benar!", kunci: "Jawaban bervariasi. Yang dinilai adalah penggunaan huruf kapital di awal setiap kata nama.", skor: 10, level: "C2" },
        { soal: "Buatlah kalimat tanya menggunakan kata 'siapa'!", kunci: "Contoh: Siapa nama temanmu? Siapa yang mengajar hari ini?", skor: 15, level: "C3" },
        { soal: "Ceritakan dengan 3 kalimat tentang hewan peliharaanmu atau hewan yang kamu suka!", kunci: "Jawaban bervariasi. Dinilai: kelengkapan kalimat, penggunaan huruf kapital, dan tanda baca.", skor: 20, level: "C3" }
    ],
    materi: {
        pengertian: "Bahasa Indonesia Fase A fokus pada keterampilan membaca dan menulis dasar: mengenal huruf, suku kata, dan kalimat sederhana.",
        konsepUtama: ["Mengenal huruf dan bunyi", "Membaca suku kata dan kata", "Menulis huruf dan kata", "Membuat kalimat sederhana", "Mengenal tanda baca dasar"],
        contoh: ["Membaca nyaring cerita pendek", "Menulis nama sendiri", "Menyebutkan nama benda di sekitar"],
        rangkuman: ["Huruf vokal: a, i, u, e, o", "Huruf kapital untuk awal kalimat dan nama orang", "Kalimat diakhiri tanda titik"]
    },
    kegiatan: {
        pendahuluan: ["Bernyanyi lagu ABC", "Menyebutkan nama teman dan guru", "Membaca nama hari"],
        inti: ["Latihan menulis huruf di buku tulis", "Membaca bersama cerita bergambar", "Menyusun kata dari kartu huruf", "Bermain tebak kata"],
        penutup: ["Membaca nyaring bersama", "Menulis satu kalimat tentang hari ini", "Refleksi: huruf apa yang baru dipelajari"]
    }
};

// ============ FASE B (Kelas 3-4 SD) ============
export const BAHASA_INDONESIA_FASE_B: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Kalimat utama dalam paragraf biasanya terletak di...", opsiA: "tengah paragraf", opsiB: "awal atau akhir paragraf", opsiC: "setiap kalimat", opsiD: "tidak ada", jawaban: "B", pembahasan: "Kalimat utama (ide pokok) biasanya di awal (deduktif) atau akhir (induktif) paragraf.", level: "C1" },
        { soal: "Cerita yang tokohnya binatang dan mengandung pesan moral disebut...", opsiA: "hikayat", opsiB: "legenda", opsiC: "fabel", opsiD: "dongeng", jawaban: "C", pembahasan: "Fabel adalah cerita dengan tokoh binatang yang berperilaku seperti manusia.", level: "C1" },
        { soal: "Kata 'membeli' terdiri dari...", opsiA: "me- + beli", opsiB: "mem- + beli", opsiC: "men- + beli", opsiD: "meng- + beli", jawaban: "B", pembahasan: "'membeli' = awalan 'mem-' + kata dasar 'beli'.", level: "C2" },
        { soal: "Urutan yang benar dalam membuat surat adalah...", opsiA: "tanggal, alamat, isi, penutup", opsiB: "alamat, tanggal, isi, penutup", opsiC: "isi, tanggal, alamat, penutup", opsiD: "penutup, isi, tanggal, alamat", jawaban: "A", pembahasan: "Urutan surat: tanggal, alamat tujuan, salam pembuka, isi, penutup, nama pengirim.", level: "C2" },
        { soal: "Teks yang berisi langkah-langkah melakukan sesuatu disebut teks...", opsiA: "deskripsi", opsiB: "narasi", opsiC: "prosedur", opsiD: "eksposisi", jawaban: "C", pembahasan: "Teks prosedur berisi petunjuk atau langkah-langkah melakukan sesuatu.", level: "C1" },
        { soal: "Kalimat 'Tolong ambilkan buku itu!' termasuk kalimat...", opsiA: "berita", opsiB: "tanya", opsiC: "perintah", opsiD: "seru", jawaban: "C", pembahasan: "Kalimat yang berisi permintaan/perintah adalah kalimat perintah.", level: "C2" },
        { soal: "Imbuhan yang tepat: Ibu ... sayuran di pasar.", opsiA: "beli", opsiB: "membeli", opsiC: "dibeli", opsiD: "pembelian", jawaban: "B", pembahasan: "Subjek aktif (Ibu), jadi menggunakan kata kerja aktif 'membeli'.", level: "C2" },
        { soal: "Kata baku dari 'nasehat' adalah...", opsiA: "nasehat", opsiB: "nesihat", opsiC: "nasihat", opsiD: "nasehad", jawaban: "C", pembahasan: "Bentuk baku yang benar adalah 'nasihat'.", level: "C1" },
        { soal: "Ide pokok paragraf juga disebut...", opsiA: "kalimat penjelas", opsiB: "gagasan utama", opsiC: "kesimpulan", opsiD: "konjungsi", jawaban: "B", pembahasan: "Ide pokok = gagasan utama paragraf.", level: "C1" },
        { soal: "Penggunaan tanda koma yang benar adalah...", opsiA: "Saya membeli, apel jeruk dan mangga", opsiB: "Saya membeli apel, jeruk, dan mangga", opsiC: "Saya, membeli apel jeruk dan mangga", opsiD: "Saya membeli apel jeruk dan, mangga", jawaban: "B", pembahasan: "Koma digunakan untuk memisahkan unsur dalam perincian.", level: "C2" },
        { soal: "Tokoh utama dalam cerita disebut...", opsiA: "antagonis", opsiB: "protagonis", opsiC: "figuran", opsiD: "narator", jawaban: "B", pembahasan: "Protagonis adalah tokoh utama cerita.", level: "C1" },
        { soal: "Latar tempat dalam cerita menunjukkan...", opsiA: "kapan cerita terjadi", opsiB: "siapa tokohnya", opsiC: "di mana cerita terjadi", opsiD: "bagaimana perasaan tokoh", jawaban: "C", pembahasan: "Latar tempat menunjukkan lokasi/tempat terjadinya cerita.", level: "C1" },
        { soal: "Kalimat efektif adalah kalimat yang...", opsiA: "panjang dan rumit", opsiB: "singkat dan jelas", opsiC: "menggunakan banyak kata", opsiD: "tidak memiliki subjek", jawaban: "B", pembahasan: "Kalimat efektif adalah kalimat yang singkat, jelas, dan mudah dipahami.", level: "C1" },
        { soal: "Sinonim dari kata 'pandai' adalah...", opsiA: "bodoh", opsiB: "malas", opsiC: "pintar", opsiD: "rajin", jawaban: "C", pembahasan: "Sinonim (persamaan kata) dari 'pandai' adalah 'pintar'.", level: "C1" },
        { soal: "Antonim dari kata 'gelap' adalah...", opsiA: "redup", opsiB: "terang", opsiC: "suram", opsiD: "kelam", jawaban: "B", pembahasan: "Antonim (lawan kata) dari 'gelap' adalah 'terang'.", level: "C1" },
        { soal: "Bagian surat yang berisi 'Dengan hormat' adalah...", opsiA: "tanggal surat", opsiB: "salam pembuka", opsiC: "isi surat", opsiD: "salam penutup", jawaban: "B", pembahasan: "'Dengan hormat' adalah salam pembuka surat.", level: "C1" },
        { soal: "Kata 'penulis' terdiri dari...", opsiA: "pe- + nulis", opsiB: "pen- + tulis", opsiC: "penu- + lis", opsiD: "pe- + tulis", jawaban: "B", pembahasan: "'penulis' = 'pen-' + 'tulis'. Awalan 'pe-' berubah menjadi 'pen-' jika bertemu huruf 't'.", level: "C2" },
        { soal: "Teks yang menceritakan pengalaman pribadi disebut...", opsiA: "puisi", opsiB: "cerpen", opsiC: "karangan narasi", opsiD: "iklan", jawaban: "C", pembahasan: "Karangan narasi menceritakan pengalaman atau peristiwa.", level: "C1" },
        { soal: "Amanat dalam cerita adalah...", opsiA: "tokoh cerita", opsiB: "alur cerita", opsiC: "pesan moral cerita", opsiD: "latar cerita", jawaban: "C", pembahasan: "Amanat adalah pesan moral atau pelajaran dari cerita.", level: "C1" },
        { soal: "Kata yang tepat: Buku ini sangat ... untuk dibaca.", opsiA: "enak", opsiB: "lezat", opsiC: "menarik", opsiD: "cantik", jawaban: "C", pembahasan: "Buku dapat 'menarik' untuk dibaca. 'Enak' dan 'lezat' untuk makanan.", level: "C2" }
    ],
    uraian: [
        { soal: "Tulislah sebuah paragraf tentang pengalamanmu berlibur!", kunci: "Jawaban bervariasi. Dinilai: struktur paragraf (kalimat utama + penjelas), ejaan, dan tanda baca.", skor: 20, level: "C3" },
        { soal: "Tentukan ide pokok dari paragraf berikut: 'Kucing adalah hewan peliharaan yang lucu. Bulunya lembut dan harum. Kucing suka bermain-main dengan bola benang.'", kunci: "Ide pokok: Kucing adalah hewan peliharaan yang lucu. (Kalimat pertama adalah kalimat utama).", skor: 15, level: "C4" },
        { soal: "Buatlah kalimat menggunakan imbuhan me-kan dengan kata dasar 'bersih'!", kunci: "Contoh: Ibu membersihkan rumah setiap pagi.", skor: 15, level: "C3" },
        { soal: "Tulislah sebuah surat pendek untuk temanmu yang berisi undangan ulang tahun!", kunci: "Dinilai: kelengkapan bagian surat (tanggal, salam, isi, penutup), ejaan, dan kesopanan bahasa.", skor: 25, level: "C6" },
        { soal: "Sebutkan 3 ciri-ciri fabel dan berikan contoh judul fabel yang kamu ketahui!", kunci: "Ciri fabel: 1) Tokoh binatang, 2) Binatang berperilaku seperti manusia, 3) Ada pesan moral. Contoh: Kancil dan Buaya.", skor: 20, level: "C2" }
    ],
    materi: {
        pengertian: "Fase B mengembangkan keterampilan membaca pemahaman dan menulis paragraf, serta mengenal berbagai jenis teks.",
        konsepUtama: ["Ide pokok dan kalimat penjelas", "Unsur intrinsik cerita", "Jenis-jenis teks (narasi, deskripsi, prosedur)", "Menulis surat", "Imbuhan dan kata baku"],
        contoh: ["Membaca cerita anak", "Menulis surat untuk teman", "Membuat teks prosedur sederhana"],
        rangkuman: ["Paragraf terdiri dari kalimat utama dan penjelas", "Fabel = cerita binatang berpesan moral", "Surat memiliki struktur: tanggal, salam, isi, penutup"]
    },
    kegiatan: {
        pendahuluan: ["Membaca cerita bersama", "Diskusi tentang pengalaman membaca", "Review jenis-jenis teks"],
        inti: ["Mencari ide pokok paragraf", "Menulis paragraf deskripsi", "Bermain peran fabel", "Latihan menulis surat"],
        penutup: ["Presentasi tulisan", "Peer review", "Refleksi pembelajaran"]
    }
};

// ============ FASE C (Kelas 5-6 SD) ============
export const BAHASA_INDONESIA_FASE_C: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Struktur teks eksplanasi terdiri dari...", opsiA: "orientasi, komplikasi, resolusi", opsiB: "pernyataan umum, deretan penjelas, interpretasi", opsiC: "tesis, argumen, penegasan ulang", opsiD: "identifikasi, deskripsi bagian, simpulan", jawaban: "B", pembahasan: "Struktur teks eksplanasi: pernyataan umum, deretan penjelas, interpretasi.", level: "C1" },
        { soal: "Teks yang berisi pendapat penulis tentang suatu masalah disebut...", opsiA: "teks narasi", opsiB: "teks argumentasi", opsiC: "teks deskripsi", opsiD: "teks prosedur", jawaban: "B", pembahasan: "Teks argumentasi berisi pendapat/argumen penulis.", level: "C1" },
        { soal: "Majas yang membandingkan secara langsung menggunakan kata 'seperti' atau 'bagai' adalah...", opsiA: "metafora", opsiB: "personifikasi", opsiC: "simile", opsiD: "hiperbola", jawaban: "C", pembahasan: "Simile = perbandingan langsung dengan kata 'seperti', 'bagai', 'laksana'.", level: "C1" },
        { soal: "'Daun-daun bergoyang-goyang diterpa angin.' Kalimat ini mengandung majas...", opsiA: "hiperbola", opsiB: "personifikasi", opsiC: "simile", opsiD: "metafora", jawaban: "B", pembahasan: "Personifikasi = benda mati/tumbuhan digambarkan seperti manusia. 'Bergoyang-goyang' seolah daun bergerak sendiri.", level: "C2" },
        { soal: "Bagian penutup teks pidato biasanya berisi...", opsiA: "salam pembuka", opsiB: "isi pidato", opsiC: "ucapan terima kasih dan salam penutup", opsiD: "pendahuluan", jawaban: "C", pembahasan: "Penutup pidato berisi rangkuman, ucapan terima kasih, dan salam penutup.", level: "C1" },
        { soal: "Ciri kebahasaan teks iklan adalah...", opsiA: "kata-kata panjang dan rumit", opsiB: "bahasa persuasif dan menarik", opsiC: "banyak kata ilmiah", opsiD: "bahasa formal dan kaku", jawaban: "B", pembahasan: "Iklan menggunakan bahasa persuasif (membujuk) dan menarik perhatian.", level: "C2" },
        { soal: "Ringkasan adalah...", opsiA: "menyalin teks secara lengkap", opsiB: "menceritakan ulang dengan kata sendiri secara singkat", opsiC: "mengubah teks menjadi puisi", opsiD: "menerjemahkan teks ke bahasa lain", jawaban: "B", pembahasan: "Ringkasan = menyampaikan isi teks secara singkat dengan bahasa sendiri.", level: "C1" },
        { soal: "Kata baku dari 'sistim' adalah...", opsiA: "sistim", opsiB: "sistem", opsiC: "sisitem", opsiD: "cistim", jawaban: "B", pembahasan: "Bentuk baku yang benar adalah 'sistem'.", level: "C1" },
        { soal: "Konjungsi yang menunjukkan hubungan sebab-akibat adalah...", opsiA: "dan, serta", opsiB: "tetapi, namun", opsiC: "karena, sehingga", opsiD: "atau, maupun", jawaban: "C", pembahasan: "'Karena' dan 'sehingga' menunjukkan hubungan sebab-akibat.", level: "C2" },
        { soal: "Unsur intrinsik puisi meliputi...", opsiA: "latar belakang penyair", opsiB: "tema, rima, majas, irama", opsiC: "nama penerbit", opsiD: "tanggal penerbitan", jawaban: "B", pembahasan: "Unsur intrinsik puisi: tema, rima, majas, irama, diksi.", level: "C1" },
        { soal: "Kalimat majemuk setara ditandai dengan konjungsi...", opsiA: "karena, sebab", opsiB: "dan, tetapi, atau", opsiC: "ketika, setelah", opsiD: "supaya, agar", jawaban: "B", pembahasan: "Konjungsi majemuk setara: dan, tetapi, atau, sedangkan.", level: "C2" },
        { soal: "Drama berbeda dengan cerpen karena drama...", opsiA: "tidak memiliki tokoh", opsiB: "berbentuk dialog untuk dipentaskan", opsiC: "tidak memiliki alur", opsiD: "ditulis dalam bentuk paragraf", jawaban: "B", pembahasan: "Drama berupa dialog dan dimaksudkan untuk dipentaskan.", level: "C2" },
        { soal: "Fakta berbeda dengan opini karena fakta...", opsiA: "berdasarkan pendapat pribadi", opsiB: "dapat dibuktikan kebenarannya", opsiC: "bersifat subjektif", opsiD: "tidak dapat diperiksa", jawaban: "B", pembahasan: "Fakta dapat dibuktikan kebenarannya, opini = pendapat pribadi.", level: "C2" },
        { soal: "Kata berimbuhan dari 'baca' + 'me-' + '-kan' adalah...", opsiA: "bacakan", opsiB: "membaca", opsiC: "membacakan", opsiD: "dibacakan", jawaban: "C", pembahasan: "'me-' + 'baca' + '-kan' = 'membacakan'.", level: "C2" },
        { soal: "Poster yang bertujuan mengajak menjaga kebersihan termasuk poster...", opsiA: "komersial", opsiB: "layanan masyarakat", opsiC: "kegiatan", opsiD: "film", jawaban: "B", pembahasan: "Poster layanan masyarakat berisi ajakan untuk kepentingan umum.", level: "C1" },
        { soal: "Teks biografi menceritakan tentang...", opsiA: "kisah fiksi", opsiB: "perjalanan hidup seseorang", opsiC: "tempat wisata", opsiD: "cara membuat sesuatu", jawaban: "B", pembahasan: "Biografi = kisah hidup seseorang yang ditulis orang lain.", level: "C1" },
        { soal: "'Aku ingin menjadi dokter.' Kalimat ini menggunakan sudut pandang...", opsiA: "orang pertama", opsiB: "orang kedua", opsiC: "orang ketiga", opsiD: "tidak ada sudut pandang", jawaban: "A", pembahasan: "Kata 'aku' menunjukkan sudut pandang orang pertama.", level: "C2" },
        { soal: "Sinonim dari kata 'cerdas' adalah...", opsiA: "bodoh", opsiB: "pandai", opsiC: "malas", opsiD: "lambat", jawaban: "B", pembahasan: "Sinonim 'cerdas' = 'pandai', 'pintar'.", level: "C1" },
        { soal: "Kalimat langsung ditandai dengan...", opsiA: "kata hubung 'bahwa'", opsiB: "tanda petik", opsiC: "tanda koma saja", opsiD: "tidak ada tanda khusus", jawaban: "B", pembahasan: "Kalimat langsung diapit tanda petik (\"...\").", level: "C1" },
        { soal: "Tujuan teks eksposisi adalah...", opsiA: "menghibur pembaca", opsiB: "menjelaskan informasi", opsiC: "menceritakan kisah", opsiD: "menggambarkan objek", jawaban: "B", pembahasan: "Teks eksposisi bertujuan menjelaskan informasi secara faktual.", level: "C1" }
    ],
    uraian: [
        { soal: "Buatlah paragraf argumentasi tentang pentingnya menjaga kebersihan lingkungan!", kunci: "Dinilai: tesis (pendapat), argumen pendukung, dan kesimpulan. Contoh tesis: Kebersihan lingkungan sangat penting untuk kesehatan.", skor: 25, level: "C5" },
        { soal: "Tentukan fakta dan opini dalam kalimat: 'Indonesia memiliki 17.000 pulau dan menurut saya Indonesia adalah negara terindah.'", kunci: "Fakta: Indonesia memiliki 17.000 pulau. Opini: Indonesia adalah negara terindah.", skor: 15, level: "C4" },
        { soal: "Tulislah ringkasan dari teks berita yang berisi 5W+1H!", kunci: "Dinilai: kelengkapan unsur (What, Who, When, Where, Why, How) dan kemampuan menyingkat.", skor: 20, level: "C4" },
        { soal: "Identifikasi majas dalam puisi: 'Bulan tersenyum memandang bumi / Bintang berkedip di langit malam'", kunci: "Majas personifikasi: 'Bulan tersenyum' dan 'Bintang berkedip' – memberikan sifat manusia pada benda alam.", skor: 20, level: "C4" },
        { soal: "Buatlah naskah pidato singkat tentang peringatan Hari Kemerdekaan!", kunci: "Dinilai: struktur (pembuka, isi, penutup), bahasa persuasif, dan penggunaan kalimat yang baik.", skor: 25, level: "C6" }
    ],
    materi: {
        pengertian: "Fase C memperdalam pemahaman berbagai jenis teks, kebahasaan, dan keterampilan menulis teks yang lebih kompleks.",
        konsepUtama: ["Teks eksplanasi dan eksposisi", "Teks argumentasi", "Unsur intrinsik puisi dan prosa", "Majas dan gaya bahasa", "Fakta dan opini"],
        contoh: ["Menulis teks eksplanasi tentang proses alam", "Membuat poster layanan masyarakat", "Menulis naskah pidato"],
        rangkuman: ["Eksplanasi = menjelaskan proses", "Argumentasi = menyampaikan pendapat + bukti", "Simile = perbandingan dengan 'seperti'", "Personifikasi = benda seperti manusia"]
    },
    kegiatan: {
        pendahuluan: ["Membaca contoh teks argumentasi", "Diskusi tentang isu aktual", "Review jenis-jenis majas"],
        inti: ["Menganalisis struktur teks eksposisi", "Menulis paragraf argumentasi", "Mengidentifikasi majas dalam puisi", "Membuat poster dan iklan layanan masyarakat"],
        penutup: ["Presentasi tulisan", "Peer editing", "Refleksi dan penilaian diri"]
    }
};
