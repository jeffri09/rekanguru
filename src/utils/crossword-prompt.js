// ============================================================
// Crossword Prompt — AI generates words + clues for TTS
// Supports: ID, EN, AR (tanpa harakat), AR_H (dengan harakat)
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

export function crosswordPrompt(topic, difficulty, wordCount, clueLang = 'id', answerLang = 'id') {
  const config = difficultyConfig[difficulty] || difficultyConfig.sedang;
  const count = wordCount || 10;
  const clue = langConfig[clueLang] || langConfig.id;
  const answer = langConfig[answerLang] || langConfig.id;

  const isBilingual = clueLang !== answerLang;

  return `ROLE: Kamu adalah guru multilingual ahli pembuat Teka-Teki Silang (TTS) edukatif.

TUGAS: Buat daftar kata beserta petunjuk (clue) untuk Teka-Teki Silang.

RUANG LINGKUP MATERI:
${topic}

JUMLAH KATA/SOAL: Tepat ${count} kata

TINGKAT KESULITAN PETUNJUK:
${config.desc}

===== PENGATURAN BAHASA =====
BAHASA PETUNJUK (Clue): ${clue.name}
BAHASA JAWABAN (Word): ${answer.name}
${isBilingual ? `\n⚠️ Ini TTS BILINGUAL: petunjuk dalam ${clue.name}, jawaban dalam ${answer.name}.` : ''}

ATURAN KATA JAWABAN:
${answer.answerRule}

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
- JANGAN tambahkan teks apapun di luar JSON. Langsung output JSON saja.`;
}
