export function lccSoalPrompt(subject, phase, participants, questionCount, difficulty) {
  return `Buatkan paket soal untuk Lomba Cerdas Cermat (LCC) tingkat sekolah.
Mata Pelajaran: ${subject}
Babak: ${phase}
Tingkat Kesulitan: ${difficulty}
Jumlah Regu/Peserta: ${participants} regu
Jumlah Soal per Regu: ${questionCount} soal

Tugas Anda:
Buatkan soal untuk masing-masing regu secara spesifik. Setiap regu harus mendapatkan ${questionCount} soal yang berbeda dari regu lainnya.
Format soal adalah pertanyaan lisan/langsung (bukan pilihan ganda).

Format Output (wajib JSON yang valid):
{
  "subject": "${subject}",
  "phase": "${phase}",
  "teams": [
    {
      "team_name": "Regu 1",
      "questions": [
        {
          "number": 1,
          "question": "Pertanyaan...",
          "answer": "Kunci jawaban..."
        }
      ]
    }
  ]
}

Pastikan:
1. Menghasilkan tepat ${participants} regu.
2. Masing-masing regu memiliki tepat ${questionCount} soal.
3. Kunci jawaban jelas dan singkat.
4. Output HANYA JSON tanpa teks pengantar atau markdown lainnya.`;
}

export function generatePosterPrompt(data) {
  let sponsorText = data.sponsor ? "\\n- Terdapat logo sponsor (sponsor.png) yang diposisikan di bagian footer." : "";
  let termsList = data.terms.split('\\n').map(t => `- ${t}`).join('\\n');

  return `Buatkan desain poster acara Lomba Cerdas Cermat dengan spesifikasi visual sebagai berikut:

[TATA LETAK VISUAL]
- Tema: Edukatif, modern, dan profesional.
- Header: Berikan ruang kosong di pojok kanan atas secara proporsional untuk penempatan logo.png (akan dilampirkan terpisah).
- Body: Berisikan seluruh teks informasi lomba.
- Footer: Tuliskan nama penyelenggara lomba yaitu "${data.organizerName}".${sponsorText}

[TEKS INFORMASI LOMBA]
Nama Acara: Lomba Cerdas Cermat
Penyelenggara: ${data.organizerName}
Waktu Pelaksanaan: ${data.date}
Tempat: ${data.venue}
Hadiah: ${data.prizes}

Syarat dan Ketentuan:
${termsList}

[INSTRUKSI UNTUK AI IMAGE GENERATOR]
Create a highly professional and modern educational poster for a quiz competition. The design should feature dynamic and premium aesthetics, using vibrant yet harmonious colors (like a combination of deep blue, gold, and white). Do not include actual human faces. Include placeholder areas specifically matching this requirement: a designated space at the top right corner for a logo. The center body should have elegant typography layout for event details. The footer should feature the text "${data.organizerName}". Ensure the layout looks like a high-quality graphic design template.`;
}
