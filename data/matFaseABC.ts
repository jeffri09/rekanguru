/**
 * Matematika Content Bank - Fase A (Kelas 1-2 SD)
 * Topik: Bilangan 1-100, Penjumlahan, Pengurangan Dasar
 */

import { SoalBank, SoalUraian, MateriKonten, KegiatanPembelajaran } from './contentBank';

export const MATEMATIKA_FASE_A: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "5 + 3 = ...", opsiA: "6", opsiB: "7", opsiC: "8", opsiD: "9", jawaban: "C", pembahasan: "5 + 3 = 8. Hitung dengan jari atau benda.", level: "C1" },
        { soal: "10 - 4 = ...", opsiA: "5", opsiB: "6", opsiC: "7", opsiD: "8", jawaban: "B", pembahasan: "10 dikurang 4 sama dengan 6.", level: "C1" },
        { soal: "Urutan bilangan yang benar adalah...", opsiA: "3, 5, 4, 6", opsiB: "1, 2, 3, 4", opsiC: "5, 3, 4, 2", opsiD: "2, 4, 3, 5", jawaban: "B", pembahasan: "Urutan bilangan dari kecil ke besar: 1, 2, 3, 4.", level: "C1" },
        { soal: "Bilangan sebelum 8 adalah...", opsiA: "6", opsiB: "7", opsiC: "9", opsiD: "10", jawaban: "B", pembahasan: "Bilangan sebelum 8 adalah 7.", level: "C1" },
        { soal: "Bilangan sesudah 15 adalah...", opsiA: "13", opsiB: "14", opsiC: "16", opsiD: "17", jawaban: "C", pembahasan: "Bilangan sesudah 15 adalah 16.", level: "C1" },
        { soal: "7 + ... = 10", opsiA: "2", opsiB: "3", opsiC: "4", opsiD: "5", jawaban: "B", pembahasan: "7 + 3 = 10. Kita mencari berapa yang ditambah 7 agar hasilnya 10.", level: "C2" },
        { soal: "Ani memiliki 4 apel. Ibu memberi 3 apel lagi. Berapa apel Ani sekarang?", opsiA: "6", opsiB: "7", opsiC: "8", opsiD: "9", jawaban: "B", pembahasan: "4 + 3 = 7 apel.", level: "C3" },
        { soal: "Budi punya 9 kelereng. Diberikan ke Ali 5 kelereng. Sisa kelereng Budi...", opsiA: "3", opsiB: "4", opsiC: "5", opsiD: "6", jawaban: "B", pembahasan: "9 - 5 = 4 kelereng.", level: "C3" },
        { soal: "20 + 30 = ...", opsiA: "40", opsiB: "50", opsiC: "60", opsiD: "70", jawaban: "B", pembahasan: "20 + 30 = 50. Tambahkan puluhan.", level: "C1" },
        { soal: "Lambang bilangan 'dua puluh lima' adalah...", opsiA: "15", opsiB: "25", opsiC: "35", opsiD: "52", jawaban: "B", pembahasan: "Dua puluh lima = 25.", level: "C1" },
        { soal: "Bilangan yang lebih besar: 17 atau 12?", opsiA: "12", opsiB: "17", opsiC: "Sama", opsiD: "Tidak bisa dibandingkan", jawaban: "B", pembahasan: "17 > 12, jadi 17 lebih besar.", level: "C2" },
        { soal: "8 + 8 = ...", opsiA: "14", opsiB: "15", opsiC: "16", opsiD: "17", jawaban: "C", pembahasan: "8 + 8 = 16.", level: "C1" },
        { soal: "15 - 7 = ...", opsiA: "7", opsiB: "8", opsiC: "9", opsiD: "10", jawaban: "B", pembahasan: "15 - 7 = 8.", level: "C2" },
        { soal: "Berapa banyak jari di satu tangan?", opsiA: "4", opsiB: "5", opsiC: "6", opsiD: "10", jawaban: "B", pembahasan: "Satu tangan memiliki 5 jari.", level: "C1" },
        { soal: "50 - 20 = ...", opsiA: "20", opsiB: "30", opsiC: "40", opsiD: "50", jawaban: "B", pembahasan: "50 - 20 = 30.", level: "C1" },
        { soal: "Ibu membeli 6 jeruk dan 4 apel. Berapa jumlah buah semua?", opsiA: "8", opsiB: "9", opsiC: "10", opsiD: "11", jawaban: "C", pembahasan: "6 + 4 = 10 buah.", level: "C3" },
        { soal: "Bilangan genap antara 1 sampai 10 adalah...", opsiA: "1, 3, 5, 7, 9", opsiB: "2, 4, 6, 8, 10", opsiC: "1, 2, 3, 4, 5", opsiD: "5, 6, 7, 8, 9", jawaban: "B", pembahasan: "Bilangan genap habis dibagi 2: 2, 4, 6, 8, 10.", level: "C2" },
        { soal: "9 + 6 = ...", opsiA: "13", opsiB: "14", opsiC: "15", opsiD: "16", jawaban: "C", pembahasan: "9 + 6 = 15.", level: "C1" },
        { soal: "Bentuk panjang dari 47 adalah...", opsiA: "4 + 7", opsiB: "40 + 7", opsiC: "7 + 40", opsiD: "74", jawaban: "B", pembahasan: "47 = 40 + 7 (4 puluhan dan 7 satuan).", level: "C2" },
        { soal: "100 - 1 = ...", opsiA: "99", opsiB: "98", opsiC: "101", opsiD: "90", jawaban: "A", pembahasan: "100 - 1 = 99.", level: "C1" }
    ],
    uraian: [
        { soal: "Hitung 12 + 15 = ? Jelaskan cara menghitungnya!", kunci: "12 + 15 = 27. Cara: satuan 2+5=7, puluhan 1+1=2, jadi 27.", skor: 15, level: "C2" },
        { soal: "Andi memiliki 8 pensil. Ia membeli lagi 7 pensil. Berapa pensil Andi sekarang?", kunci: "8 + 7 = 15 pensil. Andi sekarang memiliki 15 pensil.", skor: 15, level: "C3" },
        { soal: "Urutkan bilangan berikut dari terkecil: 15, 8, 22, 3, 19", kunci: "Urutan dari terkecil: 3, 8, 15, 19, 22.", skor: 15, level: "C2" },
        { soal: "Tuliskan 5 bilangan ganjil antara 10 dan 20!", kunci: "Bilangan ganjil antara 10-20: 11, 13, 15, 17, 19.", skor: 20, level: "C2" },
        { soal: "Di kelas ada 25 siswa. 10 siswa laki-laki. Berapa siswa perempuan?", kunci: "25 - 10 = 15 siswa perempuan.", skor: 20, level: "C3" }
    ],
    materi: {
        pengertian: "Bilangan adalah simbol yang digunakan untuk menyatakan banyaknya benda. Bilangan 1-100 adalah bilangan yang kita pelajari di kelas 1-2 SD.",
        konsepUtama: [
            "Mengenal bilangan 1-100",
            "Nilai tempat: satuan dan puluhan",
            "Penjumlahan bilangan sampai 100",
            "Pengurangan bilangan sampai 100",
            "Membandingkan bilangan (lebih besar, lebih kecil, sama dengan)"
        ],
        contoh: [
            "Menghitung jumlah pensil di kotak pensil",
            "Menghitung jumlah siswa di kelas",
            "Membaca nomor rumah",
            "Menghitung uang jajan"
        ],
        rangkuman: [
            "Bilangan 1-100 terdiri dari satuan dan puluhan",
            "Penjumlahan: menggabungkan dua bilangan",
            "Pengurangan: mengambil dari bilangan yang lebih besar",
            "Bilangan genap: 2, 4, 6, 8, 10...",
            "Bilangan ganjil: 1, 3, 5, 7, 9..."
        ]
    },
    kegiatan: {
        pendahuluan: [
            "Bernyanyi lagu berhitung 1-10",
            "Siswa menghitung jumlah teman di kelompoknya",
            "Guru menunjukkan kartu bilangan"
        ],
        inti: [
            "Bermain dengan balok atau kelereng untuk berhitung",
            "Mengurutkan kartu angka dari terkecil ke terbesar",
            "Latihan penjumlahan dengan jari atau sempoa",
            "Bermain toko-tokoan dengan uang mainan",
            "Mengerjakan lembar kerja berpasangan"
        ],
        penutup: [
            "Kuis lisan menjawab soal hitungan",
            "Menyanyikan lagu matematika",
            "Refleksi: apa yang sudah dipelajari hari ini"
        ]
    }
};

// ============ FASE B (Kelas 3-4 SD) ============
export const MATEMATIKA_FASE_B: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "234 + 567 = ...", opsiA: "791", opsiB: "801", opsiC: "811", opsiD: "701", jawaban: "B", pembahasan: "234 + 567 = 801. Satuan: 4+7=11 (simpan 1), puluhan: 3+6+1=10 (simpan 1), ratusan: 2+5+1=8.", level: "C1" },
        { soal: "1.000 - 356 = ...", opsiA: "644", opsiB: "654", opsiC: "744", opsiD: "544", jawaban: "A", pembahasan: "1.000 - 356 = 644.", level: "C2" },
        { soal: "5 × 8 = ...", opsiA: "35", opsiB: "40", opsiC: "45", opsiD: "48", jawaban: "B", pembahasan: "5 × 8 = 40.", level: "C1" },
        { soal: "72 ÷ 9 = ...", opsiA: "6", opsiB: "7", opsiC: "8", opsiD: "9", jawaban: "C", pembahasan: "72 ÷ 9 = 8. Karena 9 × 8 = 72.", level: "C1" },
        { soal: "Hasil dari 6 × 7 adalah...", opsiA: "36", opsiB: "42", opsiC: "48", opsiD: "54", jawaban: "B", pembahasan: "6 × 7 = 42.", level: "C1" },
        { soal: "Nilai tempat angka 5 pada bilangan 3.574 adalah...", opsiA: "satuan", opsiB: "puluhan", opsiC: "ratusan", opsiD: "ribuan", jawaban: "C", pembahasan: "Pada 3.574, angka 5 berada di tempat ratusan.", level: "C2" },
        { soal: "1/2 + 1/4 = ...", opsiA: "1/6", opsiB: "2/6", opsiC: "2/4", opsiD: "3/4", jawaban: "D", pembahasan: "1/2 = 2/4, jadi 2/4 + 1/4 = 3/4.", level: "C2" },
        { soal: "Pecahan yang senilai dengan 1/2 adalah...", opsiA: "2/3", opsiB: "2/4", opsiC: "3/4", opsiD: "1/3", jawaban: "B", pembahasan: "1/2 = 2/4 (dikali 2 pembilang dan penyebut).", level: "C2" },
        { soal: "Keliling persegi dengan sisi 5 cm adalah...", opsiA: "15 cm", opsiB: "20 cm", opsiC: "25 cm", opsiD: "10 cm", jawaban: "B", pembahasan: "Keliling persegi = 4 × sisi = 4 × 5 = 20 cm.", level: "C3" },
        { soal: "3 × 4 × 2 = ...", opsiA: "20", opsiB: "22", opsiC: "24", opsiD: "26", jawaban: "C", pembahasan: "3 × 4 = 12, lalu 12 × 2 = 24.", level: "C2" },
        { soal: "Faktor dari 12 adalah...", opsiA: "1, 2, 3, 4, 6, 12", opsiB: "1, 2, 3, 6", opsiC: "2, 3, 4, 6", opsiD: "1, 3, 6, 12", jawaban: "A", pembahasan: "Faktor 12: 1, 2, 3, 4, 6, 12 (bilangan yang habis membagi 12).", level: "C2" },
        { soal: "Ibu membeli 3 kg gula. Harga 1 kg Rp15.000. Berapa yang harus dibayar?", opsiA: "Rp35.000", opsiB: "Rp45.000", opsiC: "Rp40.000", opsiD: "Rp50.000", jawaban: "B", pembahasan: "3 × 15.000 = 45.000.", level: "C3" },
        { soal: "2.456 dibulatkan ke ratusan terdekat menjadi...", opsiA: "2.400", opsiB: "2.500", opsiC: "2.450", opsiD: "2.460", jawaban: "B", pembahasan: "2.456 → angka puluhan 5, maka dibulatkan ke atas: 2.500.", level: "C2" },
        { soal: "Luas persegi panjang dengan p=8 cm dan l=5 cm adalah...", opsiA: "13 cm²", opsiB: "26 cm²", opsiC: "40 cm²", opsiD: "80 cm²", jawaban: "C", pembahasan: "Luas = p × l = 8 × 5 = 40 cm².", level: "C3" },
        { soal: "48 ÷ 6 = ...", opsiA: "6", opsiB: "7", opsiC: "8", opsiD: "9", jawaban: "C", pembahasan: "48 ÷ 6 = 8.", level: "C1" },
        { soal: "Bilangan kelipatan 5 antara 10 dan 40 adalah...", opsiA: "10, 15, 20, 25, 30, 35", opsiB: "15, 20, 25, 30, 35", opsiC: "15, 20, 25, 30, 35, 40", opsiD: "10, 15, 20, 25, 30, 35, 40", jawaban: "B", pembahasan: "Kelipatan 5 antara 10 dan 40: 15, 20, 25, 30, 35.", level: "C2" },
        { soal: "3/5 dari 25 adalah...", opsiA: "10", opsiB: "15", opsiC: "20", opsiD: "12", jawaban: "B", pembahasan: "3/5 × 25 = 75/5 = 15.", level: "C3" },
        { soal: "Jam menunjukkan pukul 10.45. Dalam 30 menit akan pukul...", opsiA: "11.00", opsiB: "11.15", opsiC: "11.30", opsiD: "10.75", jawaban: "B", pembahasan: "10.45 + 30 menit = 11.15.", level: "C2" },
        { soal: "Berapa sisi pada segitiga?", opsiA: "2", opsiB: "3", opsiC: "4", opsiD: "5", jawaban: "B", pembahasan: "Segitiga memiliki 3 sisi.", level: "C1" },
        { soal: "Kelipatan persekutuan terkecil (KPK) dari 4 dan 6 adalah...", opsiA: "8", opsiB: "10", opsiC: "12", opsiD: "24", jawaban: "C", pembahasan: "Kelipatan 4: 4, 8, 12... Kelipatan 6: 6, 12... KPK = 12.", level: "C2" }
    ],
    uraian: [
        { soal: "Hitunglah 1.245 + 2.367 dengan cara bersusun!", kunci: "Susun ke bawah. Satuan: 5+7=12 (tulis 2, simpan 1). Puluhan: 4+6+1=11 (tulis 1, simpan 1). Ratusan: 2+3+1=6. Ribuan: 1+2=3. Hasil: 3.612.", skor: 20, level: "C2" },
        { soal: "Pak Tono membeli 8 kotak pensil. Setiap kotak berisi 12 pensil. Berapa pensil seluruhnya?", kunci: "8 × 12 = 96 pensil.", skor: 15, level: "C3" },
        { soal: "Tentukan semua faktor dari 24!", kunci: "Faktor 24: 1, 2, 3, 4, 6, 8, 12, 24.", skor: 20, level: "C2" },
        { soal: "Sebuah kebun berbentuk persegi panjang dengan panjang 12 m dan lebar 8 m. Hitunglah keliling dan luas kebun!", kunci: "Keliling = 2 × (p + l) = 2 × (12 + 8) = 40 m. Luas = p × l = 12 × 8 = 96 m².", skor: 25, level: "C3" },
        { soal: "Urutkan pecahan berikut dari terkecil: 1/2, 1/4, 3/4, 1/3", kunci: "Samakan penyebut: 1/4 = 3/12, 1/3 = 4/12, 1/2 = 6/12, 3/4 = 9/12. Urutan: 1/4, 1/3, 1/2, 3/4.", skor: 20, level: "C4" }
    ],
    materi: {
        pengertian: "Pada Fase B, siswa mempelajari operasi bilangan hingga ribuan, perkalian dan pembagian, pecahan dasar, serta bangun datar sederhana.",
        konsepUtama: [
            "Operasi hitung bilangan sampai 10.000",
            "Perkalian dan pembagian dasar (1-10)",
            "Pecahan sederhana dan pecahan senilai",
            "Keliling dan luas bangun datar",
            "Faktor dan kelipatan bilangan"
        ],
        contoh: [
            "Menghitung total belanjaan di warung",
            "Membagi kue untuk teman-teman",
            "Menghitung luas lantai kamar",
            "Membaca jam analog dan digital"
        ],
        rangkuman: [
            "Perkalian adalah penjumlahan berulang",
            "Pembagian adalah kebalikan dari perkalian",
            "Pecahan menunjukkan bagian dari keseluruhan",
            "Keliling = jumlah semua sisi",
            "Luas = panjang × lebar (untuk persegi panjang)"
        ]
    },
    kegiatan: {
        pendahuluan: [
            "Review perkalian 1-10 dengan lagu/yel-yel",
            "Tanya jawab tentang pengalaman berbelanja",
            "Guru menunjukkan bangun datar dari kertas"
        ],
        inti: [
            "Latihan perkalian dengan kartu flash",
            "Praktik mengukur panjang dan lebar kelas",
            "Menghitung luas dengan kertas berpetak",
            "Bermain domino pecahan",
            "Mengerjakan soal cerita berkelompok"
        ],
        penutup: [
            "Kuis cepat perkalian",
            "Siswa menyebutkan kegunaan matematika di rumah",
            "Refleksi pembelajaran hari ini"
        ]
    }
};

// ============ FASE C (Kelas 5-6 SD) ============
export const MATEMATIKA_FASE_C: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "KPK dari 12, 18, dan 24 adalah...", opsiA: "36", opsiB: "48", opsiC: "72", opsiD: "144", jawaban: "C", pembahasan: "12=2²×3, 18=2×3², 24=2³×3. KPK=2³×3²=72.", level: "C3" },
        { soal: "FPB dari 36 dan 48 adalah...", opsiA: "6", opsiB: "12", opsiC: "18", opsiD: "24", jawaban: "B", pembahasan: "36=2²×3², 48=2⁴×3. FPB=2²×3=12.", level: "C2" },
        { soal: "3/4 × 2/5 = ...", opsiA: "5/9", opsiB: "6/9", opsiC: "6/20", opsiD: "5/20", jawaban: "C", pembahasan: "3/4 × 2/5 = 6/20 = 3/10.", level: "C2" },
        { soal: "2 1/2 + 1 3/4 = ...", opsiA: "3 1/4", opsiB: "3 3/4", opsiC: "4 1/4", opsiD: "4 3/4", jawaban: "C", pembahasan: "2 1/2 + 1 3/4 = 2 2/4 + 1 3/4 = 3 5/4 = 4 1/4.", level: "C2" },
        { soal: "0,75 sama dengan pecahan...", opsiA: "1/4", opsiB: "1/2", opsiC: "3/4", opsiD: "2/3", jawaban: "C", pembahasan: "0,75 = 75/100 = 3/4.", level: "C2" },
        { soal: "25% dari 80 adalah...", opsiA: "15", opsiB: "20", opsiC: "25", opsiD: "30", jawaban: "B", pembahasan: "25% × 80 = 25/100 × 80 = 20.", level: "C2" },
        { soal: "Volume kubus dengan rusuk 5 cm adalah...", opsiA: "25 cm³", opsiB: "75 cm³", opsiC: "100 cm³", opsiD: "125 cm³", jawaban: "D", pembahasan: "Volume kubus = s³ = 5³ = 125 cm³.", level: "C3" },
        { soal: "Luas lingkaran dengan jari-jari 7 cm (π=22/7) adalah...", opsiA: "44 cm²", opsiB: "154 cm²", opsiC: "308 cm²", opsiD: "88 cm²", jawaban: "B", pembahasan: "Luas = πr² = 22/7 × 7² = 22/7 × 49 = 154 cm².", level: "C3" },
        { soal: "Skala peta 1 : 50.000. Jarak sebenarnya 10 km = ... cm di peta.", opsiA: "5 cm", opsiB: "10 cm", opsiC: "20 cm", opsiD: "50 cm", jawaban: "C", pembahasan: "10 km = 1.000.000 cm. Di peta = 1.000.000 ÷ 50.000 = 20 cm.", level: "C3" },
        { soal: "Rata-rata dari 6, 8, 7, 5, 9 adalah...", opsiA: "6", opsiB: "7", opsiC: "8", opsiD: "9", jawaban: "B", pembahasan: "Rata-rata = (6+8+7+5+9)/5 = 35/5 = 7.", level: "C2" },
        { soal: "4³ = ...", opsiA: "12", opsiB: "16", opsiC: "64", opsiD: "81", jawaban: "C", pembahasan: "4³ = 4 × 4 × 4 = 64.", level: "C1" },
        { soal: "√81 = ...", opsiA: "7", opsiB: "8", opsiC: "9", opsiD: "10", jawaban: "C", pembahasan: "√81 = 9, karena 9 × 9 = 81.", level: "C1" },
        { soal: "Sebuah mobil menempuh 240 km dalam 4 jam. Kecepatannya...", opsiA: "50 km/jam", opsiB: "55 km/jam", opsiC: "60 km/jam", opsiD: "65 km/jam", jawaban: "C", pembahasan: "Kecepatan = jarak/waktu = 240/4 = 60 km/jam.", level: "C3" },
        { soal: "Harga sebuah tas diskon 20%. Harga awal Rp150.000. Harga setelah diskon...", opsiA: "Rp120.000", opsiB: "Rp130.000", opsiC: "Rp100.000", opsiD: "Rp110.000", jawaban: "A", pembahasan: "Diskon = 20% × 150.000 = 30.000. Harga akhir = 150.000 - 30.000 = 120.000.", level: "C3" },
        { soal: "Perbandingan uang Ani dan Budi = 3 : 5. Jika uang Ani Rp60.000, uang Budi...", opsiA: "Rp80.000", opsiB: "Rp90.000", opsiC: "Rp100.000", opsiD: "Rp120.000", jawaban: "C", pembahasan: "Jika Ani = 3 bagian = 60.000, maka 1 bagian = 20.000. Budi = 5 × 20.000 = 100.000.", level: "C3" },
        { soal: "Luas trapesium dengan sisi sejajar 6 cm dan 10 cm, tinggi 5 cm adalah...", opsiA: "30 cm²", opsiB: "35 cm²", opsiC: "40 cm²", opsiD: "50 cm²", jawaban: "C", pembahasan: "Luas = ½ × (a+b) × t = ½ × (6+10) × 5 = 40 cm².", level: "C3" },
        { soal: "Diagram lingkaran menunjukkan 25% siswa suka matematika. Jika ada 40 siswa, berapa yang suka matematika?", opsiA: "8", opsiB: "10", opsiC: "12", opsiD: "15", jawaban: "B", pembahasan: "25% × 40 = 10 siswa.", level: "C3" },
        { soal: "Bilangan prima antara 30 dan 40 adalah...", opsiA: "31, 33, 37", opsiB: "31, 37", opsiC: "33, 37, 39", opsiD: "31, 35, 37", jawaban: "B", pembahasan: "31 dan 37 adalah bilangan prima (hanya habis dibagi 1 dan dirinya sendiri).", level: "C2" },
        { soal: "Keliling lingkaran dengan diameter 14 cm (π=22/7) adalah...", opsiA: "22 cm", opsiB: "44 cm", opsiC: "66 cm", opsiD: "88 cm", jawaban: "B", pembahasan: "Keliling = πd = 22/7 × 14 = 44 cm.", level: "C2" },
        { soal: "1,5 jam = ... menit", opsiA: "65", opsiB: "75", opsiC: "85", opsiD: "90", jawaban: "D", pembahasan: "1,5 jam = 1 jam 30 menit = 90 menit.", level: "C1" }
    ],
    uraian: [
        { soal: "Tentukan KPK dan FPB dari 24 dan 36 menggunakan faktorisasi prima!", kunci: "24 = 2³ × 3, 36 = 2² × 3². FPB = 2² × 3 = 12. KPK = 2³ × 3² = 72.", skor: 20, level: "C3" },
        { soal: "Sebuah bak mandi berbentuk balok dengan p=80cm, l=50cm, t=60cm. Berapa liter air yang dibutuhkan untuk mengisi penuh?", kunci: "Volume = 80 × 50 × 60 = 240.000 cm³ = 240 liter.", skor: 25, level: "C4" },
        { soal: "Harga 5 buku dan 3 pensil adalah Rp35.000. Jika harga 1 buku Rp5.000, berapa harga 1 pensil?", kunci: "Harga 5 buku = 5 × 5.000 = 25.000. Harga 3 pensil = 35.000 - 25.000 = 10.000. Harga 1 pensil = 10.000/3 = Rp3.333,33.", skor: 20, level: "C4" },
        { soal: "Data nilai ulangan: 7, 8, 6, 9, 8, 7, 8, 9, 6, 7. Tentukan mean, median, dan modus!", kunci: "Mean = 75/10 = 7,5. Urutan: 6,6,7,7,7,8,8,8,9,9. Median = (7+8)/2=7,5. Modus = 7 dan 8.", skor: 25, level: "C3" },
        { soal: "Perbandingan umur ayah dan anak = 5:2. Selisih umur 27 tahun. Berapa umur masing-masing?", kunci: "Selisih perbandingan = 5-2 = 3 bagian = 27 tahun. 1 bagian = 9 tahun. Ayah = 5×9=45 tahun, anak = 2×9=18 tahun.", skor: 20, level: "C4" }
    ],
    materi: {
        pengertian: "Fase C memperdalam operasi pecahan, desimal, persen, serta memperkenalkan konsep volume bangun ruang dan statistika dasar.",
        konsepUtama: [
            "Operasi pecahan, desimal, dan persen",
            "KPK dan FPB",
            "Skala dan perbandingan",
            "Volume dan luas permukaan bangun ruang",
            "Statistika dasar (mean, median, modus)"
        ],
        contoh: [
            "Menghitung diskon saat berbelanja",
            "Membaca peta dengan skala",
            "Menghitung volume akuarium",
            "Menganalisis data nilai ulangan"
        ],
        rangkuman: [
            "KPK: kelipatan persekutuan terkecil",
            "FPB: faktor persekutuan terbesar",
            "Persen = per seratus (x%=x/100)",
            "Volume kubus = s³, balok = p×l×t",
            "Mean = jumlah data/banyak data"
        ]
    },
    kegiatan: {
        pendahuluan: [
            "Diskusi tentang penggunaan persen dalam kehidupan",
            "Review pecahan dan desimal",
            "Menunjukkan contoh peta dan skala"
        ],
        inti: [
            "Praktik mengukur dan menghitung volume benda",
            "Latihan konversi pecahan-desimal-persen",
            "Proyek membuat diagram dari data kelas",
            "Menyelesaikan soal cerita perbandingan",
            "Presentasi hasil kerja kelompok"
        ],
        penutup: [
            "Kuis tentang konversi satuan",
            "Menyimpulkan rumus-rumus penting",
            "Refleksi dan penilaian diri"
        ]
    }
};
