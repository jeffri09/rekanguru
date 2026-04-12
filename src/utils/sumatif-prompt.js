// ============================================================
// Sumatif Prompt — AI Prompt Templates for Soal Sumatif
// ============================================================

const difficultyLabels = {
  sangat_mudah: 'Sangat Mudah — Soal mengukur pengetahuan dasar/hafalan sederhana (C1 Bloom: Mengingat). Jawaban bisa ditemukan langsung di teks.',
  mudah: 'Mudah — Soal mengukur pemahaman konsep dasar (C2 Bloom: Memahami). Siswa perlu memahami makna, bukan sekadar hafal.',
  sedang: 'Sedang — Soal mengukur kemampuan penerapan (C3 Bloom: Mengaplikasikan). Siswa perlu menerapkan konsep ke situasi baru.',
  sulit: 'Sulit — Soal mengukur kemampuan analisis dan evaluasi (C4-C5 Bloom: Menganalisis, Mengevaluasi). Soal memerlukan penalaran tinggi.',
  sangat_sulit: 'Sangat Sulit — Soal mengukur kemampuan berpikir tingkat tinggi (C6 Bloom: Mencipta/HOTS). Soal bersifat open-ended, kontekstual, atau memerlukan sintesis dari beberapa konsep.',
};

const optionLetters = ['A', 'B', 'C', 'D', 'E'];

/**
 * Generate prompt for Pilihan Ganda (Multiple Choice)
 */
export function pgPrompt(topic, subject, classPhase, difficulty, count, optionCount) {
  const optLabels = optionLetters.slice(0, optionCount).join(', ');
  
  return `ROLE: Kamu adalah guru profesional dan ahli pembuat soal ujian sumatif Kurikulum Merdeka 2026.

TUGAS: Buatkan ${count} soal PILIHAN GANDA untuk ujian sumatif.

DETAIL:
- Mata Pelajaran: ${subject || 'Umum'}
- Fase/Kelas: ${classPhase || '-'}
- Topik/Materi: "${topic}"
- Tingkat Kesulitan: ${difficultyLabels[difficulty] || difficultyLabels.sedang}
- Jumlah Pilihan: ${optionCount} pilihan (${optLabels})

ATURAN PENULISAN SOAL:
1. Setiap soal HARUS memiliki STEM (batang soal) yang jelas dan tidak ambigu.
2. Semua pilihan jawaban harus PLAUSIBLE (masuk akal), bukan asal-asalan.
3. Kunci jawaban HARUS benar dan bisa dipertanggungjawabkan secara akademis.
4. Distribusi kunci jawaban harus MERATA (jangan semua A atau B).
5. Hindari pola "Semua jawaban benar" atau "Tidak ada yang benar" kecuali memang diperlukan.
6. Soal harus ORIGINAL dan relevan dengan materi.
7. Bahasa Indonesia yang baku dan formal.

FORMAT OUTPUT — JSON MURNI (tanpa markdown, tanpa pengantar):
{
  "questions": [
    {
      "number": 1,
      "question": "Teks soal lengkap...",
      "options": {
        "A": "Pilihan A",
        "B": "Pilihan B",
        "C": "Pilihan C"${optionCount >= 4 ? `,
        "D": "Pilihan D"` : ''}${optionCount >= 5 ? `,
        "E": "Pilihan E"` : ''}
      },
      "answer": "B",
      "explanation": "Penjelasan singkat mengapa B benar"
    }
  ]
}`;
}

/**
 * Generate prompt for Isian Singkat (Short Answer)
 */
export function isianPrompt(topic, subject, classPhase, difficulty, count) {
  return `ROLE: Kamu adalah guru profesional dan ahli pembuat soal ujian sumatif Kurikulum Merdeka 2026.

TUGAS: Buatkan ${count} soal ISIAN SINGKAT untuk ujian sumatif.

DETAIL:
- Mata Pelajaran: ${subject || 'Umum'}
- Fase/Kelas: ${classPhase || '-'}
- Topik/Materi: "${topic}"
- Tingkat Kesulitan: ${difficultyLabels[difficulty] || difficultyLabels.sedang}

ATURAN PENULISAN SOAL:
1. Soal harus memiliki jawaban yang PASTI dan SINGKAT (1-3 kata atau angka).
2. Soal tidak boleh ambigu — hanya ada SATU jawaban yang benar.
3. Gunakan kalimat perintah yang jelas: "Sebutkan...", "Tuliskan...", "Berapa...".
4. Soal harus ORIGINAL dan relevan dengan materi.
5. Bahasa Indonesia yang baku dan formal.

FORMAT OUTPUT — JSON MURNI (tanpa markdown, tanpa pengantar):
{
  "questions": [
    {
      "number": 1,
      "question": "Teks soal lengkap...",
      "answer": "Jawaban singkat yang benar"
    }
  ]
}`;
}

/**
 * Generate prompt for Esai (Essay)
 */
export function esaiPrompt(topic, subject, classPhase, difficulty, count) {
  return `ROLE: Kamu adalah guru profesional dan ahli pembuat soal ujian sumatif Kurikulum Merdeka 2026.

TUGAS: Buatkan ${count} soal ESAI/URAIAN untuk ujian sumatif.

DETAIL:
- Mata Pelajaran: ${subject || 'Umum'}
- Fase/Kelas: ${classPhase || '-'}
- Topik/Materi: "${topic}"
- Tingkat Kesulitan: ${difficultyLabels[difficulty] || difficultyLabels.sedang}

ATURAN PENULISAN SOAL:
1. Soal esai harus OPEN-ENDED dan mendorong pemikiran kritis.
2. Sertakan KATA KERJA OPERASIONAL yang jelas: "Jelaskan...", "Analisis...", "Bandingkan...", "Evaluasi...".
3. Setiap soal harus memiliki BOBOT NILAI dan RUBRIK JAWABAN atau kunci jawaban yang komprehensif.
4. Kunci jawaban harus mencakup poin-poin utama yang diharapkan.
5. Soal harus ORIGINAL dan relevan dengan materi.
6. Bahasa Indonesia yang baku dan formal.

FORMAT OUTPUT — JSON MURNI (tanpa markdown, tanpa pengantar):
{
  "questions": [
    {
      "number": 1,
      "question": "Teks soal esai lengkap...",
      "points": 10,
      "answer": "Kunci jawaban/rubrik lengkap yang memuat poin-poin utama yang diharapkan dari siswa..."
    }
  ]
}`;
}

/**
 * Generate prompt for Mencocokkan (Matching)
 */
export function mencocokkanPrompt(topic, subject, classPhase, difficulty, count) {
  return `ROLE: Kamu adalah guru profesional dan ahli pembuat soal ujian sumatif Kurikulum Merdeka 2026.

TUGAS: Buatkan soal MENCOCOKKAN/MENJODOHKAN untuk ujian sumatif dengan ${count} pasangan.

DETAIL:
- Mata Pelajaran: ${subject || 'Umum'}
- Fase/Kelas: ${classPhase || '-'}
- Topik/Materi: "${topic}"
- Tingkat Kesulitan: ${difficultyLabels[difficulty] || difficultyLabels.sedang}

ATURAN PENULISAN SOAL:
1. Buat ${count} pasangan soal (kolom kiri) dan jawaban (kolom kanan).
2. Kolom kiri berisi PERNYATAAN/PERTANYAAN, kolom kanan berisi JAWABAN.
3. Setiap item harus JELAS dan TIDAK AMBIGU — satu soal hanya cocok dengan satu jawaban.
4. TAMBAHKAN 2-3 jawaban PENGECOH di kolom kanan (jumlah jawaban > jumlah soal).
5. Soal harus ORIGINAL dan relevan dengan materi.
6. Bahasa Indonesia yang baku dan formal.

FORMAT OUTPUT — JSON MURNI (tanpa markdown, tanpa pengantar):
{
  "pairs": [
    {
      "number": 1,
      "left": "Pernyataan/soal di kolom kiri",
      "right": "Jawaban yang benar di kolom kanan"
    }
  ],
  "distractors": [
    "Pengecoh 1",
    "Pengecoh 2",
    "Pengecoh 3"
  ]
}`;
}
