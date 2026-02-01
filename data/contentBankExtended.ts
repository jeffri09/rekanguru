/**
 * Content Bank Extended - Bahasa Indonesia & IPA
 */

import { SoalBank, SoalUraian, MateriKonten, KegiatanPembelajaran } from './contentBank';

// ============ BAHASA INDONESIA - TEKS DESKRIPSI ============
export const BAHASA_INDONESIA_TEKS: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Teks deskripsi adalah teks yang berisi...", opsiA: "urutan peristiwa", opsiB: "gambaran suatu objek", opsiC: "langkah-langkah kegiatan", opsiD: "pendapat penulis", jawaban: "B", pembahasan: "Teks deskripsi menggambarkan suatu objek secara rinci sehingga pembaca seolah-olah dapat melihat, mendengar, atau merasakan objek tersebut.", level: "C1" },
        { soal: "Ciri kebahasaan teks deskripsi adalah...", opsiA: "kata kerja aksi", opsiB: "kata sifat", opsiC: "konjungsi waktu", opsiD: "kata ajakan", jawaban: "B", pembahasan: "Teks deskripsi banyak menggunakan kata sifat (adjektiva) untuk menggambarkan objek, seperti: indah, besar, cantik.", level: "C2" },
        { soal: "Struktur teks deskripsi yang tepat adalah...", opsiA: "tesis, argumen, simpulan", opsiB: "orientasi, komplikasi, resolusi", opsiC: "identifikasi, deskripsi bagian, simpulan", opsiD: "pernyataan umum, urutan langkah", jawaban: "C", pembahasan: "Struktur teks deskripsi: identifikasi (pengenalan objek), deskripsi bagian (penggambaran detail), dan simpulan/kesan.", level: "C2" },
        { soal: "'Bunga mawar itu berwarna merah menyala dengan kelopak yang lembut.' Kalimat tersebut termasuk bagian...", opsiA: "identifikasi", opsiB: "deskripsi bagian", opsiC: "simpulan", opsiD: "orientasi", jawaban: "B", pembahasan: "Kalimat tersebut menggambarkan detail objek (bunga mawar), sehingga termasuk deskripsi bagian.", level: "C3" },
        { soal: "Kata 'indah', 'sejuk', dan 'harum' termasuk jenis kata...", opsiA: "kata kerja", opsiB: "kata benda", opsiC: "kata sifat", opsiD: "kata keterangan", jawaban: "C", pembahasan: "Indah, sejuk, harum adalah kata sifat (adjektiva) yang menggambarkan keadaan.", level: "C1" },
        { soal: "Berikut yang bukan ciri teks deskripsi adalah...", opsiA: "menggambarkan objek", opsiB: "menggunakan kata sifat", opsiC: "berisi langkah-langkah", opsiD: "melibatkan pancaindra", jawaban: "C", pembahasan: "Teks yang berisi langkah-langkah adalah teks prosedur, bukan teks deskripsi.", level: "C2" },
        { soal: "Tujuan teks deskripsi adalah...", opsiA: "meyakinkan pembaca", opsiB: "menghibur pembaca", opsiC: "menggambarkan objek secara rinci", opsiD: "menceritakan pengalaman", jawaban: "C", pembahasan: "Tujuan utama teks deskripsi adalah menggambarkan atau melukiskan objek secara rinci.", level: "C1" },
        { soal: "Penggunaan majas dalam teks deskripsi berfungsi untuk...", opsiA: "mempersingkat kalimat", opsiB: "memperjelas dan memperindah gambaran", opsiC: "mengurangi kata sifat", opsiD: "membuat teks lebih formal", jawaban: "B", pembahasan: "Majas (gaya bahasa) digunakan untuk memperjelas gambaran dan memperindah bahasa.", level: "C2" },
        { soal: "'Rambutnya sehitam arang.' Kalimat tersebut menggunakan majas...", opsiA: "metafora", opsiB: "personifikasi", opsiC: "simile", opsiD: "hiperbola", jawaban: "C", pembahasan: "Simile adalah perbandingan menggunakan kata 'seperti', 'bagai', 'se-'. 'Sehitam arang' = 'hitam seperti arang'.", level: "C2" },
        { soal: "Objek yang dapat dideskripsikan adalah...", opsiA: "hanya benda mati", opsiB: "hanya makhluk hidup", opsiC: "hanya tempat wisata", opsiD: "benda, orang, tempat, hewan", jawaban: "D", pembahasan: "Teks deskripsi dapat menggambarkan berbagai objek: benda, orang, tempat, hewan, tumbuhan, dll.", level: "C1" },
        { soal: "Paragraf deskripsi yang baik memiliki...", opsiA: "kalimat perintah", opsiB: "kalimat utama dan penjelas", opsiC: "angka dan statistik", opsiD: "kutipan ahli", jawaban: "B", pembahasan: "Paragraf yang baik memiliki kalimat utama (ide pokok) dan kalimat penjelas (detail pendukung).", level: "C2" },
        { soal: "'Pantai Kuta sangat indah.' Kalimat ini perlu dikembangkan dengan...", opsiA: "menambah argumen", opsiB: "menambah detail pancaindra", opsiC: "mengubah menjadi narasi", opsiD: "menghapus kata sifat", jawaban: "B", pembahasan: "Kalimat deskripsi perlu detail pancaindra: apa yang dilihat, didengar, dirasakan, dll.", level: "C3" },
        { soal: "Langkah pertama menulis teks deskripsi adalah...", opsiA: "menulis simpulan", opsiB: "menentukan objek yang akan dideskripsikan", opsiC: "menulis dengan majas", opsiD: "membuat paragraf penutup", jawaban: "B", pembahasan: "Langkah pertama adalah menentukan objek, lalu mengamati, mencatat detail, dan menulis.", level: "C2" },
        { soal: "Sudut pandang dalam teks deskripsi umumnya menggunakan...", opsiA: "kata ganti 'aku'", opsiB: "kata ganti 'kamu'", opsiC: "kata ganti 'dia' atau objek langsung", opsiD: "kata ganti 'kita'", jawaban: "C", pembahasan: "Teks deskripsi fokus pada objek, sehingga menggunakan kata ganti orang ketiga atau menyebut objek langsung.", level: "C2" },
        { soal: "Kalimat 'Kucing itu berbulu putih bersih seperti kapas' memiliki makna...", opsiA: "kucing terbuat dari kapas", opsiB: "bulu kucing sangat putih dan lembut", opsiC: "kucing tidak memiliki bulu", opsiD: "kapas berwarna seperti kucing", jawaban: "B", pembahasan: "Majas simile 'seperti kapas' menggambarkan bulu yang sangat putih dan lembut.", level: "C3" },
        { soal: "Ejaan yang benar untuk mendeskripsikan warna adalah...", opsiA: "hijau-tua", opsiB: "hijau tua", opsiC: "Hijau Tua", opsiD: "HIJAU TUA", jawaban: "B", pembahasan: "Gabungan kata sifat warna tidak menggunakan tanda hubung: hijau tua, merah muda, biru laut.", level: "C1" },
        { soal: "Paragraf deskripsi spasial menggambarkan objek berdasarkan...", opsiA: "urutan waktu", opsiB: "urutan tempat/ruang", opsiC: "urutan sebab-akibat", opsiD: "urutan penting", jawaban: "B", pembahasan: "Deskripsi spasial menggambarkan objek berdasarkan tata ruang: dari depan ke belakang, atas ke bawah, dll.", level: "C2" },
        { soal: "Kata penghubung yang tepat untuk mendeskripsikan bagian objek adalah...", opsiA: "karena, sebab", opsiB: "kemudian, lalu", opsiC: "di bagian, pada, di sebelah", opsiD: "oleh karena itu", jawaban: "C", pembahasan: "Kata 'di bagian', 'pada', 'di sebelah' menunjukkan posisi/letak dalam deskripsi.", level: "C2" },
        { soal: "Teks deskripsi objektif berbeda dengan subjektif karena...", opsiA: "tidak menggambarkan objek", opsiB: "tidak mencampurkan pendapat penulis", opsiC: "hanya berisi opini", opsiD: "menggunakan bahasa puitis", jawaban: "B", pembahasan: "Deskripsi objektif menggambarkan objek apa adanya tanpa opini, sedangkan subjektif melibatkan kesan penulis.", level: "C4" },
        { soal: "Kegiatan menyunting teks deskripsi meliputi...", opsiA: "mengubah jenis teks", opsiB: "memperbaiki ejaan, tanda baca, dan pilihan kata", opsiC: "menghapus semua kata sifat", opsiD: "menambah narasi", jawaban: "B", pembahasan: "Menyunting adalah memperbaiki kesalahan ejaan, tanda baca, struktur kalimat, dan pilihan kata.", level: "C2" }
    ],
    uraian: [
        { soal: "Jelaskan perbedaan antara teks deskripsi objektif dan teks deskripsi subjektif! Berikan contoh masing-masing!", kunci: "Teks deskripsi objektif menggambarkan objek secara faktual tanpa opini penulis. Contoh: 'Gedung ini memiliki 10 lantai.' Teks deskripsi subjektif melibatkan kesan/pendapat penulis. Contoh: 'Gedung ini sangat megah dan menakjubkan.'", skor: 20, level: "C4" },
        { soal: "Buatlah paragraf deskripsi tentang ruang kelasmu! Gunakan minimal 3 kata sifat dan 1 majas!", kunci: "Contoh: Ruang kelas kami terletak di lantai dua gedung utama. Ruangan ini cukup luas dengan dinding berwarna krem yang bersih. Di bagian depan terdapat papan tulis putih yang mengkilap seperti cermin. Bangku-bangku kayu tersusun rapi menghadap meja guru. Jendela-jendela besar membuat ruangan terasa terang dan sejuk.", skor: 25, level: "C6" },
        { soal: "Identifikasi struktur teks deskripsi berikut dan jelaskan masing-masing bagiannya!", kunci: "Struktur teks deskripsi: 1) Identifikasi: pengenalan objek secara umum, 2) Deskripsi bagian: penggambaran detail per bagian objek, 3) Simpulan: kesan atau rangkuman tentang objek.", skor: 20, level: "C4" },
        { soal: "Analisislah kesalahan dalam kalimat berikut dan perbaiki: 'Pantai itu sangat indah sekali dan airnya yang biru banget.'", kunci: "Kesalahan: 1) 'sangat...sekali' = pleonasme, pilih salah satu. 2) 'banget' = bahasa tidak baku, ganti 'sangat'. Perbaikan: 'Pantai itu sangat indah dengan air yang biru jernih.'", skor: 15, level: "C5" },
        { soal: "Mengapa penggunaan kata sifat dan majas penting dalam teks deskripsi? Jelaskan dengan contoh!", kunci: "Kata sifat dan majas membuat gambaran lebih hidup. Tanpa: 'Bunga itu merah.' Dengan kata sifat: 'Bunga itu merah menyala.' Dengan majas: 'Bunga itu semerah darah segar.' Pembaca dapat membayangkan objek dengan lebih jelas.", skor: 20, level: "C5" }
    ],
    materi: {
        pengertian: "Teks deskripsi adalah teks yang berisi gambaran atau lukisan tentang suatu objek sehingga pembaca seolah-olah dapat melihat, mendengar, atau merasakan objek tersebut secara langsung.",
        konsepUtama: [
            "Struktur: Identifikasi, Deskripsi Bagian, Simpulan",
            "Ciri kebahasaan: kata sifat, kata benda, majas, kalimat rincian",
            "Jenis: deskripsi objektif (faktual) dan subjektif (melibatkan opini)",
            "Pola pengembangan: spasial (ruang), kronologis, atau campuran"
        ],
        contoh: [
            "Deskripsi tempat wisata untuk brosur",
            "Deskripsi produk dalam iklan",
            "Deskripsi tokoh dalam novel",
            "Deskripsi hewan dalam ensiklopedia"
        ],
        rangkuman: [
            "Teks deskripsi melukiskan objek secara rinci",
            "Menggunakan kata sifat dan majas untuk memperjelas gambaran",
            "Melibatkan pancaindra: penglihatan, pendengaran, penciuman, dll",
            "Struktur: identifikasi, deskripsi bagian, simpulan"
        ]
    },
    kegiatan: {
        pendahuluan: [
            "Guru menampilkan foto/gambar objek menarik",
            "Siswa diminta mendeskripsikan objek secara lisan",
            "Guru menyampaikan tujuan pembelajaran"
        ],
        inti: [
            "Siswa mengamati contoh teks deskripsi dan mengidentifikasi strukturnya",
            "Diskusi kelompok: menemukan ciri kebahasaan teks deskripsi",
            "Latihan menulis paragraf deskripsi tentang benda di sekitar",
            "Peer review: siswa saling mengoreksi hasil tulisan",
            "Presentasi hasil karya terbaik"
        ],
        penutup: [
            "Siswa menyimpulkan ciri dan struktur teks deskripsi",
            "Refleksi: kesulitan dalam menulis teks deskripsi",
            "Penugasan: menulis teks deskripsi tentang tempat favorit"
        ]
    }
};

// ============ IPA - SISTEM PENCERNAAN ============
export const IPA_PENCERNAAN: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Organ pencernaan yang pertama kali mencerna makanan secara mekanik dan kimiawi adalah...", opsiA: "lambung", opsiB: "mulut", opsiC: "usus halus", opsiD: "kerongkongan", jawaban: "B", pembahasan: "Di mulut terjadi pencernaan mekanik (gigi mengunyah) dan kimiawi (enzim amilase/ptialin memecah amilum).", level: "C1" },
        { soal: "Enzim ptialin berfungsi untuk...", opsiA: "mencerna protein", opsiB: "mencerna lemak", opsiC: "mencerna amilum menjadi maltosa", opsiD: "membunuh kuman", jawaban: "C", pembahasan: "Ptialin (amilase) di air liur mengubah amilum (pati) menjadi maltosa (gula sederhana).", level: "C2" },
        { soal: "Gerakan peristaltik terjadi di...", opsiA: "mulut", opsiB: "lambung dan usus", opsiC: "hanya lambung", opsiD: "hanya usus besar", jawaban: "B", pembahasan: "Gerakan peristaltik adalah kontraksi otot yang mendorong makanan, terjadi di esofagus, lambung, dan usus.", level: "C2" },
        { soal: "HCl (asam lambung) berfungsi untuk...", opsiA: "mencerna amilum", opsiB: "membunuh kuman dan mengaktifkan pepsin", opsiC: "menyerap nutrisi", opsiD: "menghasilkan empedu", jawaban: "B", pembahasan: "HCl membunuh mikroorganisme dan mengubah pepsinogen menjadi pepsin aktif.", level: "C2" },
        { soal: "Penyerapan sari-sari makanan terutama terjadi di...", opsiA: "lambung", opsiB: "usus besar", opsiC: "usus halus", opsiD: "mulut", jawaban: "C", pembahasan: "Usus halus (terutama jejunum dan ileum) adalah tempat utama penyerapan nutrisi melalui vili.", level: "C1" },
        { soal: "Vili pada usus halus berfungsi untuk...", opsiA: "mencerna protein", opsiB: "memperluas permukaan penyerapan", opsiC: "menghasilkan enzim", opsiD: "menyimpan makanan", jawaban: "B", pembahasan: "Vili (jonjot-jonjot) memperluas permukaan usus halus sehingga penyerapan nutrisi lebih efektif.", level: "C2" },
        { soal: "Empedu dihasilkan oleh organ...", opsiA: "lambung", opsiB: "pankreas", opsiC: "hati", opsiD: "usus halus", jawaban: "C", pembahasan: "Empedu diproduksi oleh hati dan disimpan di kantong empedu. Fungsinya mengemulsikan lemak.", level: "C1" },
        { soal: "Fungsi empedu dalam pencernaan adalah...", opsiA: "mencerna protein", opsiB: "mengemulsikan lemak", opsiC: "mencerna amilum", opsiD: "membunuh bakteri", jawaban: "B", pembahasan: "Empedu memecah lemak menjadi butiran-butiran kecil (emulsifikasi) agar mudah dicerna enzim lipase.", level: "C2" },
        { soal: "Enzim tripsin berfungsi mencerna...", opsiA: "amilum", opsiB: "lemak", opsiC: "protein", opsiD: "vitamin", jawaban: "C", pembahasan: "Tripsin adalah enzim dari pankreas yang mencerna protein menjadi peptida.", level: "C1" },
        { soal: "Urutan saluran pencernaan yang benar adalah...", opsiA: "mulut - lambung - kerongkongan - usus", opsiB: "mulut - kerongkongan - lambung - usus halus - usus besar", opsiC: "mulut - usus - lambung - kerongkongan", opsiD: "kerongkongan - mulut - lambung - usus", jawaban: "B", pembahasan: "Urutan: mulut → kerongkongan (esofagus) → lambung → usus halus (duodenum, jejunum, ileum) → usus besar → anus.", level: "C1" },
        { soal: "Proses pembusukan sisa makanan terjadi di...", opsiA: "lambung", opsiB: "usus halus", opsiC: "usus besar", opsiD: "kerongkongan", jawaban: "C", pembahasan: "Di usus besar (kolon), bakteri E. coli membantu membusukan sisa makanan dan terbentuk feses.", level: "C2" },
        { soal: "Gangguan pencernaan berupa peradangan usus buntu disebut...", opsiA: "gastritis", opsiB: "apendisitis", opsiC: "diare", opsiD: "konstipasi", jawaban: "B", pembahasan: "Apendisitis adalah peradangan pada umbai cacing (apendiks/usus buntu).", level: "C1" },
        { soal: "Maag disebabkan oleh...", opsiA: "kelebihan vitamin", opsiB: "kelebihan produksi asam lambung", opsiC: "kekurangan enzim", opsiD: "infeksi usus", jawaban: "B", pembahasan: "Maag (gastritis) disebabkan produksi HCl berlebihan yang melukai dinding lambung.", level: "C2" },
        { soal: "Sembelit (konstipasi) dapat dicegah dengan...", opsiA: "mengurangi minum air", opsiB: "banyak makan serat dan minum air", opsiC: "mengurangi aktivitas", opsiD: "makan makanan berlemak", jawaban: "B", pembahasan: "Serat dan air membantu melancarkan pencernaan dan mencegah konstipasi.", level: "C3" },
        { soal: "Bagian usus halus yang menerima getah pankreas dan empedu adalah...", opsiA: "ileum", opsiB: "jejunum", opsiC: "duodenum", opsiD: "kolon", jawaban: "C", pembahasan: "Duodenum (usus dua belas jari) menerima cairan empedu dan getah pankreas melalui saluran.", level: "C2" },
        { soal: "Zat yang tidak dapat dicerna oleh sistem pencernaan manusia adalah...", opsiA: "protein", opsiB: "lemak", opsiC: "selulosa", opsiD: "amilum", jawaban: "C", pembahasan: "Manusia tidak memiliki enzim selulase untuk mencerna selulosa (serat tumbuhan).", level: "C2" },
        { soal: "Waktu yang dibutuhkan makanan dari mulut hingga menjadi feses adalah sekitar...", opsiA: "1-2 jam", opsiB: "6-8 jam", opsiC: "24-72 jam", opsiD: "1 minggu", jawaban: "C", pembahasan: "Proses pencernaan lengkap membutuhkan waktu 24-72 jam tergantung jenis makanan.", level: "C1" },
        { soal: "Diare dapat menyebabkan...", opsiA: "kelebihan cairan", opsiB: "dehidrasi", opsiC: "kelebihan nutrisi", opsiD: "penambahan berat badan", jawaban: "B", pembahasan: "Diare menyebabkan kehilangan cairan berlebihan (dehidrasi) karena frekuensi BAB meningkat.", level: "C2" },
        { soal: "Organ yang menghasilkan enzim lipase, amilase, dan tripsin adalah...", opsiA: "lambung", opsiB: "hati", opsiC: "pankreas", opsiD: "usus besar", jawaban: "C", pembahasan: "Pankreas menghasilkan getah pankreas yang mengandung berbagai enzim pencernaan.", level: "C1" },
        { soal: "Pencernaan kimiawi berbeda dengan pencernaan mekanik karena...", opsiA: "menggunakan enzim untuk mengubah zat makanan", opsiB: "memotong makanan fisik", opsiC: "terjadi di mulut saja", opsiD: "tidak memerlukan energi", jawaban: "A", pembahasan: "Pencernaan kimiawi melibatkan enzim yang mengubah struktur kimia makanan, sedangkan mekanik hanya memecah fisik.", level: "C4" }
    ],
    uraian: [
        { soal: "Jelaskan proses pencernaan makanan dari mulut hingga usus halus!", kunci: "Di mulut: makanan dikunyah (mekanik) dan dicerna ptialin (kimiawi). Di kerongkongan: didorong peristaltik. Di lambung: dicerna HCl dan pepsin. Di usus halus: dicerna enzim pankreas dan diserap oleh vili.", skor: 25, level: "C2" },
        { soal: "Mengapa usus halus disebut sebagai organ penyerapan utama?", kunci: "Usus halus panjang (6-7 meter), memiliki vili dan mikrovili yang memperluas permukaan hingga 200 m², sehingga penyerapan nutrisi sangat efektif.", skor: 20, level: "C4" },
        { soal: "Bandingkan fungsi enzim amilase, pepsin, dan lipase!", kunci: "Amilase: mencerna amilum → maltosa. Pepsin: mencerna protein → peptida. Lipase: mencerna lemak → asam lemak + gliserol. Ketiganya bekerja pada substrat berbeda.", skor: 20, level: "C4" },
        { soal: "Analisislah mengapa pola makan tidak teratur dapat menyebabkan maag!", kunci: "Lambung terus memproduksi HCl. Jika tidak ada makanan, asam melukai dinding lambung. Makan tidak teratur juga mengganggu ritme produksi enzim dan hormon pencernaan.", skor: 20, level: "C4" },
        { soal: "Buatlah diagram alur sistem pencernaan dan sebutkan enzim yang bekerja di setiap organ!", kunci: "Mulut (ptialin) → Kerongkongan → Lambung (pepsin, HCl) → Usus halus (tripsin, amilase, lipase dari pankreas; maltase, sukrase, laktase dari usus) → Usus besar → Anus", skor: 15, level: "C3" }
    ],
    materi: {
        pengertian: "Sistem pencernaan adalah serangkaian organ yang berfungsi mencerna makanan secara mekanik dan kimiawi, menyerap nutrisi, dan membuang sisa makanan yang tidak terpakai.",
        konsepUtama: [
            "Pencernaan mekanik: pemecahan fisik makanan (mengunyah, peristaltik)",
            "Pencernaan kimiawi: pemecahan dengan enzim (amilase, pepsin, lipase)",
            "Organ saluran: mulut, kerongkongan, lambung, usus halus, usus besar, anus",
            "Organ kelenjar: hati (empedu), pankreas (enzim + insulin)"
        ],
        contoh: [
            "Mengunyah nasi = pencernaan mekanik di mulut",
            "Amilum diubah menjadi gula = pencernaan kimiawi oleh amilase",
            "Vili menyerap nutrisi = fungsi usus halus",
            "Bakteri E. coli di usus besar = membantu pembusukan"
        ],
        rangkuman: [
            "Makanan dicerna secara mekanik dan kimiawi",
            "Enzim spesifik mencerna zat tertentu",
            "Penyerapan utama di usus halus melalui vili",
            "Sisa makanan dikeluarkan melalui anus"
        ]
    },
    kegiatan: {
        pendahuluan: [
            "Guru menanyakan: Apa yang terjadi pada makanan setelah kita makan?",
            "Siswa mengamati model/gambar sistem pencernaan",
            "Guru menyampaikan tujuan pembelajaran"
        ],
        inti: [
            "Praktikum: uji amilase pada nasi (tes iodin)",
            "Diskusi kelompok: mengidentifikasi organ dan fungsinya",
            "Simulasi gerakan peristaltik dengan balon/kaus kaki",
            "Analisis kasus gangguan pencernaan",
            "Presentasi hasil diskusi"
        ],
        penutup: [
            "Siswa membuat peta konsep sistem pencernaan",
            "Kuis: menjodohkan organ dengan enzim",
            "Refleksi tentang pola makan sehat"
        ]
    }
};
