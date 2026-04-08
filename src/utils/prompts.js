// ============================================================
// AI Prompt Templates for Administrasi Guru & Kepsek
// Integrasi Level Sekolah + 25 Teknik Prompting Lanjutan
// ============================================================

const docTypeLabels = {
  modul_ajar: 'Modul Ajar / RPP Lengkap',
  atp: 'Alur Tujuan Pembelajaran (ATP)',
  prota: 'Program Tahunan (Prota)',
  promes: 'Program Semester (Promes)',
  assesmen: 'Instrumen Asesmen',
  jurnal: 'Jurnal Mengajar Harian',
  rkt: 'Rencana Kerja Tahunan (RKT)',
  rkas: 'Rencana Kegiatan dan Anggaran (RKAS)',
  eds: 'Evaluasi Diri Sekolah (EDS)',
  supervisi: 'Program Supervisi Akademik',
  pengembangan: 'Program Pengembangan Kewirausahaan'
};

const schoolLevelContext = {
  kota: {
    label: 'Sekolah Kota Besar / Maju',
    context: `KONTEKS SEKOLAH (Level Kota Besar/Maju):
- Infrastruktur lengkap: proyektor, lab komputer, internet stabil, perpustakaan digital
- Siswa memiliki akses gawai/laptop pribadi
- Lingkungan urban: bisa menggunakan referensi digital, video YouTube, platform e-learning
- Aktivitas bisa menggunakan Google Classroom, Canva, Kahoot, Quizizz, dll.
- Pembelajaran bisa berbasis proyek digital dan kolaborasi daring
- Orang tua umumnya bisa mendampingi belajar anak dengan teknologi`
  },
  pinggiran: {
    label: 'Sekolah Pinggiran / Peralihan',
    context: `KONTEKS SEKOLAH (Level Pinggiran/Peralihan):
- Infrastruktur terbatas: ada listrik stabil, internet kadang-kadang, proyektor 1-2 unit
- Sebagian siswa punya gawai, sebagian tidak
- Campurkan metode digital dan manual (worksheet cetak + sesekali digital)
- Gunakan media yang bisa dipakai offline (powerpoint cetak, kartu belajar, poster)
- Aktivitas kelompok berbasis lingkungan sekitar + sesekali digital
- Sediakan alternatif non-digital untuk setiap aktivitas digital`
  },
  pelosok: {
    label: 'Sekolah Pelosok / Daerah 3T (Terdepan, Terpencil, Tertinggal)',
    context: `KONTEKS SEKOLAH (Level Pelosok/Daerah 3T):
- Infrastruktur sangat terbatas: listrik mungkin tidak stabil, TIDAK ADA internet
- Siswa TIDAK memiliki gawai/laptop
- SEMUA aktivitas harus bisa dilakukan TANPA teknologi digital
- Gunakan media dari bahan alam, barang bekas, lingkungan sekitar (daun, batu, tanah, dll.)
- Pembelajaran berbasis pengalaman langsung dan eksplorasi alam
- Buku teks mungkin terbatas, guru harus kreatif dengan sumber belajar lokal
- Libatkan kearifan lokal dan konteks budaya setempat
- Asesmen berbasis praktik langsung, lisan, dan portofolio fisik
- Contoh: belajar pecahan dengan memotong buah, belajar geometri dengan daun, belajar IPA dengan observasi alam`
  }
};

function getDocLabels(docTypes) {
  if (!docTypes || docTypes.length === 0) return 'Dokumen Pendidikan';
  return docTypes.map(t => docTypeLabels[t] || t).join(', ');
}

function getSchoolContext(level) {
  return schoolLevelContext[level]?.context || schoolLevelContext.kota.context;
}

/**
 * Generate outline prompt (Komponen Dokumen)
 */
export function outlinePrompt(book) {
  const roleName = book.targetRole === 'guru' ? 'Guru' : 'Kepala Sekolah';
  const docLabels = getDocLabels(book.docTypes);
  const schoolCtx = getSchoolContext(book.schoolLevel);
  
  let prompt = `ROLE & PERSONA:
Kamu adalah Asesor Kurikulum Pusat, Master Teacher, dan ${roleName} Penggerak Nasional yang sangat ahli dalam Kurikulum Merdeka 2026. Tugasmu merancang KERANGKA (Skeleton) dokumen administrasi pendidikan yang komprehensif.

DETAIL PERMINTAAN:
Jenis Dokumen yang Dibutuhkan (Bundel): ${docLabels}
Mata Pelajaran: ${book.subject || '-'}
Fase/Kelas: ${book.classPhase || '-'}

${schoolCtx}
`;

  if (book.topic) {
    prompt += `Topik Spesifik: "${book.topic}"\n`;
  } else {
    prompt += `Topik/Materi: [GENERATE KNOWLEDGE & STEP-BACK] Pengguna tidak memberikan topik spesifik. Lakukan deduksi logis! Tentukan 1 materi esensial/kritis/capaian pembelajaran (CP) paling relevan untuk mata pelajaran dan fase di atas, lalu jadikan itu sebagai bahasan sentral dokumen ini.\n`;
  }

  if (book.description) {
    prompt += `Atensi Khusus (Directional Stimulus): ${book.description}\n`;
  }

  if (book.referenceText) {
    prompt += `\nMATERIAL REFERENSI & RAG CONTEXT (Jadikan acuan utama format/isi):\n${book.referenceText}\n`;
  }

  prompt += `
CHAIN OF THOUGHT (CoT) & TREE OF THOUGHTS (ToT):
Berpikirlah selangkah demi selangkah:
1. Pahami esensi Kurikulum Merdeka (Pendekatan Deep Learning, bukan sekadar hafalan).
2. Pikirkan bahwa dokumen ini merupakan bundel dari: ${docLabels}. Jika ada lebih dari satu, urutkan logika perencanaannya (misal: ATP dulu, lalu Modul Ajar).
3. Alokasikan komponen (bab) dokumen secara proporsional. Buat sebanyak yang diperlukan (idealnya 3-7 komponen per jenis dokumen) agar penjabaran nantinya bisa sangat mendalam.
4. PENTING: Sesuaikan semua aktivitas, media, dan metode dengan LEVEL SEKOLAH yang sudah disebutkan di atas!

SELF-CONSISTENCY & REFLEXION:
Pastikan kerangka yang kamu buat menyediakan ruang KHUSUS untuk mengintegrasikan secara nyata "8 Profil Kelulusan":
(1) Keimanan, (2) Kewargaan, (3) Penalaran kritis, (4) Kreativitas, (5) Kolaborasi, (6) Kemandirian, (7) Kesehatan, (8) Komunikasi.

INSTRUKSI META-PROMPTING & FEW-SHOT:
1. Buatkan komponen-komponen dokumen (sebagai 'chapters') dan sub-komponennya (sebagai 'sections').
2. Format WAJIB berupa JSON murni tanpa ada teks pengantar atau penutup apapun.
3. Nama chapter harus mencerminkan kelompok besar (misal: "1. ATP: Capaian Pembelajaran", "4. Modul Ajar: Langkah Deep Learning").

CONTOH OUTPUT JSON YANG DIHARAPKAN (Strict Zero-Shot Output Schema):
{
  "chapters": [
    {
      "title": "1. [Nama Dokumen] - Informasi Umum & Esensi",
      "sections": ["Identitas Sekolah", "Capaian Pembelajaran Utama", "Fokus 8 Profil Lulusan"]
    },
    {
      "title": "2. [Nama Dokumen] - Inti Pembelajaran (Deep Learning)",
      "sections": ["Pemahaman Bermakna", "Pertanyaan Pemantik", "Desain Aktivitas Eksplorasi"]
    }
  ]
}
`;

  return prompt;
}

/**
 * Generate chapter content prompt
 */
export function chapterPrompt(book, chapter, chapterIndex, prevSummary, totalChapters) {
  const docLabels = getDocLabels(book.docTypes);
  const roleName = book.targetRole === 'guru' ? 'Guru' : 'Kepala Sekolah';
  const schoolCtx = getSchoolContext(book.schoolLevel);

  const lengthMap = {
    pendek: 'singkat, berfokus pada tabel atau poin-poin padat (sekitar 300-500 kata).',
    sedang: 'cukup detail dengan penjabaran operasional (sekitar 800-1200 kata).',
    panjang: 'sangat komprehensif, akademis, dan terperinci level teknis (sekitar 1500-2500 kata).',
  };
  const targetWords = lengthMap[book.chapterLength] || 'cukup detail';

  let prompt = `ROLE & CONTEXT:
Kamu adalah ${roleName} Profesional, Ahli Kurikulum Merdeka 2026, dan penulis dokumen akademis resmi. Kamu sedang menyusun bundel dokumen: ${docLabels}.

${schoolCtx}

IDENTITAS PROYEK:
Topik/Capaian: "${book.topic || 'Sesuai dengan deduksi kurikulum esensial sebelumnya'}"
Mata Pelajaran: ${book.subject || '-'}
Fase/Kelas: ${book.classPhase || '-'}
Target Kedalaman: ${targetWords}

TUGAS SPESIFIK (Instruction Prompting):
Tuliskan konten komprehensif untuk BAGIAN ke-${chapterIndex + 1} dari total ${totalChapters} bagian.
Nama Bagian: "${chapter.title}"
Sub-bagian yang WAJIB dibahas: ${chapter.sections.join(', ')}

PENTING TENTANG LEVEL SEKOLAH:
- Pastikan SEMUA contoh aktivitas, media, dan metode SESUAI dengan konteks sekolah di atas.
- Jangan menyebutkan alat/media yang TIDAK tersedia di level sekolah tersebut.
`;

  if (prevSummary) {
    prompt += `\nKONEKSI LOGIS (Memory & Prompt Chaining):\nBerikut ringkasan bagian sebelumnya. Jaga kesinambungan tata waktu dan narasi:\n${prevSummary}\n`;
  }

  if (book.referenceText) {
    prompt += `\nRAG CONTEXT (Acuan Wajib):\n${book.referenceText.substring(0, 2000)}\n`;
  }

  prompt += `
SCAMPER & WHAT-IF THINKING (Standar Penulisan):
- Apa jadinya jika metode ini gagal? Antisipasi dengan diferensiasi pembelajaran/mitigasi risiko.
- Subtitusi elemen hafalan konvensional dengan *Deep Learning* (Eksplorasi, Meaningful Learning).

SELF-CORRECTION & REFLEXION (Saat menulis):
1. Apakah saya sudah eksplisit menyebutkan taktik pencapaian "8 Profil Kelulusan" (Iman, Kewargaan, Nalar, Kreatif, Kolaborasi, Mandiri, Sehat, Komunikasi)? Jika belum, integrasikan pada metode kerjanya.
2. Gunakan gaya bahasa naskah dinas pendidikan formal yang siap cetak.
3. BUAT SANGAT REALISTIS. Gunakan contoh nama kegiatan konkret, estimasi menit, rubrik nilai asli, bukan sekadar teori.

META-PROMPTING DONT's:
1. JANGAN mendaur ulang judul bagian terus menerus. Langsung masuk ke konten (Markdown h2/h3).
2. Jika butuh data matriks (seperti ATP / Promes / Rubrik), FORMAT OTOMATIS menggunakan Tabel Markdown agar sangat rapi.
3. JANGAN buat pengantar generik/kesimpulan penutup. Penulisan ini adalah satu komponen dari dokumen raksasa utuh. Langsung serang inti materi "${chapter.title}".
`;

  return prompt;
}

/**
 * Generate summary prompt for a chapter
 */
export function summaryPrompt(chapterTitle, chapterContent) {
  return `Buatlah ringkasan singkat (Active-Prompting) dalam 3 bullet point padat dari dokumen berikut. 
Fokus pada: Apa keputusan akhirnya? Apa prasyarat untuk bab selanjutnya? (Abaikan basa-basi).

Nama Bagian: "${chapterTitle}"
Konten Inti:
${chapterContent.substring(0, 3000)}
`;
}
