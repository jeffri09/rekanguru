// ============================================================
// AI Prompt Templates for Administrasi Guru & Kepsek
// Integrasi Level Sekolah + 25 Teknik Prompting Lanjutan
// + CP Scanning + Distribusi Modul Ajar Multi-Pertemuan
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

// Template outline spesifik per docType
const docTypeOutlineTemplates = {
  modul_ajar: [
    'Informasi Umum (Identitas Modul, Kompetensi Awal, Profil Pelajar Pancasila, Sarana & Prasarana, Target Peserta Didik, Model Pembelajaran)',
    'Komponen Inti (Tujuan Pembelajaran, Pemahaman Bermakna, Pertanyaan Pemantik, Persiapan Pembelajaran)',
    'Kegiatan Pembelajaran (Pendahuluan/Apersepsi, Inti/Deep Learning, Penutup/Refleksi)',
    'Asesmen (Diagnostik Awal, Formatif Proses, Sumatif Akhir, Rubrik Penilaian)',
    'Pengayaan & Remidial (Kegiatan Pengayaan, Program Remidial, Diferensiasi)',
    'Lampiran (LKPD, Bahan Bacaan, Glosarium, Daftar Pustaka)',
  ],
  atp: [
    'Analisis Capaian Pembelajaran (CP) per Fase',
    'Penjabaran Tujuan Pembelajaran dari setiap CP',
    'Alur / Urutan Tujuan Pembelajaran (Matriks ATP)',
    'Indikator Pencapaian & Profil Lulusan Terkait',
    'Pemetaan Asesmen per Tujuan Pembelajaran',
  ],
  prota: [
    'Identitas Program Tahunan',
    'Analisis Kalender Pendidikan & Minggu Efektif',
    'Distribusi Materi per Semester (Matriks Alokasi)',
    'Rencana Asesmen Tahunan',
    'Catatan & Penyesuaian',
  ],
  promes: [
    'Identitas Program Semester',
    'Distribusi Materi per Bulan/Minggu (Matriks)',
    'Alokasi Waktu Detail per Topik',
    'Jadwal Asesmen Formatif & Sumatif',
    'Hari Efektif & Non-Efektif',
  ],
  assesmen: [
    'Kisi-Kisi Asesmen (Matriks CP-TP-Indikator)',
    'Instrumen Asesmen Diagnostik',
    'Instrumen Asesmen Formatif (Proses)',
    'Instrumen Asesmen Sumatif (Akhir)',
    'Rubrik Penilaian & Pedoman Penskoran',
    'Analisis Butir Soal & Validitas',
  ],
  jurnal: [
    'Format Jurnal Mengajar Harian',
    'Template Catatan Pelaksanaan Pembelajaran',
    'Catatan Refleksi & Tindak Lanjut',
    'Capaian Siswa Harian',
  ],
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
 * Format CP data as structured text for injection into prompts
 */
function formatCpDataForPrompt(cpData) {
  if (!cpData || cpData.length === 0) return '';
  
  let text = '\n📌 CAPAIAN PEMBELAJARAN (CP) RESMI YANG TELAH DIVERIFIKASI:\n';
  text += '══════════════════════════════════════════════\n';
  cpData.forEach((cp, idx) => {
    text += `CP-${idx + 1}${cp.code ? ` [${cp.code}]` : ''}:\n`;
    text += `  Deskripsi: ${cp.description}\n`;
    if (cp.profilLulusan && cp.profilLulusan.length > 0) {
      text += `  Profil Lulusan Terkait: ${cp.profilLulusan.join(', ')}\n`;
    }
    text += '\n';
  });
  text += '══════════════════════════════════════════════\n';
  text += 'INSTRUKSI KRITIS: Gunakan CP di atas sebagai SATU-SATUNYA sumber materi. JANGAN membuat CP sendiri atau menggunakan CP dari sumber lain. Semua tujuan pembelajaran, materi, dan asesmen HARUS merujuk langsung ke CP ini.\n';
  return text;
}

/**
 * Format distribusi pertemuan for prompt injection
 */
function formatDistribusiForPrompt(distribusi) {
  if (!distribusi || distribusi.length === 0) return '';
  
  let text = '\n📅 DISTRIBUSI PERTEMUAN:\n';
  text += '══════════════════════════════════════════════\n';
  distribusi.forEach(p => {
    if (p.type === 'sumatif') {
      text += `  Pertemuan ${p.pertemuan}: 📝 SUMATIF HARIAN (Evaluasi CP sebelumnya)\n`;
    } else {
      text += `  Pertemuan ${p.pertemuan}: 📚 ${p.cpTitle || 'Materi CP'}\n`;
    }
  });
  text += '══════════════════════════════════════════════\n';
  return text;
}

/**
 * Format alokasi waktu for prompt injection (Phase 2)
 */
function formatAlokasiForPrompt(book) {
  const a = book.alokasiWaktu || {};
  const durasiJP = a.durasiJP || 40;
  const jpPerPertemuan = a.jpPerPertemuan || 2;
  const totalMenit = jpPerPertemuan * durasiJP;
  return `\nALOKASI WAKTU (SANGAT PENTING untuk estimasi menit per aktivitas):
- Durasi per JP: ${durasiJP} menit
- JP per Pertemuan: ${jpPerPertemuan} JP = ${totalMenit} menit total
- Setiap langkah pembelajaran HARUS memiliki estimasi menit yang tepat
- Total estimasi menit semua aktivitas HARUS = ${totalMenit} menit
- Distribusi yang disarankan: Pendahuluan (${Math.round(totalMenit * 0.12)} menit), Inti (${Math.round(totalMenit * 0.75)} menit), Penutup (${Math.round(totalMenit * 0.13)} menit)\n`;
}

/**
 * Format sumatif config for prompt injection (Phase 3)
 */
function formatSumatifConfigForPrompt(sumatifConfig) {
  if (!sumatifConfig) return '';
  const sc = sumatifConfig;
  const types = [];
  if (sc.enabledTypes?.pilihan_ganda) types.push(`${sc.questionCount?.pilihan_ganda || 10} soal Pilihan Ganda (${sc.pgOptionCount || 4} opsi)`);
  if (sc.enabledTypes?.isian_singkat) types.push(`${sc.questionCount?.isian_singkat || 5} soal Isian Singkat`);
  if (sc.enabledTypes?.esai) types.push(`${sc.questionCount?.esai || 3} soal Esai/Uraian`);
  if (sc.enabledTypes?.mencocokkan) types.push(`${sc.questionCount?.mencocokkan || 5} pasangan Mencocokkan`);
  
  const levelMap = { 'mudah': 'C1-C2 (Mengingat & Memahami)', 'sedang': 'C3-C4 (Menerapkan & Menganalisis)', 'hots': 'C4-C6 (Menganalisis, Mengevaluasi & Mencipta)' };
  const level = levelMap[sc.difficultyLevel] || levelMap['sedang'];
  
  return `\nKOMPOSISI SOAL SUMATIF (Dicustom oleh user — HARUS DIIKUTI):
${types.map(t => `  • ${t}`).join('\n')}
  Level Kognitif: ${level}\n`;
}

/**
 * Format model pembelajaran for prompt injection (Phase 5)
 */
function formatModelPembelajaranForPrompt(models) {
  if (!models || models.length === 0) return '';
  const labels = {
    pbl: 'Problem Based Learning (PBL)',
    pjbl: 'Project Based Learning (PjBL)',
    discovery: 'Discovery Learning',
    inquiry: 'Inquiry Based Learning',
    cooperative: 'Cooperative Learning',
    direct: 'Direct Instruction',
    differentiated: 'Differentiated Instruction',
  };
  const selected = models.map(m => labels[m] || m).join(', ');
  return `\nMODEL PEMBELAJARAN YANG DIPILIH:
${selected}
INSTRUKSI: Sesuaikan SELURUH langkah pembelajaran, aktivitas siswa, dan asesmen formatif sesuai model di atas. Sintaks model harus terlihat jelas pada kegiatan inti.\n`;
}

/**
 * Gaya bahasa ramah awam instruction (Phase 4)
 */
const GAYA_BAHASA_INSTRUCTION = `
GAYA BAHASA (SANGAT PENTING — WAJIB DIIKUTI):
1. Gunakan bahasa yang MUDAH DIPAHAMI oleh siapapun, termasuk guru pengganti/piket
   yang TIDAK menguasai mata pelajaran ini.
2. Setiap langkah pembelajaran harus ditulis SEDETAIL mungkin sehingga orang awam
   pun bisa mengikutinya TANPA bimbingan tambahan.
3. Hindari jargon teknis tanpa penjelasan. Jika harus menggunakan istilah teknis,
   SERTAKAN penjelasan singkat dalam kurung.
4. Tulis instruksi kegiatan seperti RESEP MASAK — langkah demi langkah, jelas,
   terukur, dan TIDAK membutuhkan interpretasi.
5. Dokumen ini harus bisa menjadi PANDUAN MANDIRI yang berfungsi bahkan tanpa
   kehadiran guru utama.
6. JANGAN menggunakan gaya bahasa akademis yang kaku. Gunakan bahasa semi-formal
   yang mudah dicerna tapi tetap profesional.
`;

// ============================================================
// 🔬 CP SCANNING PROMPT
// ============================================================

/**
 * Prompt to scan/research CP for a specific subject and class phase
 */
export function cpScanningPrompt(subject, classPhase) {
  return `ROLE & PERSONA:
Kamu adalah Pakar Kurikulum Merdeka Indonesia 2024-2026, spesialis Capaian Pembelajaran (CP), dan anggota Tim Pengembang Kurikulum Kemendikbudristek. Kamu memiliki akses penuh ke dokumen resmi CP dari Kepmendikbudristek No. 262/M/2022 dan revisi terbaru.

TUGAS UTAMA:
Lakukan riset mendalam dan identifikasi SELURUH Capaian Pembelajaran (CP) resmi untuk:
- Mata Pelajaran: "${subject}"
- Fase / Kelas: "${classPhase}"

INSTRUKSI DETAIL:
1. Identifikasi fase yang tepat berdasarkan kelas yang diberikan (Fase A = Kelas 1-2 SD, Fase B = Kelas 3-4 SD, Fase C = Kelas 5-6 SD, Fase D = Kelas 7-9 SMP, Fase E = Kelas 10 SMA, Fase F = Kelas 11-12 SMA).
2. Temukan SEMUA elemen CP untuk fase tersebut berdasarkan mata pelajaran.
3. Untuk setiap CP, identifikasi Profil Pelajar Pancasila yang PALING relevan dari 8 dimensi: (1) Beriman & Bertakwa, (2) Berkebinekaan Global, (3) Bergotong Royong, (4) Mandiri, (5) Bernalar Kritis, (6) Kreatif.
4. Tulis deskripsi CP secara lengkap dan operasional (bukan ringkasan).

CHAIN OF THOUGHT:
- Langkah 1: Identifikasi fase yang benar
- Langkah 2: Cari domain/elemen CP untuk mapel ini di fase tersebut
- Langkah 3: Jabarkan masing-masing CP secara lengkap
- Langkah 4: Mapping profil lulusan

FORMAT OUTPUT (JSON MURNI, tanpa markdown code block):
{
  "fase": "Fase X",
  "subject": "${subject}",
  "classPhase": "${classPhase}",
  "totalCP": 0,
  "cpList": [
    {
      "code": "CP-[Mapel]-[Fase]-[Nomor]",
      "description": "Deskripsi lengkap CP...",
      "elemen": "Elemen/Domain CP",
      "profilLulusan": ["Bernalar Kritis", "Kreatif"]
    }
  ]
}

SELF-CORRECTION:
- Pastikan CP yang ditulis BUKAN buatan sendiri, melainkan merujuk pada dokumen resmi Kurikulum Merdeka.
- Jika mata pelajaran atau fase tidak valid, berikan CP terdekat yang relevan dengan penjelasan.
- Jumlah CP harus realistis (umumnya 4-12 elemen per fase per mapel).
`;
}

// ============================================================
// 📅 DISTRIBUSI PERTEMUAN PROMPT
// ============================================================

/**
 * Prompt to distribute CPs across meetings with sumatif scheduling
 */
export function distribusiPertemuanPrompt(cpData, totalPertemuan, jumlahSumatif, sumatifPositions, mode) {
  const cpListText = cpData.map((cp, i) => `  ${i + 1}. ${cp.description.substring(0, 120)}`).join('\n');
  const pertemuanMurni = totalPertemuan - jumlahSumatif;
  const modeLabel = mode === 'tahunan' ? '1 Tahun Ajaran' : '1 Semester';
  
  let sumatifInfo = '';
  if (sumatifPositions && sumatifPositions.length > 0) {
    sumatifInfo = `Posisi sumatif ditentukan user: Pertemuan ke-${sumatifPositions.join(', ')}`;
  } else {
    sumatifInfo = `Posisi sumatif: distribusikan secara merata sepanjang ${modeLabel}`;
  }

  return `TUGAS: Distribusikan Capaian Pembelajaran ke jadwal pertemuan.

DATA INPUT:
- Periode: ${modeLabel}
- Total Pertemuan: ${totalPertemuan}
- Jumlah Sumatif Harian: ${jumlahSumatif}
- Pertemuan Murni Pembelajaran: ${pertemuanMurni}
- ${sumatifInfo}

DAFTAR CP (${cpData.length} buah):
${cpListText}

INSTRUKSI:
1. Distribusikan ${cpData.length} CP ke ${pertemuanMurni} pertemuan pembelajaran secara PROPORSIONAL.
   - Jika CP lebih sedikit dari pertemuan, beberapa CP bisa dipecah (misal: CP 1 Part A di P1, CP 1 Part B di P2).
   - Jika CP lebih banyak dari pertemuan, gabungkan CP yang berdekatan secara tematik.
2. Tempatkan ${jumlahSumatif} pertemuan sumatif di posisi yang ditentukan.
3. Sumatif harian mengevaluasi CP-CP yang sudah diajarkan SEBELUM pertemuan sumatif tersebut.

FORMAT OUTPUT (JSON MURNI):
{
  "distribusi": [
    {
      "pertemuan": 1,
      "type": "cp",
      "cpIndices": [0],
      "title": "Judul singkat materi",
      "details": "Deskripsi singkat apa yang diajarkan"
    },
    {
      "pertemuan": 3,
      "type": "sumatif",
      "cpIndices": [0, 1],
      "title": "Sumatif Harian 1",
      "details": "Evaluasi CP 1-2"
    }
  ]
}
`;
}

// ============================================================
// OUTLINE PROMPT (IMPROVED)
// ============================================================

/**
 * Generate outline prompt (Komponen Dokumen) — enhanced with CP data injection
 */
export function outlinePrompt(book) {
  const roleName = book.targetRole === 'guru' ? 'Guru' : 'Kepala Sekolah';
  const docLabels = getDocLabels(book.docTypes);
  const schoolCtx = getSchoolContext(book.schoolLevel);
  const cpText = formatCpDataForPrompt(book.cpData);
  const distribusiText = formatDistribusiForPrompt(book.distribusiPertemuan);
  
  // Get template hints per docType
  let templateHints = '';
  if (book.docTypes && book.docTypes.length > 0) {
    const hints = [];
    book.docTypes.forEach(dt => {
      if (docTypeOutlineTemplates[dt]) {
        hints.push(`\nTemplate komponen untuk ${docTypeLabels[dt] || dt}:`);
        docTypeOutlineTemplates[dt].forEach((t, i) => hints.push(`  ${i + 1}. ${t}`));
      }
    });
    if (hints.length > 0) {
      templateHints = '\nREFERENSI TEMPLATE KOMPONEN (gunakan sebagai panduan, sesuaikan dengan kebutuhan):\n' + hints.join('\n');
    }
  }

  let prompt = `ROLE & PERSONA:
Kamu adalah Asesor Kurikulum Pusat, Master Teacher, dan ${roleName} Penggerak Nasional yang sangat ahli dalam Kurikulum Merdeka 2026. Tugasmu merancang KERANGKA (Skeleton) dokumen administrasi pendidikan yang komprehensif.

DETAIL PERMINTAAN:
Jenis Dokumen yang Dibutuhkan (Bundel): ${docLabels}
Mata Pelajaran: ${book.subject || '-'}
Fase/Kelas: ${book.classPhase || '-'}

${schoolCtx}
${cpText}
${distribusiText}
${templateHints}
`;

  if (book.topic) {
    prompt += `Topik Spesifik: "${book.topic}"\n`;
  } else if (!book.cpScanned) {
    prompt += `Topik/Materi: [GENERATE KNOWLEDGE & STEP-BACK] Pengguna tidak memberikan topik spesifik. Lakukan deduksi logis! Tentukan 1 materi esensial/kritis/capaian pembelajaran (CP) paling relevan untuk mata pelajaran dan fase di atas, lalu jadikan itu sebagai bahasan sentral dokumen ini.\n`;
  }

  if (book.description) {
    prompt += `Atensi Khusus (Directional Stimulus): ${book.description}\n`;
  }

  if (book.referenceText) {
    prompt += `\nMATERIAL REFERENSI & RAG CONTEXT (Jadikan acuan utama format/isi):\n${book.referenceText}\n`;
  }

  // Multi-pertemuan mode
  if (book.modulAjarMode && book.distribusiPertemuan?.length > 0) {
    prompt += `\nMODE MODUL AJAR MULTI-PERTEMUAN:
Dokumen ini adalah Modul Ajar untuk ${book.modulAjarMode === 'tahunan' ? '1 Tahun' : '1 Semester'} dengan ${book.totalPertemuan} pertemuan.
Setiap pertemuan HARUS menjadi 1 chapter terpisah berdasarkan distribusi yang sudah diberikan.
Untuk pertemuan SUMATIF, buatkan chapter berisi: Kisi-kisi, Soal, Rubrik Penilaian.\n`;
  }

  // Inject alokasi waktu, model pembelajaran, dan gaya bahasa
  prompt += formatAlokasiForPrompt(book);
  prompt += formatModelPembelajaranForPrompt(book.modelPembelajaran);
  prompt += GAYA_BAHASA_INSTRUCTION;

  prompt += `
CHAIN OF THOUGHT (CoT) & TREE OF THOUGHTS (ToT):
Berpikirlah selangkah demi selangkah:
1. Pahami esensi Kurikulum Merdeka (Pendekatan Deep Learning, bukan sekadar hafalan).
${book.cpScanned ? '2. Gunakan CP yang sudah diberikan sebagai FONDASI utama kerangka.' : '2. Pikirkan CP yang paling relevan untuk mata pelajaran dan fase ini.'}
3. Jika ada lebih dari satu jenis dokumen (${docLabels}), urutkan logika perencanaannya (misal: ATP dulu, lalu Modul Ajar).
4. Alokasikan komponen (bab) dokumen secara proporsional. Buat sebanyak yang diperlukan (idealnya 3-7 komponen per jenis dokumen).
5. PENTING: Sesuaikan semua aktivitas, media, dan metode dengan LEVEL SEKOLAH!

CROSS-REFERENCE INSTRUCTION:
Jika bundel dokumen terdiri dari >1 jenis (misal ATP + Modul Ajar + Promes), pastikan:
- ATP mendefinisikan tujuan pembelajaran → Modul Ajar menurunkan kegiatan dari tujuan tersebut
- Promes menempatkan timeline berdasarkan urutan ATP
- Asesmen mengukur ketercapaian tujuan dari ATP
Semua dokumen HARUS saling merujuk dan konsisten.

SELF-CONSISTENCY & REFLEXION:
Pastikan kerangka yang kamu buat menyediakan ruang KHUSUS untuk mengintegrasikan secara nyata "Profil Pelajar Pancasila":
(1) Beriman & Bertakwa, (2) Berkebinekaan Global, (3) Bergotong Royong, (4) Mandiri, (5) Bernalar Kritis, (6) Kreatif.

INSTRUKSI META-PROMPTING & FEW-SHOT:
1. Buatkan komponen-komponen dokumen (sebagai 'chapters') dan sub-komponennya (sebagai 'sections').
2. Format WAJIB berupa JSON murni tanpa ada teks pengantar atau penutup apapun.
3. Nama chapter harus mencerminkan kelompok besar (misal: "1. ATP: Capaian Pembelajaran", "4. Modul Ajar: Langkah Deep Learning").

CONTOH OUTPUT JSON YANG DIHARAPKAN (Strict Zero-Shot Output Schema):
{
  "chapters": [
    {
      "title": "1. [Nama Dokumen] - Informasi Umum & Esensi",
      "sections": ["Identitas Sekolah", "Capaian Pembelajaran Utama", "Fokus Profil Pelajar Pancasila"]
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

// ============================================================
// CHAPTER PROMPT (IMPROVED)
// ============================================================

/**
 * Generate chapter content prompt — enhanced with per-docType formatting
 */
export function chapterPrompt(book, chapter, chapterIndex, prevSummary, totalChapters) {
  const docLabels = getDocLabels(book.docTypes);
  const roleName = book.targetRole === 'guru' ? 'Guru' : 'Kepala Sekolah';
  const schoolCtx = getSchoolContext(book.schoolLevel);
  const cpText = formatCpDataForPrompt(book.cpData);

  const lengthMap = {
    pendek: 'singkat, berfokus pada tabel atau poin-poin padat (sekitar 300-500 kata).',
    sedang: 'cukup detail dengan penjabaran operasional (sekitar 800-1200 kata).',
    panjang: 'sangat komprehensif, akademis, dan terperinci level teknis (sekitar 1500-2500 kata).',
  };
  const targetWords = lengthMap[book.chapterLength] || 'cukup detail';

  // Determine per-docType formatting instructions
  let formatInstructions = '';
  const activeTypes = book.docTypes || [];
  if (activeTypes.includes('atp')) {
    formatInstructions += `\nFORMAT KHUSUS ATP: Gunakan TABEL MARKDOWN untuk matriks ATP. Kolom wajib: No, Elemen CP, Tujuan Pembelajaran, Indikator, Profil Lulusan, Asesmen.\n`;
  }
  if (activeTypes.includes('prota')) {
    formatInstructions += `\nFORMAT KHUSUS PROTA: Gunakan TABEL MARKDOWN untuk distribusi materi. Kolom wajib: No, Bulan, Minggu Efektif, Materi/Topik, Alokasi JP, Keterangan.\n`;
  }
  if (activeTypes.includes('promes')) {
    formatInstructions += `\nFORMAT KHUSUS PROMES: Gunakan TABEL MARKDOWN untuk distribusi bulanan. Kolom wajib: No, Kompetensi/TP, Juli, Agst, Sept, Okt, Nov, Des (centang ✓ untuk bulan aktif).\n`;
  }
  if (activeTypes.includes('assesmen')) {
    formatInstructions += `\nFORMAT KHUSUS ASESMEN: Sertakan tabel kisi-kisi, contoh soal RIIL (bukan placeholder), rubrik penilaian dengan skor 1-4, dan pedoman penskoran.\n`;
  }
  if (activeTypes.includes('modul_ajar')) {
    formatInstructions += `\nFORMAT KHUSUS MODUL AJAR: Sertakan langkah pembelajaran dengan ESTIMASI MENIT per aktivitas. Contoh: "Pendahuluan (10 menit)", "Kegiatan Inti (60 menit)", "Penutup (10 menit)". Gunakan tabel untuk rubrik.\n`;
  }

  // Check if this chapter is a multi-meeting chapter
  let meetingContext = '';
  if (book.modulAjarMode && book.distribusiPertemuan?.length > 0) {
    const meetingData = book.distribusiPertemuan[chapterIndex];
    if (meetingData) {
      if (meetingData.type === 'sumatif') {
        const sumatifConfigText = formatSumatifConfigForPrompt(book.sumatifConfig);
        meetingContext = `\n🔴 INI ADALAH PERTEMUAN SUMATIF HARIAN (Pertemuan ${meetingData.pertemuan})
Tugas: Buatkan instrumen sumatif harian lengkap yang mengevaluasi materi dari pertemuan sebelumnya.
${sumatifConfigText}
Isi Wajib:
1. Kisi-kisi soal (tabel: No, Indikator, Level Kognitif, Bentuk Soal, No Soal)
2. Soal lengkap sesuai KOMPOSISI di atas (jangan lebih, jangan kurang!)
3. Kunci jawaban & pedoman penskoran
4. Rubrik penilaian (tabel: Skor, Deskriptor)
5. Tindak lanjut (pengayaan & remidial)
CP yang dievaluasi: ${meetingData.details || 'CP dari pertemuan sebelumnya'}
`;
      } else {
        meetingContext = `\n📚 PERTEMUAN KE-${meetingData.pertemuan} (Pembelajaran CP)
Materi: ${meetingData.title || meetingData.details || 'Sesuai CP'}
Detail: ${meetingData.details || ''}
Buatkan modul ajar lengkap untuk 1 pertemuan ini dengan alokasi waktu detail per menit.
`;
      }
    }
  }

  let prompt = `ROLE & CONTEXT:
Kamu adalah ${roleName} Profesional, Ahli Kurikulum Merdeka 2026, dan penulis dokumen akademis resmi. Kamu sedang menyusun bundel dokumen: ${docLabels}.

${schoolCtx}
${cpText}

IDENTITAS PROYEK:
Topik/Capaian: "${book.topic || 'Sesuai dengan CP yang telah diidentifikasi'}"
Mata Pelajaran: ${book.subject || '-'}
Fase/Kelas: ${book.classPhase || '-'}
Target Kedalaman: ${targetWords}
${meetingContext}

TUGAS SPESIFIK (Instruction Prompting):
Tuliskan konten komprehensif untuk BAGIAN ke-${chapterIndex + 1} dari total ${totalChapters} bagian.
Nama Bagian: "${chapter.title}"
Sub-bagian yang WAJIB dibahas: ${chapter.sections.join(', ')}
${formatInstructions}

PENTING TENTANG LEVEL SEKOLAH:
- Pastikan SEMUA contoh aktivitas, media, dan metode SESUAI dengan konteks sekolah di atas.
- Jangan menyebutkan alat/media yang TIDAK tersedia di level sekolah tersebut.
`;

  if (prevSummary) {
    prompt += `\nKONEKSI LOGIS (Memory & Prompt Chaining):
Berikut ringkasan bagian sebelumnya. Jaga kesinambungan tata waktu dan narasi:
${prevSummary}\n`;
  }

  if (book.referenceText) {
    prompt += `\nRAG CONTEXT (Acuan Wajib):\n${book.referenceText.substring(0, 2000)}\n`;
  }

  prompt += `
SCAMPER & WHAT-IF THINKING (Standar Penulisan):
- Apa jadinya jika metode ini gagal? Antisipasi dengan diferensiasi pembelajaran/mitigasi risiko.
- Subtitusi elemen hafalan konvensional dengan *Deep Learning* (Eksplorasi, Meaningful Learning).

SELF-CORRECTION & REFLEXION (Saat menulis):
1. Apakah saya sudah eksplisit menyebutkan taktik pencapaian "Profil Pelajar Pancasila" (Beriman, Berkebinekaan, Gotong Royong, Mandiri, Bernalar Kritis, Kreatif)? Jika belum, integrasikan pada metode kerjanya.
2. Gunakan gaya bahasa naskah dinas pendidikan formal yang siap cetak.
3. BUAT SANGAT REALISTIS. Gunakan contoh nama kegiatan konkret, estimasi menit, rubrik nilai asli, bukan sekadar teori.
${book.cpScanned ? '4. SEMUA konten HARUS merujuk ke CP yang sudah diberikan. Jangan membuat CP baru.' : ''}
5. Gunakan GAYA BAHASA RAMAH AWAM — tulis langkah pembelajaran seperti resep masak, bukan jurnal akademis.

META-PROMPTING DONT's:
1. JANGAN mendaur ulang judul bagian terus menerus. Langsung masuk ke konten (Markdown h2/h3).
2. Jika butuh data matriks (seperti ATP / Promes / Rubrik), FORMAT OTOMATIS menggunakan Tabel Markdown agar sangat rapi.
3. JANGAN buat pengantar generik/kesimpulan penutup. Penulisan ini adalah satu komponen dari dokumen raksasa utuh. Langsung serang inti materi "${chapter.title}".
`;

  // Inject alokasi, model pembelajaran, gaya bahasa
  prompt += formatAlokasiForPrompt(book);
  prompt += formatModelPembelajaranForPrompt(book.modelPembelajaran);
  prompt += GAYA_BAHASA_INSTRUCTION;

  return prompt;
}

// ============================================================
// SUMMARY PROMPT
// ============================================================

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
