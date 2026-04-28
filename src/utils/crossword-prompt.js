// ============================================================
// Crossword Prompt — AI generates words + clues for TTS (v2)
// Supports: ID, EN, AR (tanpa harakat), AR_H (dengan harakat)
// Added: word length constraints, grade level awareness
// ============================================================

const difficultyConfig = {
  sangat_mudah: { desc: 'Sangat Mudah — petunjuk sangat jelas dan langsung, hampir menyebutkan jawaban.' },
  mudah: { desc: 'Mudah — petunjuk sederhana dan langsung, sinonim atau definisi singkat.' },
  sedang: { desc: 'Sedang — petunjuk berupa definisi tematik atau deskripsi, perlu sedikit berpikir.' },
  sulit: { desc: 'Sulit — petunjuk berupa analogi, hubungan sebab-akibat, atau deskripsi tidak langsung.' },
  sangat_sulit: { desc: 'Sangat Sulit — petunjuk abstrak, kiasan, atau membutuhkan pengetahuan mendalam.' },
};

const langConfig = {
  id: {
    name: 'Bahasa Indonesia',
    answerRule: 'Tulis kata jawaban dalam HURUF KAPITAL Latin (A-Z). TANPA spasi, angka, atau tanda baca. Gabung jika dua kata, contoh: FOTOSINTESIS.',
    clueRule: 'Tulis petunjuk dalam Bahasa Indonesia yang baik dan benar.',
  },
  en: {
    name: 'English',
    answerRule: 'Write answer words in UPPERCASE Latin letters (A-Z). NO spaces, numbers, or punctuation. Merge multi-word answers, e.g., PHOTOSYNTHESIS.',
    clueRule: 'Write clues in clear English.',
  },
  ar: {
    name: 'العربية (tanpa harakat)',
    answerRule: `Tulis kata jawaban dalam huruf Arab TANPA harakat (tanpa fathah, kasrah, dhammah, sukun, shadda, tanwin, dll).
Setiap huruf Arab menempati 1 kotak. Contoh: كتاب = 4 kotak (ك, ت, ا, ب).
JANGAN gunakan spasi, angka, atau tanda baca.`,
    clueRule: 'Tulis petunjuk dalam bahasa Arab TANPA harakat.',
  },
  ar_h: {
    name: 'العربية (dengan harakat)',
    answerRule: `Tulis kata jawaban dalam huruf Arab DENGAN harakat lengkap (fathah, kasrah, dhammah, sukun, shadda, tanwin).
Setiap huruf dasar (tanpa harakatnya) menempati 1 kotak, harakat melekat pada hurufnya.
Contoh: كِتَابٌ = 4 kotak (كِ, تَ, ا, بٌ).
JANGAN gunakan spasi, angka, atau tanda baca selain harakat.`,
    clueRule: 'Tulis petunjuk dalam bahasa Arab DENGAN harakat lengkap agar mudah dibaca oleh pemula.',
  },
};

/**
 * Grade level config — adjusts vocabulary and complexity expectations
 */
const gradeLevelConfig = {
  sd: {
    name: 'SD (Sekolah Dasar)',
    wordRule: 'Gunakan kosakata yang sederhana dan familiar untuk anak SD. Panjang kata ideal 3-8 huruf. Hindari istilah teknis yang terlalu kompleks.',
    minLen: 3,
    maxLen: 10,
  },
  smp: {
    name: 'SMP (Sekolah Menengah Pertama)',
    wordRule: 'Gunakan kosakata level SMP. Panjang kata ideal 4-12 huruf. Boleh menggunakan istilah teknis dasar sesuai mata pelajaran.',
    minLen: 3,
    maxLen: 14,
  },
  sma: {
    name: 'SMA (Sekolah Menengah Atas)',
    wordRule: 'Gunakan kosakata level SMA. Panjang kata ideal 4-15 huruf. Boleh menggunakan istilah teknis, ilmiah, dan akademis.',
    minLen: 3,
    maxLen: 16,
  },
  smk: {
    name: 'SMK (Sekolah Menengah Kejuruan)',
    wordRule: 'Gunakan kosakata level SMK. Panjang kata ideal 4-15 huruf. Fokus pada istilah praktis dan teknis sesuai jurusan.',
    minLen: 3,
    maxLen: 16,
  },
  ma: {
    name: 'MA (Madrasah Aliyah)',
    wordRule: 'Gunakan kosakata level MA. Panjang kata ideal 4-15 huruf. Boleh menggunakan istilah teknis, ilmiah, keagamaan, dan akademis.',
    minLen: 3,
    maxLen: 16,
  },
  umum: {
    name: 'Umum',
    wordRule: 'Gunakan kosakata umum. Panjang kata ideal 3-15 huruf.',
    minLen: 3,
    maxLen: 16,
  },
};

export function crosswordPrompt(topic, difficulty, wordCount, clueLang = 'id', answerLang = 'id', gradeLevel = 'umum') {
  const config = difficultyConfig[difficulty] || difficultyConfig.sedang;
  const count = wordCount || 10;
  const clue = langConfig[clueLang] || langConfig.id;
  const answer = langConfig[answerLang] || langConfig.id;
  const grade = gradeLevelConfig[gradeLevel] || gradeLevelConfig.umum;

  const isBilingual = clueLang !== answerLang;

  return `ROLE: Kamu adalah guru multilingual ahli pembuat Teka-Teki Silang (TTS) edukatif.

TUGAS: Buat daftar kata beserta petunjuk (clue) untuk Teka-Teki Silang.

RUANG LINGKUP MATERI:
${topic}

JUMLAH KATA/SOAL: Tepat ${count} kata

JENJANG PENDIDIKAN: ${grade.name}
${grade.wordRule}

TINGKAT KESULITAN PETUNJUK:
${config.desc}

===== PENGATURAN BAHASA =====
BAHASA PETUNJUK (Clue): ${clue.name}
BAHASA JAWABAN (Word): ${answer.name}
${isBilingual ? `\n⚠️ Ini TTS BILINGUAL: petunjuk dalam ${clue.name}, jawaban dalam ${answer.name}.` : ''}

ATURAN KATA JAWABAN:
${answer.answerRule}
- Panjang kata MINIMUM: ${grade.minLen} huruf
- Panjang kata MAKSIMUM: ${grade.maxLen} huruf
- Usahakan variasi panjang kata (ada yang pendek dan panjang)
- Usahakan variasi huruf awal agar kata-kata bisa saling bersilangan dengan baik

ATURAN PETUNJUK:
${clue.clueRule}
Sesuaikan tingkat kesulitan: ${config.desc}

FORMAT OUTPUT (JSON MURNI, TANPA teks lain):
{
  "title": "TTS: [Judul Tema]",
  "words": [
    {"word": "JAWABAN1", "clue": "Petunjuk 1"},
    {"word": "JAWABAN2", "clue": "Petunjuk 2"}
  ]
}

PENTING:
- Buat TEPAT ${count} kata, tidak kurang tidak lebih.
- Jawaban HANYA berisi huruf (sesuai bahasa), tanpa spasi/angka/tanda baca${answerLang === 'ar_h' ? ' (kecuali harakat)' : ''}.
- Panjang setiap kata HARUS antara ${grade.minLen}-${grade.maxLen} huruf.
- Variasikan huruf awal kata — JANGAN banyak kata yang mulai dengan huruf yang sama.
- JANGAN tambahkan teks apapun di luar JSON. Langsung output JSON saja.`;
}
