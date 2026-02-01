/**
 * Content Bank - Database Konten Berkualitas
 * Berisi soal, materi, dan kegiatan per mata pelajaran
 */

// ============ TIPE DATA ============
export interface SoalBank {
    soal: string;
    opsiA: string;
    opsiB: string;
    opsiC: string;
    opsiD: string;
    jawaban: 'A' | 'B' | 'C' | 'D';
    pembahasan: string;
    level: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
}

export interface SoalUraian {
    soal: string;
    kunci: string;
    skor: number;
    level: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
}

export interface MateriKonten {
    pengertian: string;
    konsepUtama: string[];
    contoh: string[];
    rangkuman: string[];
}

export interface KegiatanPembelajaran {
    pendahuluan: string[];
    inti: string[];
    penutup: string[];
}

// ============ MATEMATIKA - BILANGAN ============
export const MATEMATIKA_BILANGAN: {
    pg: SoalBank[];
    uraian: SoalUraian[];
    materi: MateriKonten;
    kegiatan: KegiatanPembelajaran;
} = {
    pg: [
        { soal: "Hasil dari -15 + 8 adalah...", opsiA: "-23", opsiB: "-7", opsiC: "7", opsiD: "23", jawaban: "B", pembahasan: "Penjumlahan bilangan bulat berbeda tanda: ambil tanda bilangan yang lebih besar nilainya. |-15| > |8|, jadi hasilnya negatif. 15-8=7, maka hasilnya -7.", level: "C1" },
        { soal: "Nilai dari 24 ÷ (-6) × 2 adalah...", opsiA: "-8", opsiB: "-4", opsiC: "4", opsiD: "8", jawaban: "A", pembahasan: "Operasi dari kiri ke kanan: 24÷(-6)=-4, lalu -4×2=-8", level: "C2" },
        { soal: "Suhu di puncak gunung -5°C. Jika suhu naik 12°C, suhu sekarang adalah...", opsiA: "-17°C", opsiB: "-7°C", opsiC: "7°C", opsiD: "17°C", jawaban: "C", pembahasan: "-5 + 12 = 7°C", level: "C3" },
        { soal: "Hasil dari (-3)² × (-2)³ adalah...", opsiA: "-72", opsiB: "-36", opsiC: "36", opsiD: "72", jawaban: "A", pembahasan: "(-3)²=9 dan (-2)³=-8. Maka 9×(-8)=-72", level: "C3" },
        { soal: "Faktor prima dari 84 adalah...", opsiA: "2, 3, 5", opsiB: "2, 3, 7", opsiC: "2, 5, 7", opsiD: "3, 5, 7", jawaban: "B", pembahasan: "84=2²×3×7, jadi faktor primanya 2, 3, 7", level: "C2" },
        { soal: "KPK dari 12 dan 18 adalah...", opsiA: "6", opsiB: "36", opsiC: "72", opsiD: "216", jawaban: "B", pembahasan: "12=2²×3, 18=2×3². KPK=2²×3²=36", level: "C2" },
        { soal: "FPB dari 48 dan 60 adalah...", opsiA: "4", opsiB: "6", opsiC: "12", opsiD: "24", jawaban: "C", pembahasan: "48=2⁴×3, 60=2²×3×5. FPB=2²×3=12", level: "C2" },
        { soal: "Nilai dari ∛-27 adalah...", opsiA: "-9", opsiB: "-3", opsiC: "3", opsiD: "9", jawaban: "B", pembahasan: "∛-27 = -3 karena (-3)³ = -27", level: "C1" },
        { soal: "Bentuk baku dari 0,00045 adalah...", opsiA: "4,5 × 10⁻⁴", opsiB: "4,5 × 10⁻³", opsiC: "45 × 10⁻⁵", opsiD: "0,45 × 10⁻³", jawaban: "A", pembahasan: "0,00045 = 4,5 × 10⁻⁴", level: "C2" },
        { soal: "Hasil dari 2⁵ ÷ 2³ × 2² adalah...", opsiA: "4", opsiB: "8", opsiC: "16", opsiD: "32", jawaban: "C", pembahasan: "2⁵÷2³×2² = 2⁵⁻³⁺² = 2⁴ = 16", level: "C3" },
        { soal: "Urutan bilangan dari terkecil: -8, 3, -5, 0, 7 adalah...", opsiA: "-8, -5, 0, 3, 7", opsiB: "-5, -8, 0, 3, 7", opsiC: "0, 3, -5, 7, -8", opsiD: "7, 3, 0, -5, -8", jawaban: "A", pembahasan: "Urutan dari terkecil ke terbesar: -8 < -5 < 0 < 3 < 7", level: "C2" },
        { soal: "Jika a = -4 dan b = 3, nilai dari 2a² - 3b adalah...", opsiA: "23", opsiB: "25", opsiC: "41", opsiD: "-41", jawaban: "A", pembahasan: "2×(-4)² - 3×3 = 2×16 - 9 = 32-9 = 23", level: "C3" },
        { soal: "Hasil dari 3/4 + 2/5 adalah...", opsiA: "5/9", opsiB: "23/20", opsiC: "5/20", opsiD: "6/9", jawaban: "B", pembahasan: "3/4 + 2/5 = 15/20 + 8/20 = 23/20", level: "C2" },
        { soal: "Nilai dari 2,5 × 1,2 adalah...", opsiA: "2,0", opsiB: "3,0", opsiC: "3,7", opsiD: "30", jawaban: "B", pembahasan: "2,5 × 1,2 = 3,0", level: "C1" },
        { soal: "Perbandingan senilai: Jika 5 kg apel seharga Rp75.000, harga 8 kg apel adalah...", opsiA: "Rp100.000", opsiB: "Rp110.000", opsiC: "Rp120.000", opsiD: "Rp125.000", jawaban: "C", pembahasan: "8/5 × 75.000 = 120.000", level: "C3" },
        { soal: "Lawan (invers) dari -7 adalah...", opsiA: "-7", opsiB: "7", opsiC: "1/7", opsiD: "-1/7", jawaban: "B", pembahasan: "Invers penjumlahan dari -7 adalah 7 karena -7+7=0", level: "C1" },
        { soal: "Nilai mutlak dari -15 ditulis...", opsiA: "|-15| = -15", opsiB: "|-15| = 15", opsiC: "|15| = -15", opsiD: "-|15| = 15", jawaban: "B", pembahasan: "Nilai mutlak selalu positif. |-15| = 15", level: "C1" },
        { soal: "Hasil dari (-6) + (-4) - (-3) adalah...", opsiA: "-13", opsiB: "-7", opsiC: "7", opsiD: "13", jawaban: "B", pembahasan: "(-6)+(-4)-(-3) = -6-4+3 = -10+3 = -7", level: "C2" },
        { soal: "Bilangan prima antara 20 dan 30 adalah...", opsiA: "21, 23, 27", opsiB: "23, 29", opsiC: "23, 25, 29", opsiD: "21, 23, 29", jawaban: "B", pembahasan: "Bilangan prima antara 20-30: 23 dan 29", level: "C1" },
        { soal: "Hasil dari 2³ + 3² adalah...", opsiA: "11", opsiB: "17", opsiC: "25", opsiD: "36", jawaban: "B", pembahasan: "2³ + 3² = 8 + 9 = 17", level: "C1" }
    ],
    uraian: [
        { soal: "Jelaskan perbedaan antara bilangan bulat positif dan bilangan bulat negatif! Berikan masing-masing 3 contoh!", kunci: "Bilangan bulat positif adalah bilangan yang lebih besar dari nol (di sebelah kanan nol pada garis bilangan), contoh: 1, 5, 100. Bilangan bulat negatif adalah bilangan yang lebih kecil dari nol (di sebelah kiri nol pada garis bilangan), contoh: -1, -5, -100.", skor: 15, level: "C2" },
        { soal: "Suhu di kota A adalah -3°C dan suhu di kota B adalah 8°C. Hitunglah selisih suhu kedua kota dan tentukan kota mana yang lebih dingin!", kunci: "Selisih = 8 - (-3) = 8 + 3 = 11°C. Kota A lebih dingin karena suhunya -3°C (di bawah nol).", skor: 20, level: "C3" },
        { soal: "Tentukan KPK dan FPB dari 36 dan 48. Jelaskan langkah pengerjaannya!", kunci: "Faktorisasi prima: 36=2²×3², 48=2⁴×3. FPB = 2²×3 = 12 (ambil pangkat terkecil). KPK = 2⁴×3² = 144 (ambil pangkat terbesar).", skor: 25, level: "C3" },
        { soal: "Analisislah mengapa hasil perkalian dua bilangan negatif selalu positif!", kunci: "Perkalian bilangan negatif dengan negatif menghasilkan positif karena mengikuti pola: (-1)×(-1)=1. Ini dapat dibuktikan: a×0=0, maka a×(b+(-b))=0, sehingga ab+a(-b)=0. Jika a negatif dan b positif, ab negatif, maka a(-b) harus positif.", skor: 25, level: "C4" },
        { soal: "Pak Budi memiliki uang Rp500.000. Ia membeli barang seharga Rp350.000 dan menerima uang Rp200.000 dari temannya. Berapa sisa uang Pak Budi?", kunci: "Sisa = 500.000 - 350.000 + 200.000 = 350.000. Jadi sisa uang Pak Budi adalah Rp350.000.", skor: 15, level: "C3" }
    ],
    materi: {
        pengertian: "Bilangan bulat adalah himpunan bilangan yang terdiri dari bilangan bulat negatif, nol, dan bilangan bulat positif. Himpunan bilangan bulat dilambangkan dengan Z = {..., -3, -2, -1, 0, 1, 2, 3, ...}.",
        konsepUtama: [
            "Bilangan bulat positif: bilangan asli (1, 2, 3, ...)",
            "Bilangan bulat negatif: lawan dari bilangan asli (-1, -2, -3, ...)",
            "Nol (0): bukan positif dan bukan negatif",
            "Operasi pada bilangan bulat: penjumlahan, pengurangan, perkalian, pembagian",
            "Sifat-sifat operasi: komutatif, asosiatif, distributif"
        ],
        contoh: [
            "Suhu di bawah nol derajat: -5°C",
            "Kedalaman laut: -100 meter dari permukaan",
            "Utang: -Rp50.000",
            "Lantai basement: -1, -2",
            "Elevasi di bawah permukaan laut: -10 mdpl"
        ],
        rangkuman: [
            "Bilangan bulat terdiri dari negatif, nol, dan positif",
            "Perkalian/pembagian tanda sama = positif",
            "Perkalian/pembagian tanda berbeda = negatif",
            "Semakin ke kiri pada garis bilangan, nilainya semakin kecil"
        ]
    },
    kegiatan: {
        pendahuluan: [
            "Guru menampilkan gambar termometer yang menunjukkan suhu negatif",
            "Siswa diminta menyebutkan contoh bilangan negatif dalam kehidupan sehari-hari",
            "Guru menjelaskan tujuan pembelajaran hari ini"
        ],
        inti: [
            "Siswa mengamati garis bilangan dan mengidentifikasi letak bilangan bulat",
            "Diskusi kelompok: mengurutkan bilangan bulat dari terkecil ke terbesar",
            "Latihan operasi hitung bilangan bulat dengan kartu bilangan",
            "Presentasi hasil diskusi kelompok",
            "Guru memberikan penguatan konsep"
        ],
        penutup: [
            "Siswa menyimpulkan materi dengan bimbingan guru",
            "Kuis singkat 5 soal untuk mengukur pemahaman",
            "Refleksi: apa yang sudah dipahami dan yang masih bingung"
        ]
    }
};

// ============ HELPER FUNCTION ============
import { BAHASA_INDONESIA_TEKS, IPA_PENCERNAAN } from './contentBankExtended';

export function getSoalByMapelTopik(mapel: string, topik: string): { pg: SoalBank[]; uraian: SoalUraian[] } {
    const m = mapel.toLowerCase();
    const t = topik.toLowerCase();

    if (m.includes('matematika')) {
        return { pg: MATEMATIKA_BILANGAN.pg, uraian: MATEMATIKA_BILANGAN.uraian };
    }
    if (m.includes('bahasa indonesia') || m.includes('b. indonesia')) {
        return { pg: BAHASA_INDONESIA_TEKS.pg, uraian: BAHASA_INDONESIA_TEKS.uraian };
    }
    if (m.includes('ipa') || m.includes('ilmu pengetahuan alam') || t.includes('pencernaan') || t.includes('sistem')) {
        return { pg: IPA_PENCERNAAN.pg, uraian: IPA_PENCERNAAN.uraian };
    }
    // Default
    return { pg: MATEMATIKA_BILANGAN.pg, uraian: MATEMATIKA_BILANGAN.uraian };
}

export function getMateriByMapelTopik(mapel: string, topik: string): MateriKonten {
    const m = mapel.toLowerCase();

    if (m.includes('matematika')) {
        return MATEMATIKA_BILANGAN.materi;
    }
    if (m.includes('bahasa indonesia') || m.includes('b. indonesia')) {
        return BAHASA_INDONESIA_TEKS.materi;
    }
    if (m.includes('ipa') || m.includes('ilmu pengetahuan alam')) {
        return IPA_PENCERNAAN.materi;
    }
    return MATEMATIKA_BILANGAN.materi;
}

export function getKegiatanByMapelTopik(mapel: string, topik: string): KegiatanPembelajaran {
    const m = mapel.toLowerCase();

    if (m.includes('matematika')) {
        return MATEMATIKA_BILANGAN.kegiatan;
    }
    if (m.includes('bahasa indonesia') || m.includes('b. indonesia')) {
        return BAHASA_INDONESIA_TEKS.kegiatan;
    }
    if (m.includes('ipa') || m.includes('ilmu pengetahuan alam')) {
        return IPA_PENCERNAAN.kegiatan;
    }
    return MATEMATIKA_BILANGAN.kegiatan;
}

// Format soal PG untuk output
export function formatSoalPG(soalList: SoalBank[], count: number = 20): string {
    const selected = soalList.slice(0, count);
    return selected.map((s, i) =>
        `${i + 1}. ${s.soal}\n   a. ${s.opsiA}\n   b. ${s.opsiB}\n   c. ${s.opsiC}\n   d. ${s.opsiD}`
    ).join('\n\n');
}

// Format kunci jawaban PG
export function formatKunciPG(soalList: SoalBank[], count: number = 20): string {
    const selected = soalList.slice(0, count);
    let table = '| No | Jawaban | Pembahasan |\n|-----|---------|------------|\n';
    table += selected.map((s, i) => `| ${i + 1} | ${s.jawaban} | ${s.pembahasan} |`).join('\n');
    return table;
}

// Format soal uraian untuk output
export function formatSoalUraian(soalList: SoalUraian[]): string {
    return soalList.map((s, i) =>
        `${i + 1}. **(${s.level} - Skor ${s.skor})** ${s.soal}`
    ).join('\n\n');
}

// Format kunci jawaban uraian
export function formatKunciUraian(soalList: SoalUraian[]): string {
    return soalList.map((s, i) =>
        `**${i + 1}. (Skor ${s.skor})**\n${s.kunci}`
    ).join('\n\n');
}
