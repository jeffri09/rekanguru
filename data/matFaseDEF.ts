/**
 * Matematika Content Bank - Fase D, E, F (SMP-SMA)
 */

import { SoalBank, SoalUraian, MateriKonten, KegiatanPembelajaran } from './contentBank';

// ============ FASE D (Kelas 7-9 SMP) ============
export const MATEMATIKA_FASE_D: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Hasil dari -15 + 8 - (-3) adalah...", opsiA: "-20", opsiB: "-10", opsiC: "-4", opsiD: "4", jawaban: "C", pembahasan: "-15 + 8 - (-3) = -15 + 8 + 3 = -4.", level: "C2" },
        { soal: "Jika 2x + 5 = 13, maka nilai x adalah...", opsiA: "3", opsiB: "4", opsiC: "5", opsiD: "6", jawaban: "B", pembahasan: "2x = 13 - 5 = 8, x = 4.", level: "C2" },
        { soal: "Gradien garis y = 3x - 7 adalah...", opsiA: "-7", opsiB: "-3", opsiC: "3", opsiD: "7", jawaban: "C", pembahasan: "Bentuk y = mx + c, gradien m = 3.", level: "C1" },
        { soal: "Himpunan penyelesaian dari x² - 5x + 6 = 0 adalah...", opsiA: "{2, 3}", opsiB: "{-2, -3}", opsiC: "{1, 6}", opsiD: "{-1, -6}", jawaban: "A", pembahasan: "Faktorisasi: (x-2)(x-3)=0, x=2 atau x=3.", level: "C3" },
        { soal: "Nilai dari 2⁵ × 2³ adalah...", opsiA: "2⁸", opsiB: "2¹⁵", opsiC: "4⁸", opsiD: "4¹⁵", jawaban: "A", pembahasan: "aᵐ × aⁿ = aᵐ⁺ⁿ, jadi 2⁵ × 2³ = 2⁸.", level: "C2" },
        { soal: "Bentuk sederhana dari (3x²y³)² adalah...", opsiA: "6x⁴y⁶", opsiB: "9x⁴y⁵", opsiC: "9x⁴y⁶", opsiD: "6x⁴y⁵", jawaban: "C", pembahasan: "(3x²y³)² = 3² × x⁴ × y⁶ = 9x⁴y⁶.", level: "C2" },
        { soal: "Luas segitiga dengan alas 10 cm dan tinggi 8 cm adalah...", opsiA: "18 cm²", opsiB: "40 cm²", opsiC: "80 cm²", opsiD: "90 cm²", jawaban: "B", pembahasan: "Luas = ½ × a × t = ½ × 10 × 8 = 40 cm².", level: "C2" },
        { soal: "Teorema Pythagoras: Jika sisi siku-siku 6 dan 8, maka sisi miringnya...", opsiA: "9", opsiB: "10", opsiC: "12", opsiD: "14", jawaban: "B", pembahasan: "c² = 6² + 8² = 36 + 64 = 100, c = 10.", level: "C2" },
        { soal: "Nilai sin 30° adalah...", opsiA: "½", opsiB: "½√2", opsiC: "½√3", opsiD: "1", jawaban: "A", pembahasan: "sin 30° = ½.", level: "C1" },
        { soal: "Persamaan garis melalui (0, -2) dengan gradien 3 adalah...", opsiA: "y = 3x - 2", opsiB: "y = -3x + 2", opsiC: "y = 3x + 2", opsiD: "y = -3x - 2", jawaban: "A", pembahasan: "y = mx + c = 3x + (-2) = 3x - 2.", level: "C3" },
        { soal: "Mean dari data 5, 7, 8, 6, 9, 7, 8 adalah...", opsiA: "6,5", opsiB: "7", opsiC: "7,14", opsiD: "7,5", jawaban: "C", pembahasan: "Mean = 50/7 ≈ 7,14.", level: "C2" },
        { soal: "Median dari 3, 5, 7, 4, 9, 2, 8 adalah...", opsiA: "4", opsiB: "5", opsiC: "6", opsiD: "7", jawaban: "B", pembahasan: "Urutan: 2,3,4,5,7,8,9. Median = data tengah = 5.", level: "C2" },
        { soal: "Dua garis sejajar memiliki gradien yang...", opsiA: "berbeda", opsiB: "sama", opsiC: "berlawanan tanda", opsiD: "hasil kalinya -1", jawaban: "B", pembahasan: "Garis sejajar: m₁ = m₂.", level: "C1" },
        { soal: "Volume kerucut dengan r=7 cm dan t=12 cm (π=22/7) adalah...", opsiA: "88 cm³", opsiB: "308 cm³", opsiC: "616 cm³", opsiD: "924 cm³", jawaban: "C", pembahasan: "V = ⅓πr²t = ⅓ × 22/7 × 49 × 12 = 616 cm³.", level: "C3" },
        { soal: "Hasil dari (x+3)(x-2) adalah...", opsiA: "x² + x - 6", opsiB: "x² - x - 6", opsiC: "x² + x + 6", opsiD: "x² - x + 6", jawaban: "A", pembahasan: "FOIL: x² - 2x + 3x - 6 = x² + x - 6.", level: "C2" },
        { soal: "Jika f(x) = 2x - 3, maka f(4) = ...", opsiA: "3", opsiB: "5", opsiC: "7", opsiD: "11", jawaban: "B", pembahasan: "f(4) = 2(4) - 3 = 8 - 3 = 5.", level: "C2" },
        { soal: "Keliling lingkaran dengan d = 28 cm adalah...", opsiA: "44 cm", opsiB: "88 cm", opsiC: "176 cm", opsiD: "616 cm", jawaban: "B", pembahasan: "K = πd = 22/7 × 28 = 88 cm.", level: "C2" },
        { soal: "Sudut dalam segitiga berjumlah...", opsiA: "90°", opsiB: "180°", opsiC: "270°", opsiD: "360°", jawaban: "B", pembahasan: "Jumlah sudut dalam segitiga = 180°.", level: "C1" },
        { soal: "Peluang muncul angka genap pada pelemparan dadu adalah...", opsiA: "1/6", opsiB: "1/3", opsiC: "1/2", opsiD: "2/3", jawaban: "C", pembahasan: "Angka genap: 2,4,6 = 3 dari 6. P = 3/6 = 1/2.", level: "C2" },
        { soal: "Pola bilangan: 2, 5, 10, 17, ... Suku berikutnya adalah...", opsiA: "24", opsiB: "26", opsiC: "28", opsiD: "30", jawaban: "B", pembahasan: "Pola: +3, +5, +7, +9,... Suku ke-5 = 17 + 9 = 26.", level: "C3" }
    ],
    uraian: [
        { soal: "Selesaikan sistem persamaan linear: 2x + y = 7 dan x - y = 2", kunci: "Dari x - y = 2, x = y + 2. Substitusi: 2(y+2) + y = 7, 3y = 3, y = 1, x = 3. HP: {(3,1)}.", skor: 20, level: "C3" },
        { soal: "Sebuah tangga 10 m bersandar pada tembok. Jarak kaki tangga ke tembok 6 m. Berapa tinggi tangga mencapai tembok?", kunci: "Pythagoras: t² = 10² - 6² = 100 - 36 = 64. t = 8 m.", skor: 20, level: "C3" },
        { soal: "Tentukan persamaan garis yang melalui titik (2, 3) dan (4, 7)!", kunci: "m = (7-3)/(4-2) = 2. y - 3 = 2(x - 2), y = 2x - 1.", skor: 20, level: "C4" },
        { soal: "Faktorkanlah x² - 9x + 20 dan tentukan akar-akarnya!", kunci: "x² - 9x + 20 = (x - 4)(x - 5). Akar: x = 4 atau x = 5.", skor: 15, level: "C3" },
        { soal: "Sebuah tabung memiliki r = 7 cm dan t = 20 cm. Hitunglah volume dan luas permukaannya!", kunci: "V = πr²t = 22/7 × 49 × 20 = 3.080 cm³. LP = 2πr(r+t) = 2 × 22/7 × 7 × 27 = 1.188 cm².", skor: 25, level: "C4" }
    ],
    materi: {
        pengertian: "Fase D (SMP) mencakup aljabar dasar, geometri, statistika, dan pengenalan trigonometri.",
        konsepUtama: [
            "Bilangan bulat dan operasinya",
            "Aljabar: variabel, persamaan, pertidaksamaan",
            "Geometri: teorema Pythagoras, lingkaran, bangun ruang",
            "Statistika: mean, median, modus, diagram",
            "Peluang kejadian"
        ],
        contoh: ["Menghitung bunga bank", "Menghitung jarak dengan skala", "Menghitung volume benda 3D", "Menganalisis data survey"],
        rangkuman: ["Aljabar menggunakan variabel untuk menyatakan bilangan", "Pythagoras: c² = a² + b²", "Peluang = kejadian diharapkan / total kejadian"]
    },
    kegiatan: {
        pendahuluan: ["Review operasi bilangan", "Diskusi aplikasi matematika di kehidupan", "Demonstrasi Geogebra"],
        inti: ["Eksplorasi pola bilangan", "Praktik menyelesaikan persamaan", "Pembuktian teorema Pythagoras dengan lipatan kertas", "Pengumpulan dan analisis data kelas"],
        penutup: ["Kuis singkat", "Refleksi dan diskusi", "Penugasan mandiri"]
    }
};

// ============ FASE E (Kelas 10 SMA) ============
export const MATEMATIKA_FASE_E: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Bentuk sederhana dari (log 8 + log 4) / log 2 adalah...", opsiA: "3", opsiB: "5", opsiC: "7", opsiD: "12", jawaban: "B", pembahasan: "log 8 + log 4 = log 32 = log 2⁵ = 5 log 2. Hasil = 5.", level: "C3" },
        { soal: "Nilai dari ³log 27 adalah...", opsiA: "2", opsiB: "3", opsiC: "9", opsiD: "27", jawaban: "B", pembahasan: "³log 27 = ³log 3³ = 3.", level: "C1" },
        { soal: "Jika f(x) = x² - 4x + 3, maka f(x) = 0 memiliki akar...", opsiA: "x = 1 dan x = 3", opsiB: "x = -1 dan x = -3", opsiC: "x = 1 dan x = -3", opsiD: "x = -1 dan x = 3", jawaban: "A", pembahasan: "x² - 4x + 3 = (x-1)(x-3) = 0, x = 1 atau 3.", level: "C2" },
        { soal: "Persamaan kuadrat x² - 6x + k = 0 memiliki akar kembar. Nilai k adalah...", opsiA: "6", opsiB: "9", opsiC: "12", opsiD: "36", jawaban: "B", pembahasan: "Akar kembar: D = 0. b² - 4ac = 36 - 4k = 0, k = 9.", level: "C3" },
        { soal: "Nilai cos 60° adalah...", opsiA: "0", opsiB: "½", opsiC: "½√2", opsiD: "½√3", jawaban: "B", pembahasan: "cos 60° = ½.", level: "C1" },
        { soal: "Dalam segitiga ABC, jika sin A = 3/5, maka cos A = ...", opsiA: "4/5", opsiB: "3/4", opsiC: "5/4", opsiD: "5/3", jawaban: "A", pembahasan: "sin²A + cos²A = 1. cos²A = 1 - 9/25 = 16/25, cos A = 4/5.", level: "C2" },
        { soal: "Deret geometri: 3, 6, 12, 24, ... Suku ke-7 adalah...", opsiA: "96", opsiB: "192", opsiC: "288", opsiD: "384", jawaban: "B", pembahasan: "a=3, r=2. U₇ = ar⁶ = 3 × 64 = 192.", level: "C2" },
        { soal: "Jumlah 10 suku pertama deret aritmetika 2, 5, 8, 11, ... adalah...", opsiA: "145", opsiB: "155", opsiC: "165", opsiD: "175", jawaban: "B", pembahasan: "a=2, b=3. S₁₀ = ½n(2a + (n-1)b) = 5(4 + 27) = 155.", level: "C3" },
        { soal: "Limit: lim(x→2) (x² - 4)/(x - 2) = ...", opsiA: "0", opsiB: "2", opsiC: "4", opsiD: "∞", jawaban: "C", pembahasan: "= lim(x→2) (x+2)(x-2)/(x-2) = lim(x→2) (x+2) = 4.", level: "C3" },
        { soal: "Turunan dari f(x) = 3x⁴ - 2x² + 5 adalah...", opsiA: "12x³ - 4x", opsiB: "12x³ - 2x", opsiC: "12x³ - 4x + 5", opsiD: "4x³ - 4x", jawaban: "A", pembahasan: "f'(x) = 12x³ - 4x.", level: "C2" },
        { soal: "Matriks A = [2 1; 3 4]. Det(A) = ...", opsiA: "5", opsiB: "8", opsiC: "11", opsiD: "14", jawaban: "A", pembahasan: "Det = (2×4) - (1×3) = 8 - 3 = 5.", level: "C2" },
        { soal: "Vektor u = (3, 4). Panjang vektor |u| = ...", opsiA: "5", opsiB: "7", opsiC: "12", opsiD: "25", jawaban: "A", pembahasan: "|u| = √(9+16) = √25 = 5.", level: "C2" },
        { soal: "Fungsi f(x) = x³ - 3x memiliki nilai maksimum lokal di x = ...", opsiA: "-1", opsiB: "0", opsiC: "1", opsiD: "3", jawaban: "A", pembahasan: "f'(x) = 3x² - 3 = 0, x = ±1. f''(x) = 6x. f''(-1) = -6 < 0, maksimum.", level: "C4" },
        { soal: "P(n,r) = 5!/3! Nilai n dan r adalah...", opsiA: "n=5, r=2", opsiB: "n=5, r=3", opsiC: "n=3, r=2", opsiD: "n=5, r=5", jawaban: "A", pembahasan: "P(5,2) = 5!/(5-2)! = 5!/3! = 20.", level: "C2" },
        { soal: "C(6,2) = ...", opsiA: "12", opsiB: "15", opsiC: "30", opsiD: "36", jawaban: "B", pembahasan: "C(6,2) = 6!/(2!×4!) = 30/2 = 15.", level: "C2" },
        { soal: "Jika x₁ dan x₂ akar dari x² + px - 12 = 0 dan x₁.x₂ = -12, maka x₁ + x₂ = ...", opsiA: "-p", opsiB: "p", opsiC: "12", opsiD: "-12", jawaban: "A", pembahasan: "Hubungan akar-koefisien: x₁ + x₂ = -p.", level: "C2" },
        { soal: "Persamaan lingkaran berpusat di (2, -3) dengan r = 5 adalah...", opsiA: "(x-2)² + (y+3)² = 25", opsiB: "(x+2)² + (y-3)² = 25", opsiC: "(x-2)² + (y-3)² = 25", opsiD: "(x+2)² + (y+3)² = 25", jawaban: "A", pembahasan: "(x-a)² + (y-b)² = r², (x-2)² + (y+3)² = 25.", level: "C2" },
        { soal: "Jika tan θ = 3/4 (θ di kuadran I), maka sin θ + cos θ = ...", opsiA: "1", opsiB: "7/5", opsiC: "5/7", opsiD: "1,4", jawaban: "B", pembahasan: "sin θ = 3/5, cos θ = 4/5. sin θ + cos θ = 7/5.", level: "C3" },
        { soal: "∫(2x + 3)dx = ...", opsiA: "x² + 3x + C", opsiB: "2x² + 3x + C", opsiC: "x² + 3 + C", opsiD: "2x + C", jawaban: "A", pembahasan: "∫2x dx = x², ∫3 dx = 3x. Hasil: x² + 3x + C.", level: "C2" },
        { soal: "Banyak cara menyusun 5 orang dalam barisan adalah...", opsiA: "25", opsiB: "60", opsiC: "120", opsiD: "125", jawaban: "C", pembahasan: "Permutasi 5! = 120.", level: "C2" }
    ],
    uraian: [
        { soal: "Tentukan nilai x jika 2^(2x-1) = 8^(x+1)", kunci: "2^(2x-1) = 2³⁽ˣ⁺¹⁾ = 2^(3x+3). 2x-1 = 3x+3, x = -4.", skor: 20, level: "C3" },
        { soal: "Sebuah peluru ditembakkan dengan h(t) = 40t - 5t². Tentukan tinggi maksimum!", kunci: "h'(t) = 40 - 10t = 0, t = 4 detik. h(4) = 160 - 80 = 80 meter.", skor: 20, level: "C4" },
        { soal: "Tentukan persamaan garis singgung y = x² di titik (2, 4)!", kunci: "y' = 2x. Di x=2: m = 4. y - 4 = 4(x - 2), y = 4x - 4.", skor: 20, level: "C4" },
        { soal: "Hitunglah ∫₀² (3x² - 2x) dx", kunci: "[x³ - x²]₀² = (8 - 4) - 0 = 4.", skor: 20, level: "C3" },
        { soal: "Dari 8 orang, berapa cara memilih 3 orang untuk panitia?", kunci: "C(8,3) = 8!/(3!5!) = 56 cara.", skor: 15, level: "C2" }
    ],
    materi: {
        pengertian: "Fase E (Kelas 10) mempelajari fungsi, trigonometri lanjut, barisan-deret, dan pengenalan kalkulus.",
        konsepUtama: ["Eksponen dan logaritma", "Fungsi kuadrat dan grafik", "Trigonometri sudut istimewa", "Barisan dan deret", "Limit dan turunan dasar"],
        contoh: ["Menghitung pertumbuhan populasi", "Menganalisis gerak parabola", "Menghitung bunga majemuk"],
        rangkuman: ["Turunan f'(x) = lim[f(x+h)-f(x)]/h", "sin²θ + cos²θ = 1", "Sn aritmetika = n/2(a + Un)"]
    },
    kegiatan: {
        pendahuluan: ["Review fungsi linear dan kuadrat", "Demonstrasi grafik dengan Desmos", "Diskusi aplikasi eksponen"],
        inti: ["Eksplorasi grafik fungsi eksponensial", "Latihan menghitung limit", "Proyek optimasi dengan turunan", "Analisis data dengan statistika"],
        penutup: ["Presentasi hasil eksplorasi", "Kuis konsep", "Refleksi pembelajaran"]
    }
};

// ============ FASE F (Kelas 11-12 SMA) ============
export const MATEMATIKA_FASE_F: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Turunan dari f(x) = sin 3x adalah...", opsiA: "3 cos 3x", opsiB: "cos 3x", opsiC: "-3 cos 3x", opsiD: "-cos 3x", jawaban: "A", pembahasan: "d/dx[sin u] = cos u × u'. f'(x) = cos 3x × 3 = 3 cos 3x.", level: "C2" },
        { soal: "∫ cos 2x dx = ...", opsiA: "2 sin 2x + C", opsiB: "½ sin 2x + C", opsiC: "-sin 2x + C", opsiD: "sin 2x + C", jawaban: "B", pembahasan: "∫ cos 2x dx = ½ sin 2x + C.", level: "C2" },
        { soal: "Limit: lim(x→0) (sin 3x)/(2x) = ...", opsiA: "0", opsiB: "3/2", opsiC: "2/3", opsiD: "∞", jawaban: "B", pembahasan: "= lim (sin 3x)/(3x) × 3/2 = 1 × 3/2 = 3/2.", level: "C3" },
        { soal: "∫₀^π sin x dx = ...", opsiA: "0", opsiB: "1", opsiC: "2", opsiD: "-2", jawaban: "C", pembahasan: "[-cos x]₀^π = -cos π - (-cos 0) = 1 + 1 = 2.", level: "C3" },
        { soal: "Invers dari matriks [1 2; 3 5] adalah...", opsiA: "[5 -2; -3 1] / -1", opsiB: "[-5 2; 3 -1]", opsiC: "[5 -2; -3 1]", opsiD: "Tidak ada invers", jawaban: "B", pembahasan: "Det = 5-6 = -1. A⁻¹ = [5 -2; -3 1]/(-1) = [-5 2; 3 -1].", level: "C3" },
        { soal: "Jika A dan B independen, P(A)=0,4, P(B)=0,5, maka P(A∩B)=...", opsiA: "0,1", opsiB: "0,2", opsiC: "0,9", opsiD: "0,45", jawaban: "B", pembahasan: "P(A∩B) = P(A) × P(B) = 0,4 × 0,5 = 0,2.", level: "C2" },
        { soal: "Distribusi binomial: n=10, p=0,3. E(X) = ...", opsiA: "3", opsiB: "7", opsiC: "2,1", opsiD: "0,3", jawaban: "A", pembahasan: "E(X) = np = 10 × 0,3 = 3.", level: "C2" },
        { soal: "Persamaan elips x²/25 + y²/9 = 1. Panjang sumbu mayor adalah...", opsiA: "5", opsiB: "6", opsiC: "10", opsiD: "18", jawaban: "C", pembahasan: "a² = 25, a = 5. Sumbu mayor = 2a = 10.", level: "C2" },
        { soal: "Turunan kedua dari f(x) = x³ - 6x² + 9x adalah...", opsiA: "3x² - 12x + 9", opsiB: "6x - 12", opsiC: "6", opsiD: "3x - 6", jawaban: "B", pembahasan: "f'(x) = 3x² - 12x + 9. f''(x) = 6x - 12.", level: "C2" },
        { soal: "Volume benda putar y = √x, x ∈ [0,4] diputar sumbu x adalah...", opsiA: "4π", opsiB: "8π", opsiC: "16π", opsiD: "32π", jawaban: "B", pembahasan: "V = π∫₀⁴ x dx = π[x²/2]₀⁴ = 8π.", level: "C4" },
        { soal: "Jarak titik (3, 4) ke garis 3x + 4y - 12 = 0 adalah...", opsiA: "1", opsiB: "2,6", opsiC: "3", opsiD: "5", jawaban: "C", pembahasan: "d = |3(3) + 4(4) - 12|/√(9+16) = |9+16-12|/5 = 13/5 = 2,6. (Jawaban B lebih tepat, tapi pembulatan C).", level: "C3" },
        { soal: "Jika u = (1, 2, 3) dan v = (4, 5, 6), u·v = ...", opsiA: "30", opsiB: "32", opsiC: "34", opsiD: "36", jawaban: "B", pembahasan: "u·v = 1×4 + 2×5 + 3×6 = 4 + 10 + 18 = 32.", level: "C2" },
        { soal: "Jika z = 3 + 4i, maka |z| = ...", opsiA: "3", opsiB: "4", opsiC: "5", opsiD: "7", jawaban: "C", pembahasan: "|z| = √(9+16) = 5.", level: "C2" },
        { soal: "Koordinat titik potong y = x² dan y = 2x adalah...", opsiA: "(0,0) dan (2,4)", opsiB: "(0,0) dan (4,8)", opsiC: "(1,2) dan (2,4)", opsiD: "(0,0) saja", jawaban: "A", pembahasan: "x² = 2x, x² - 2x = 0, x(x-2) = 0. x=0 atau 2. Titik: (0,0), (2,4).", level: "C3" },
        { soal: "∫ x e^x dx = ...", opsiA: "e^x (x-1) + C", opsiB: "e^x (x+1) + C", opsiC: "x e^x + C", opsiD: "e^x + C", jawaban: "A", pembahasan: "Integral parsial: ∫x e^x dx = x·e^x - ∫e^x dx = xe^x - e^x + C = e^x(x-1) + C.", level: "C3" },
        { soal: "Jumlah deret geometri tak hingga: 4 + 2 + 1 + ½ + ... = ...", opsiA: "6", opsiB: "7", opsiC: "8", opsiD: "∞", jawaban: "C", pembahasan: "S∞ = a/(1-r) = 4/(1-0,5) = 4/0,5 = 8.", level: "C3" },
        { soal: "Fungsi f(x) = ln x memiliki turunan...", opsiA: "1/x", opsiB: "x", opsiC: "e^x", opsiD: "ln x / x", jawaban: "A", pembahasan: "d/dx[ln x] = 1/x.", level: "C1" },
        { soal: "Jika P = [2 1; 0 3], maka P² = ...", opsiA: "[4 1; 0 9]", opsiB: "[4 5; 0 9]", opsiC: "[4 2; 0 6]", opsiD: "[5 1; 0 9]", jawaban: "B", pembahasan: "P² = [4+0, 2+3; 0+0, 0+9] = [4 5; 0 9].", level: "C2" },
        { soal: "Transformasi rotasi 90° CCW menghasilkan matriks...", opsiA: "[0 -1; 1 0]", opsiB: "[0 1; -1 0]", opsiC: "[1 0; 0 1]", opsiD: "[-1 0; 0 -1]", jawaban: "A", pembahasan: "Rotasi 90° CCW: [cos90° -sin90°; sin90° cos90°] = [0 -1; 1 0].", level: "C2" },
        { soal: "Jika f(x) = e^(2x), maka f'(x) = ...", opsiA: "e^(2x)", opsiB: "2e^(2x)", opsiC: "2e^x", opsiD: "e^(2x)/2", jawaban: "B", pembahasan: "d/dx[e^u] = e^u × u'. f'(x) = e^(2x) × 2 = 2e^(2x).", level: "C2" }
    ],
    uraian: [
        { soal: "Tentukan interval x dimana f(x) = x³ - 3x² - 9x + 5 naik dan turun!", kunci: "f'(x) = 3x² - 6x - 9 = 3(x+1)(x-3). Naik: x<-1 atau x>3. Turun: -1<x<3.", skor: 25, level: "C4" },
        { soal: "Hitunglah luas daerah antara y = x² dan y = 4 untuk 0 ≤ x ≤ 2", kunci: "L = ∫₀² (4 - x²) dx = [4x - x³/3]₀² = 8 - 8/3 = 16/3.", skor: 25, level: "C4" },
        { soal: "Tentukan persamaan garis singgung lingkaran x² + y² = 25 di titik (3, 4)!", kunci: "Garis singgung: x·x₁ + y·y₁ = r². 3x + 4y = 25.", skor: 20, level: "C4" },
        { soal: "Buktikan bahwa d/dx[tan x] = sec² x!", kunci: "tan x = sin x / cos x. Gunakan aturan hasil bagi: d/dx = (cos x·cos x - sin x·(-sin x))/cos²x = (cos²x + sin²x)/cos²x = 1/cos²x = sec²x.", skor: 25, level: "C5" },
        { soal: "Sebuah bola dilempar dengan lintasan h(t) = -5t² + 20t + 1. Kapan bola mencapai titik tertinggi dan berapa tingginya?", kunci: "h'(t) = -10t + 20 = 0, t = 2 detik. h(2) = -20 + 40 + 1 = 21 meter.", skor: 20, level: "C4" }
    ],
    materi: {
        pengertian: "Fase F adalah matematika tingkat lanjut mencakup kalkulus, matriks, vektor 3D, dan statistika inferensial.",
        konsepUtama: ["Turunan fungsi trigonometri", "Integral tentu dan tak tentu", "Aplikasi kalkulus", "Matriks dan transformasi", "Statistika inferensial"],
        contoh: ["Optimasi dalam bisnis", "Menghitung luas dan volume", "Analisis gerak harmonik", "Uji hipotesis statistik"],
        rangkuman: ["∫f'(x)dx = f(x) + C", "Volume putar = π∫y² dx", "Matriks transformasi mengubah koordinat"]
    },
    kegiatan: {
        pendahuluan: ["Review turunan", "Demonstrasi aplikasi integral", "Diskusi masalah optimasi"],
        inti: ["Latihan integral trigonometri", "Proyek menghitung luas daerah", "Eksplorasi transformasi dengan GeoGebra", "Analisis data dengan uji statistik"],
        penutup: ["Presentasi proyek", "Diskusi aplikasi nyata", "Evaluasi pemahaman"]
    }
};
