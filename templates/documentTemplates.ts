/**
 * Document Templates - 100% Static, No AI Required
 * Templates untuk semua jenis dokumen administrasi Kurikulum Merdeka
 */

import { AdminRequest, AdminDocType, TeacherIdentity } from '../types';
import { PROFIL_PELAJAR_PANCASILA, RUBRIK_STANDAR, getSpecificCP } from '../data/cpDatabase';

// ======================== INTERFACE ========================
export interface TemplateData {
    identity: TeacherIdentity;
    fase: string;
    mapel: string;
    elemen: string;
    topik: string;
    waktu: string;
    modelPembelajaran: string;
    sarana: string;
    jumlahSiswa: string;
    targetPeserta: string;
    profilPelajar: string[];
    // Dynamic content from user input
    pendahuluan?: string;
    kegiatanInti?: string;
    penutup?: string;
    soalAsesmen?: string;
    kunciJawaban?: string;
}

// ======================== HELPER FUNCTIONS ========================

function formatProfilPelajar(selected: string[]): string {
    if (!selected || selected.length === 0) {
        return PROFIL_PELAJAR_PANCASILA.slice(0, 3).map(p => `- **${p.dimensi}**: ${p.deskripsi}`).join('\n');
    }
    return PROFIL_PELAJAR_PANCASILA
        .filter(p => selected.some(s => p.dimensi.toLowerCase().includes(s.toLowerCase())))
        .map(p => `- **${p.dimensi}**: ${p.deskripsi}`)
        .join('\n');
}

function formatRubrik(): string {
    let table = '| Kriteria | ';
    table += RUBRIK_STANDAR.levels.map(l => l.nama).join(' | ') + ' |\n';
    table += '|' + '----------|'.repeat(5) + '\n';
    table += '| Pemahaman Konsep | Belum memahami | Memahami sebagian | Memahami dengan baik | Memahami sangat baik |\n';
    table += '| Keterampilan | Perlu bimbingan | Dapat melakukan dengan bantuan | Dapat melakukan mandiri | Dapat mengajarkan orang lain |\n';
    table += '| Sikap | Belum menunjukkan | Mulai menunjukkan | Konsisten menunjukkan | Menjadi teladan |\n';
    return table;
}

function formatTandaTangan(identity: TeacherIdentity): string {
    const tanggal = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return `
---

${identity.kota || 'Kota'}, ${tanggal}

| Mengetahui, | | |
|-------------|---|---|
| Kepala Sekolah | | Guru Mata Pelajaran |
| | | |
| | | |
| | | |
| **${identity.kepalaSekolah || 'Kepala Sekolah'}** | | **${identity.nama || 'Guru'}** |
| NIP. ${identity.nipKepala || '-'} | | NIP. ${identity.nip || '-'} |
`;
}

// ======================== DOCUMENT TEMPLATES ========================

export function generateModulAjar(data: TemplateData): string {
    const cp = getSpecificCP(data.fase, data.mapel, data.elemen);
    const cpText = cp?.capaian || 'Sesuaikan dengan Capaian Pembelajaran resmi Kemendikbud';
    const tpList = cp?.tujuanPembelajaran || ['Tujuan 1', 'Tujuan 2', 'Tujuan 3'];

    return `# MODUL AJAR

## A. INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Penyusun | ${data.identity.nama} |
| Instansi | ${data.identity.sekolah} |
| Tahun Pelajaran | ${data.identity.tahunAjaran} |
| Fase / Kelas | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Elemen | ${data.elemen} |
| Topik / Materi | ${data.topik} |
| Alokasi Waktu | ${data.waktu} |

## B. CAPAIAN PEMBELAJARAN

${cpText}

## C. TUJUAN PEMBELAJARAN

${tpList.map((tp, i) => `${i + 1}. ${tp}`).join('\n')}

## D. PROFIL PELAJAR PANCASILA YANG DIKEMBANGKAN

${formatProfilPelajar(data.profilPelajar)}

## E. SARANA DAN PRASARANA

- ${data.sarana || 'Buku teks, LCD Proyektor, Laptop, Papan tulis'}
- Lembar Kerja Peserta Didik (LKPD)
- Media pembelajaran interaktif

## F. TARGET PESERTA DIDIK

- Jumlah: ${data.jumlahSiswa || '30'} peserta didik
- Kategori: ${data.targetPeserta || 'Peserta didik reguler'}

## G. MODEL PEMBELAJARAN

${data.modelPembelajaran || 'Problem Based Learning (PBL)'}

---

## H. KEGIATAN PEMBELAJARAN

### 1. Pendahuluan (± 15 menit)

${data.pendahuluan || `**Aktivitas Mindful:**
- Guru membuka pembelajaran dengan salam dan doa
- Peserta didik melakukan ice breaking/brain gym
- Guru melakukan presensi dan memeriksa kesiapan peserta didik

**Apersepsi:**
- Guru mengaitkan materi dengan pengalaman peserta didik
- Guru menyampaikan tujuan pembelajaran

**Motivasi:**
- Guru memberikan gambaran manfaat mempelajari materi ini`}

### 2. Kegiatan Inti (± 50 menit)

${data.kegiatanInti || `**Aktivitas Meaningful:**

**Fase 1: Orientasi pada Masalah**
- Guru menyajikan permasalahan kontekstual terkait ${data.topik}
- Peserta didik mengamati dan mengidentifikasi masalah

**Fase 2: Mengorganisasi Peserta Didik**
- Peserta didik dibagi dalam kelompok (4-5 orang)
- Setiap kelompok mendapat LKPD

**Fase 3: Membimbing Penyelidikan**
- Peserta didik melakukan diskusi kelompok
- Guru memfasilitasi dan membimbing

**Fase 4: Mengembangkan dan Menyajikan Hasil**
- Peserta didik mempresentasikan hasil diskusi
- Kelompok lain memberikan tanggapan

**Fase 5: Analisis dan Evaluasi**
- Guru memberikan penguatan dan klarifikasi
- Peserta didik menyimpulkan pembelajaran`}

### 3. Penutup (± 15 menit)

${data.penutup || `**Aktivitas Joyful:**
- Peserta didik melakukan refleksi pembelajaran
- Guru memberikan umpan balik
- Guru menyampaikan materi pertemuan selanjutnya
- Pembelajaran ditutup dengan doa dan salam`}

---

## I. ASESMEN

### Asesmen Diagnostik
- Pertanyaan lisan untuk mengukur pemahaman awal

### Asesmen Formatif
- Observasi selama kegiatan pembelajaran
- Tanya jawab dan diskusi

### Asesmen Sumatif
${data.soalAsesmen || `**Soal:**
1. Jelaskan pengertian ${data.topik}!
2. Sebutkan 3 contoh penerapan ${data.topik} dalam kehidupan sehari-hari!
3. Analisislah hubungan antara ${data.topik} dengan ${data.elemen}!

**Kunci Jawaban:**
${data.kunciJawaban || '(Kunci jawaban disesuaikan dengan materi)'}`}

---

## J. RUBRIK PENILAIAN

${formatRubrik()}

---

## K. REFLEKSI GURU

| Pertanyaan Refleksi | Jawaban |
|---------------------|---------|
| Apakah tujuan pembelajaran tercapai? | |
| Apa yang perlu diperbaiki? | |
| Bagaimana respons peserta didik? | |

---

## L. LAMPIRAN

1. Lembar Kerja Peserta Didik (LKPD)
2. Bahan Ajar
3. Media Pembelajaran

${formatTandaTangan(data.identity)}`;
}

export function generateATP(data: TemplateData): string {
    const cp = getSpecificCP(data.fase, data.mapel, data.elemen);
    const cpText = cp?.capaian || 'Sesuaikan dengan CP resmi';
    const tpList = cp?.tujuanPembelajaran || ['TP 1', 'TP 2', 'TP 3'];

    return `# ALUR TUJUAN PEMBELAJARAN (ATP)

## INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Satuan Pendidikan | ${data.identity.sekolah} |
| Fase / Kelas | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Elemen | ${data.elemen} |
| Tahun Pelajaran | ${data.identity.tahunAjaran} |
| Semester | ${data.identity.semester} |

---

## CAPAIAN PEMBELAJARAN

${cpText}

---

## ALUR TUJUAN PEMBELAJARAN

| No | Tujuan Pembelajaran | Indikator Ketercapaian | Alokasi Waktu | Profil Pelajar |
|----|---------------------|------------------------|---------------|----------------|
${tpList.map((tp, i) => `| ${i + 1} | ${tp} | Peserta didik mampu ${tp.toLowerCase()} | ${Math.round(parseInt(data.waktu) / tpList.length || 2)} JP | Bernalar Kritis, Mandiri |`).join('\n')}

---

## PEMETAAN PROFIL PELAJAR PANCASILA

${formatProfilPelajar(data.profilPelajar)}

${formatTandaTangan(data.identity)}`;
}

export function generateAnalisisCP(data: TemplateData): string {
    const cp = getSpecificCP(data.fase, data.mapel, data.elemen);
    const cpText = cp?.capaian || 'Sesuaikan dengan CP resmi';
    const tpList = cp?.tujuanPembelajaran || ['TP 1', 'TP 2', 'TP 3'];

    return `# ANALISIS CAPAIAN PEMBELAJARAN

## INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Satuan Pendidikan | ${data.identity.sekolah} |
| Fase | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Elemen | ${data.elemen} |
| Tahun Pelajaran | ${data.identity.tahunAjaran} |

---

## CAPAIAN PEMBELAJARAN

${cpText}

---

## TABEL ANALISIS CP

| Capaian Pembelajaran | Tujuan Pembelajaran | Materi/Konten | Keterampilan | Sikap |
|---------------------|---------------------|---------------|--------------|-------|
${tpList.map(tp => `| ${cpText.substring(0, 50)}... | ${tp} | ${data.topik} | Menganalisis, Menyimpulkan | Kritis, Teliti |`).join('\n')}

---

## PEMETAAN KE PROFIL PELAJAR PANCASILA

| Tujuan Pembelajaran | Dimensi Profil | Elemen |
|---------------------|----------------|--------|
${tpList.map(tp => `| ${tp} | Bernalar Kritis | Memperoleh dan memproses informasi |`).join('\n')}

${formatTandaTangan(data.identity)}`;
}

export function generateKKTP(data: TemplateData): string {
    const cp = getSpecificCP(data.fase, data.mapel, data.elemen);
    const tpList = cp?.tujuanPembelajaran || ['TP 1', 'TP 2', 'TP 3'];

    return `# KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)

## INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Satuan Pendidikan | ${data.identity.sekolah} |
| Fase / Kelas | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Topik | ${data.topik} |
| Alokasi Waktu | ${data.waktu} |

---

## TABEL KKTP

| No | Tujuan Pembelajaran | Kriteria Ketercapaian | Teknik Asesmen | Bentuk Instrumen |
|----|---------------------|----------------------|----------------|------------------|
${tpList.map((tp, i) => `| ${i + 1} | ${tp} | Peserta didik mampu ${tp.toLowerCase()} dengan benar | Tes tertulis, Observasi | Soal uraian, Lembar observasi |`).join('\n')}

---

## RUBRIK PENILAIAN

${formatRubrik()}

---

## PEDOMAN PENSKORAN

| Skor | Keterangan |
|------|------------|
| 4 | Sangat Berkembang (76-100%) |
| 3 | Berkembang Sesuai Harapan (51-75%) |
| 2 | Sedang Berkembang (26-50%) |
| 1 | Mulai Berkembang (0-25%) |

**Nilai Akhir = (Jumlah Skor / Skor Maksimal) × 100**

${formatTandaTangan(data.identity)}`;
}

export function generateProta(data: TemplateData): string {
    return `# PROGRAM TAHUNAN (PROTA)

## INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Satuan Pendidikan | ${data.identity.sekolah} |
| Fase / Kelas | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Tahun Pelajaran | ${data.identity.tahunAjaran} |

---

## DISTRIBUSI ALOKASI WAKTU

| Semester | Bulan | Minggu Efektif | Jam Pelajaran |
|----------|-------|----------------|---------------|
| Ganjil | Juli | 2 | 4 |
| Ganjil | Agustus | 4 | 8 |
| Ganjil | September | 4 | 8 |
| Ganjil | Oktober | 4 | 8 |
| Ganjil | November | 4 | 8 |
| Ganjil | Desember | 2 | 4 |
| **Total Semester 1** | | **20** | **40** |
| Genap | Januari | 4 | 8 |
| Genap | Februari | 4 | 8 |
| Genap | Maret | 4 | 8 |
| Genap | April | 4 | 8 |
| Genap | Mei | 4 | 8 |
| Genap | Juni | 2 | 4 |
| **Total Semester 2** | | **22** | **44** |
| **TOTAL TAHUNAN** | | **42** | **84** |

---

## PROGRAM TAHUNAN

| No | Materi Pokok | Semester | Alokasi Waktu | Keterangan |
|----|--------------|----------|---------------|------------|
| 1 | ${data.topik || 'Materi 1'} | 1 | 8 JP | |
| 2 | Materi 2 | 1 | 8 JP | |
| 3 | Materi 3 | 1 | 8 JP | |
| 4 | Ulangan/Asesmen Tengah Semester | 1 | 4 JP | ATS |
| 5 | Materi 4 | 1 | 8 JP | |
| 6 | Ulangan/Asesmen Akhir Semester | 1 | 4 JP | AAS |
| 7 | Materi 5 | 2 | 8 JP | |
| 8 | Materi 6 | 2 | 8 JP | |
| 9 | Ulangan/Asesmen Tengah Semester | 2 | 4 JP | ATS |
| 10 | Materi 7 | 2 | 8 JP | |
| 11 | Ulangan/Asesmen Akhir Tahun | 2 | 4 JP | AAT |

${formatTandaTangan(data.identity)}`;
}

export function generatePromes(data: TemplateData): string {
    return `# PROGRAM SEMESTER (PROMES)

## INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Satuan Pendidikan | ${data.identity.sekolah} |
| Fase / Kelas | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Semester | ${data.identity.semester} |
| Tahun Pelajaran | ${data.identity.tahunAjaran} |

---

## PROGRAM SEMESTER

| No | Materi Pokok | JP | Juli | Agt | Sep | Okt | Nov | Des | Ket |
|----|--------------|----|----|-----|-----|-----|-----|-----|-----|
| 1 | ${data.topik || 'Materi 1'} | 4 | ✓✓ | ✓✓ | | | | | |
| 2 | Materi 2 | 4 | | | ✓✓ | ✓✓ | | | |
| 3 | ATS | 2 | | | | | ✓ | | Asesmen |
| 4 | Materi 3 | 4 | | | | | ✓ | ✓✓ | |
| 5 | AAS | 2 | | | | | | ✓ | Asesmen |

**Keterangan:**
- ✓ = 1 pertemuan (2 JP)
- ✓✓ = 2 pertemuan (4 JP)
- ATS = Asesmen Tengah Semester
- AAS = Asesmen Akhir Semester

${formatTandaTangan(data.identity)}`;
}

export function generateAsesmenDiagnostik(data: TemplateData): string {
    return `# ASESMEN DIAGNOSTIK

## INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Satuan Pendidikan | ${data.identity.sekolah} |
| Fase / Kelas | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Topik | ${data.topik} |

---

## A. ASESMEN DIAGNOSTIK KOGNITIF

### Tujuan
Mengidentifikasi kemampuan awal peserta didik terkait materi ${data.topik}.

### Instrumen

**Soal Diagnostik:**

1. Apa yang kamu ketahui tentang ${data.topik}?
   
2. Pernahkah kamu mempelajari materi ini sebelumnya? Jelaskan!

3. Menurut pendapatmu, mengapa materi ${data.topik} penting untuk dipelajari?

---

## B. ASESMEN DIAGNOSTIK NON-KOGNITIF

### Tujuan
Mengidentifikasi kondisi sosial-emosional dan gaya belajar peserta didik.

### Instrumen

| No | Pernyataan | Ya | Kadang | Tidak |
|----|------------|----|----|-------|
| 1 | Saya merasa nyaman belajar di kelas ini | | | |
| 2 | Saya lebih suka belajar secara visual (gambar/video) | | | |
| 3 | Saya lebih suka belajar dengan mendengarkan penjelasan | | | |
| 4 | Saya lebih suka belajar dengan praktik langsung | | | |
| 5 | Saya lebih suka belajar sendiri daripada berkelompok | | | |

---

## C. TINDAK LANJUT

| Hasil Asesmen | Kategori | Tindak Lanjut |
|---------------|----------|---------------|
| Skor 0-30 | Perlu Intervensi Khusus | Pendampingan intensif |
| Skor 31-60 | Perlu Pendampingan | Bimbingan teman sebaya |
| Skor 61-100 | Siap Belajar | Pembelajaran reguler |

${formatTandaTangan(data.identity)}`;
}

export function generateBahanBacaan(data: TemplateData): string {
    return `# BAHAN BACAAN GURU DAN SISWA

## INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Fase / Kelas | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Topik | ${data.topik} |
| Penyusun | ${data.identity.nama} |

---

## A. DESKRIPSI MATERI

### Pengertian ${data.topik}

*(Isi dengan penjelasan tentang ${data.topik})*

### Konsep Utama

1. **Konsep 1:** ...
2. **Konsep 2:** ...
3. **Konsep 3:** ...

---

## B. CONTOH DAN ILUSTRASI

### Contoh 1
*(Berikan contoh konkret)*

### Contoh 2
*(Berikan contoh dalam kehidupan sehari-hari)*

---

## C. RANGKUMAN

- Poin penting 1
- Poin penting 2
- Poin penting 3

---

## D. LATIHAN

1. Pertanyaan pemahaman 1
2. Pertanyaan pemahaman 2
3. Pertanyaan analisis

---

## E. DAFTAR PUSTAKA

1. Buku Teks Kurikulum Merdeka
2. Sumber referensi lainnya

${formatTandaTangan(data.identity)}`;
}

export function generateAsesmenFormatif(data: TemplateData): string {
    return `# ASESMEN FORMATIF

## INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Satuan Pendidikan | ${data.identity.sekolah} |
| Fase / Kelas | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Topik | ${data.topik} |

---

## A. LEMBAR OBSERVASI

| No | Aspek yang Diamati | SB (4) | B (3) | C (2) | K (1) |
|----|--------------------|--------|-------|-------|-------|
| 1 | Keaktifan dalam diskusi | | | | |
| 2 | Kemampuan menyampaikan pendapat | | | | |
| 3 | Kerja sama dalam kelompok | | | | |
| 4 | Pemahaman konsep | | | | |

---

## B. PERTANYAAN PEMANTIK

1. Bagaimana pendapatmu tentang ${data.topik}?
2. Apa hubungan ${data.topik} dengan kehidupan sehari-hari?
3. Kesulitan apa yang kamu alami dalam memahami ${data.topik}?

---

## C. REFLEKSI PEMBELAJARAN

| Saya sudah memahami | Saya masih bingung | Saya ingin tahu lebih |
|---------------------|--------------------|-----------------------|
| | | |

---

## D. EXIT TICKET

Tuliskan 3 hal yang kamu pelajari hari ini:
1. ...
2. ...
3. ...

${formatTandaTangan(data.identity)}`;
}

export function generateAsesmenSumatif(data: TemplateData): string {
    return `# ASESMEN SUMATIF

## INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Satuan Pendidikan | ${data.identity.sekolah} |
| Fase / Kelas | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Topik | ${data.topik} |
| Alokasi Waktu | ${data.waktu} |

---

## A. SOAL PILIHAN GANDA

${data.soalAsesmen || `1. Pertanyaan tentang ${data.topik}...
   a. Pilihan A
   b. Pilihan B
   c. Pilihan C
   d. Pilihan D

2. Pertanyaan kedua...
   a. Pilihan A
   b. Pilihan B
   c. Pilihan C
   d. Pilihan D`}

---

## B. SOAL URAIAN

1. Jelaskan pengertian ${data.topik}! (Skor: 20)

2. Sebutkan dan jelaskan 3 contoh ${data.topik} dalam kehidupan sehari-hari! (Skor: 30)

3. Analisislah hubungan antara ${data.topik} dengan ${data.elemen}! (Skor: 25)

---

## C. KUNCI JAWABAN

### Pilihan Ganda
${data.kunciJawaban || `1. C
2. B`}

### Uraian
${data.kunciJawaban || `1. (Kunci jawaban soal 1)
2. (Kunci jawaban soal 2)
3. (Kunci jawaban soal 3)`}

---

## D. RUBRIK PENILAIAN URAIAN

${formatRubrik()}

${formatTandaTangan(data.identity)}`;
}

export function generateKisiKisi(data: TemplateData): string {
    const cp = getSpecificCP(data.fase, data.mapel, data.elemen);
    const tpList = cp?.tujuanPembelajaran || ['TP 1', 'TP 2', 'TP 3'];

    return `# KISI-KISI PENILAIAN

## INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Satuan Pendidikan | ${data.identity.sekolah} |
| Fase / Kelas | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Topik | ${data.topik} |
| Jumlah Soal | 10 |
| Bentuk Soal | PG dan Uraian |

---

## KISI-KISI

| No | Tujuan Pembelajaran | Indikator | Level Kognitif | Bentuk | No Soal |
|----|---------------------|-----------|----------------|--------|---------|
${tpList.map((tp, i) => `| ${i + 1} | ${tp} | Peserta didik dapat ${tp.toLowerCase()} | C${i + 2} | PG | ${i + 1} |`).join('\n')}
| ${tpList.length + 1} | Menganalisis ${data.topik} | Peserta didik dapat menganalisis | C4 | Uraian | 1 |
| ${tpList.length + 2} | Mengevaluasi ${data.topik} | Peserta didik dapat mengevaluasi | C5 | Uraian | 2 |

---

## DISTRIBUSI SOAL

| Level Kognitif | Jumlah | Persentase |
|----------------|--------|------------|
| C1-C2 (LOTS) | 3 | 30% |
| C3-C4 (MOTS) | 5 | 50% |
| C5-C6 (HOTS) | 2 | 20% |

${formatTandaTangan(data.identity)}`;
}

export function generateBankSoal(data: TemplateData): string {
    return `# BANK SOAL DAN KUNCI JAWABAN

## INFORMASI UMUM

| Aspek | Keterangan |
|-------|------------|
| Fase / Kelas | ${data.fase} |
| Mata Pelajaran | ${data.mapel} |
| Topik | ${data.topik} |

---

## A. SOAL PILIHAN GANDA

${data.soalAsesmen || `1. Pengertian ${data.topik} adalah...
   a. Pilihan A
   b. Pilihan B
   c. Pilihan C ✓
   d. Pilihan D

2. Contoh ${data.topik} dalam kehidupan sehari-hari adalah...
   a. Contoh A
   b. Contoh B ✓
   c. Contoh C
   d. Contoh D

3. Manfaat mempelajari ${data.topik} adalah...
   a. Manfaat A
   b. Manfaat B
   c. Manfaat C
   d. Manfaat D ✓`}

---

## B. SOAL URAIAN

1. **C2 - Memahami**
   Jelaskan pengertian ${data.topik} dengan kata-katamu sendiri!

2. **C3 - Menerapkan**
   Berikan 2 contoh penerapan ${data.topik} dalam kehidupan sehari-hari!

3. **C4 - Menganalisis**
   Analisislah perbedaan antara... (sesuaikan dengan materi)

4. **C5 - Mengevaluasi**
   Berikan pendapatmu tentang pentingnya ${data.topik}!

---

## C. KUNCI JAWABAN

### Pilihan Ganda
${data.kunciJawaban || `| No | Jawaban | Pembahasan |
|----|---------|------------|
| 1 | C | (Pembahasan) |
| 2 | B | (Pembahasan) |
| 3 | D | (Pembahasan) |`}

### Uraian
${data.kunciJawaban || `1. (Kunci jawaban nomor 1)
2. (Kunci jawaban nomor 2)
3. (Kunci jawaban nomor 3)
4. (Kunci jawaban nomor 4)`}

${formatTandaTangan(data.identity)}`;
}

// ======================== MAIN GENERATOR ========================

export function generateDocument(docType: AdminDocType, data: TemplateData): string {
    switch (docType) {
        case AdminDocType.ModulAjar:
            return generateModulAjar(data);
        case AdminDocType.ATP:
            return generateATP(data);
        case AdminDocType.AnalisisCP:
            return generateAnalisisCP(data);
        case AdminDocType.KKTP:
            return generateKKTP(data);
        case AdminDocType.Prota:
            return generateProta(data);
        case AdminDocType.Promes:
            return generatePromes(data);
        case AdminDocType.AsesmenDiagnostik:
            return generateAsesmenDiagnostik(data);
        case AdminDocType.AsesmenFormatif:
            return generateAsesmenFormatif(data);
        case AdminDocType.AsesmenSumatif:
            return generateAsesmenSumatif(data);
        case AdminDocType.KisiKisi:
            return generateKisiKisi(data);
        case AdminDocType.BankSoal:
            return generateBankSoal(data);
        case AdminDocType.BahanBacaan:
            return generateBahanBacaan(data);
        default:
            return `# ${docType}\n\nDokumen ini belum memiliki template. Silakan hubungi pengembang.`;
    }
}
