// ============================================================
// Analisis Narasi CP — Bedah Kalimat CP
// Membedah CP menjadi:
//   1. Kompetensi: Kata kerja operasional (KKO)
//   2. Lingkup Materi: Topik/konsep utama
// 
// Sumber referensi: Taksonomi Bloom Revisi (Anderson & Krathwohl)
// ============================================================

/**
 * Daftar Kata Kerja Operasional (KKO) berdasarkan level Taksonomi Bloom
 */
const KKO_TAXONOMY = {
  C1_Mengingat: [
    'menyebutkan', 'mengenali', 'mengingat', 'mendaftar', 'menunjukkan',
    'menamai', 'menandai', 'menghafal', 'mengidentifikasi', 'mengenal',
    'memilih', 'menuliskan', 'menggarisbawahi', 'menjodohkan', 'meniru',
    'menirukan', 'mencatat', 'membilang', 'membaca',
  ],
  C2_Memahami: [
    'memahami', 'menjelaskan', 'mendeskripsikan', 'menafsirkan', 'merangkum',
    'mengklasifikasikan', 'membandingkan', 'menceritakan', 'mencontohkan',
    'membedakan', 'mengelompokkan', 'meringkas', 'memperkirakan', 'menyimpulkan',
    'mengkategorikan', 'mengilustrasikan', 'menguraikan', 'memaknai',
    'menelaah', 'merefleksikan', 'mengapresiasi', 'mengemukakan',
    'merespons', 'mengenalkan', 'menggambarkan',
  ],
  C3_Menerapkan: [
    'menerapkan', 'menggunakan', 'melaksanakan', 'menjalankan', 'mengoperasikan',
    'mempraktikkan', 'menyusun', 'menghitung', 'melakukan', 'membuktikan',
    'mengimplementasikan', 'memanfaatkan', 'mengaplikasikan', 'memperagakan',
    'meragakan', 'memodifikasi', 'mendemonstrasikan', 'menyajikan',
    'mempresentasikan', 'membuat', 'memproses', 'merumuskan', 'menaati',
    'membangun', 'membiasakan', 'mengeksplorasi',
  ],
  C4_Menganalisis: [
    'menganalisis', 'mengorganisasi', 'mengatribusikan',
    'mengkritisi', 'menguji', 'mendiagnosis', 'memecahkan',
    'menghubungkan', 'mengaitkan', 'menyelidiki', 'menginvestigasi', 
    'memetakan', 'mendeteksi', 'mengkorelasikan', 'memerinci', 
    'mengkaji', 'mendiskusikan',
  ],
  C5_Mengevaluasi: [
    'mengevaluasi', 'menilai', 'mempertimbangkan', 'memutuskan',
    'mengkritik', 'memvalidasi', 'memverifikasi', 'merekomendasikan',
    'mempertahankan', 'membela', 'menyanggah', 'menyeleksi', 'mengukur',
    'menaksir',
  ],
  C6_Mencipta: [
    'mencipta', 'menciptakan', 'merancang', 'menghasilkan', 'merencanakan',
    'mengembangkan', 'mengkonstruksi', 'mendesain',
    'memformulasikan', 'mengkreasikan', 'mengarang', 'mengkomposisi',
    'merekayasa', 'mengkombinasikan', 'menyintesis', 'memadukan',
    'merangkai', 'menggubah', 'membentuk', 'memproduksi',
  ],
};

/**
 * Flatten KKO for quick lookup
 */
const KKO_FLAT = {};
for (const [level, words] of Object.entries(KKO_TAXONOMY)) {
  for (const word of words) {
    KKO_FLAT[word.toLowerCase()] = level;
  }
}

/**
 * All KKO words sorted by length (longest first) for greedy matching
 */
const KKO_SORTED = Object.keys(KKO_FLAT).sort((a, b) => b.length - a.length);

function getBloomLabel(levelKey) {
  const map = {
    C1_Mengingat: 'C1 — Mengingat',
    C2_Memahami: 'C2 — Memahami',
    C3_Menerapkan: 'C3 — Menerapkan',
    C4_Menganalisis: 'C4 — Menganalisis',
    C5_Mengevaluasi: 'C5 — Mengevaluasi',
    C6_Mencipta: 'C6 — Mencipta',
  };
  return map[levelKey] || levelKey;
}

function getBloomShort(levelKey) {
  return levelKey?.split('_')[0] || '';
}

/**
 * Normalize verb — strip common Indonesian suffixes (nya, kan, i, lah)
 * to find the base KKO form
 */
function normalizeVerb(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  // Direct match first
  if (KKO_FLAT[w]) return w;
  // Strip suffix "nya" (e.g., mengaitkannya → mengaitkan → mengaitkan)
  if (w.endsWith('nya') && KKO_FLAT[w.slice(0, -3)]) return w.slice(0, -3);
  // Strip suffix "lah"
  if (w.endsWith('lah') && KKO_FLAT[w.slice(0, -3)]) return w.slice(0, -3);
  return null;
}

/**
 * Find all KKO verbs in a text, using greedy longest-match
 */
function findKKOInText(text) {
  const lower = text.toLowerCase();
  const results = [];
  const found = new Set();
  
  // Scan each word
  const words = lower.split(/\s+/);
  for (const rawWord of words) {
    const word = rawWord.replace(/[^a-z]/g, '');
    const normalized = normalizeVerb(word);
    
    if (normalized && !found.has(normalized)) {
      found.add(normalized);
      results.push({
        original: word,
        normalized: normalized,
        level: KKO_FLAT[normalized],
      });
    }
  }
  
  return results;
}

/**
 * Bedah satu kalimat/paragraf CP menjadi komponen
 * @param {string} cpText - Teks narasi CP
 * @returns {Object} Hasil analisis
 */
export function analisisCPNarasi(cpText) {
  if (!cpText || cpText.trim().length === 0) {
    return { kompetensi: [], lingkupMateri: [], tujuanPembelajaran: [], statistik: { totalKKO: 0, totalMateri: 0, totalTP: 0, levelBloomTertinggi: '-' } };
  }

  const text = cpText.trim();
  
  // ==========================================================
  // TAHAP 1: Ekstrak Kompetensi (KKO)
  // ==========================================================
  const kompetensi = [];
  const foundVerbs = new Set();
  
  // Split into sub-elements by numbered pattern (1.1., 1.2., etc.)
  // or by semicolon/period
  const subElements = text.split(/(?=\d+\.\d+\.?\s)|[;]/);
  
  for (const segment of subElements) {
    if (!segment.trim()) continue;
    
    const verbs = findKKOInText(segment);
    for (const v of verbs) {
      if (!foundVerbs.has(v.normalized)) {
        foundVerbs.add(v.normalized);
        
        const context = segment.trim();
        kompetensi.push({
          kataKerja: v.normalized.charAt(0).toUpperCase() + v.normalized.slice(1),
          levelBloom: v.level,
          levelLabel: getBloomLabel(v.level),
          levelShort: getBloomShort(v.level),
          konteks: context.length > 150 ? context.substring(0, 150) + '...' : context,
        });
      }
    }
  }

  // ==========================================================
  // TAHAP 2: Ekstrak Lingkup Materi  
  // ==========================================================
  const lingkupMateri = [];
  
  // Strategy A: Numbered sub-elements like "1.1. Al-Qur'an Hadis"
  // Match "N.N." or "N.N. Title" at start of segments
  const numberedPattern = /(\d+\.\d+\.?)\s+([A-Z][^\d]*?)(?=\d+\.\d+\.?\s|$)/g;
  let match;
  const processedText = text.replace(/\n/g, ' ');
  
  while ((match = numberedPattern.exec(processedText)) !== null) {
    const fullSegment = match[2].trim();
    
    // Extract the TOPIC NAME (before the first KKO verb)
    let topikName = fullSegment;
    
    // Find where the EARLIEST verb starts to separate topic from description
    let earliestVerbIdx = Infinity;
    for (const kko of KKO_SORTED) {
      const verbIdx = fullSegment.toLowerCase().indexOf(kko);
      if (verbIdx > 0 && verbIdx < earliestVerbIdx) {
        const beforeVerb = fullSegment.substring(0, verbIdx).trim();
        if (beforeVerb.length >= 3) {
          earliestVerbIdx = verbIdx;
          topikName = beforeVerb;
        }
      }
    }
    
    // Get the full description (topic + what follows)
    const deskripsi = fullSegment.length > 200 ? fullSegment.substring(0, 200) + '...' : fullSegment;
    
    // Clean topic name
    topikName = topikName.replace(/[,\s]+$/, '').trim();
    if (topikName.length > 80) topikName = topikName.substring(0, 80) + '...';
    
    if (topikName.length >= 3) {
      lingkupMateri.push({
        topik: topikName,
        deskripsi: deskripsi,
        nomor: match[1],
      });
    }
  }
  
  // Strategy B: "Elemen X" pattern
  if (lingkupMateri.length === 0) {
    const elemenPattern = /(?:Elemen|elemen)\s+([A-Z][^.;]{3,60})/g;
    while ((match = elemenPattern.exec(text)) !== null) {
      lingkupMateri.push({
        topik: match[1].trim(),
        deskripsi: match[1].trim(),
      });
    }
  }
  
  // Strategy C: Fallback — for simple/short CP without numbered items
  // Extract meaningful topic from each clause by finding text after KKO
  if (lingkupMateri.length === 0 && kompetensi.length > 0) {
    const clauses = text.split(/[;.]\s*/);
    const usedTopics = new Set();
    
    for (const clause of clauses) {
      if (!clause.trim() || clause.trim().length < 10) continue;
      
      // Find the FIRST KKO verb in this clause
      const clauseLower = clause.toLowerCase();
      let earliestIdx = Infinity;
      let foundVerb = null;
      
      for (const kko of KKO_SORTED) {
        const idx = clauseLower.indexOf(kko);
        if (idx >= 0 && idx < earliestIdx) {
          earliestIdx = idx;
          foundVerb = kko;
        }
      }
      
      if (foundVerb && earliestIdx < Infinity) {
        let after = clause.substring(earliestIdx + foundVerb.length).trim();
        // Strip suffix artifacts like "nya", "kan"
        after = after.replace(/^nya\b/i, '').trim();
        // Clean: remove leading conjunctions
        after = after.replace(/^(?:dan|serta|atau|dengan|untuk|tentang)\s+/i, '').trim();
        // Capitalize
        if (after.length > 5) {
          const topik = after.length > 120 ? after.substring(0, 120) + '...' : after;
          const topikClean = topik.charAt(0).toUpperCase() + topik.slice(1);
          
          if (!usedTopics.has(topikClean.toLowerCase())) {
            usedTopics.add(topikClean.toLowerCase());
            lingkupMateri.push({
              topik: topikClean,
              deskripsi: clause.trim(),
            });
          }
        }
      }
    }
  }

  // ==========================================================
  // TAHAP 3: Rumuskan Tujuan Pembelajaran (TP)
  // Combine EACH materi with its most relevant KKO
  // ==========================================================
  const tujuanPembelajaran = [];
  
  if (lingkupMateri.length > 0 && kompetensi.length > 0) {
    for (const materi of lingkupMateri) {
      // Find the KKO that appears in this materi's description
      let bestKompetensi = null;
      
      // First: find KKO that's IN this specific materi's description
      for (const k of kompetensi) {
        if (materi.deskripsi.toLowerCase().includes(k.kataKerja.toLowerCase())) {
          bestKompetensi = k;
          break;
        }
      }
      
      // Fallback: use the highest-level KKO available
      if (!bestKompetensi) {
        const bloomOrder = ['C6', 'C5', 'C4', 'C3', 'C2', 'C1'];
        const sorted = [...kompetensi].sort((a, b) => 
          bloomOrder.indexOf(a.levelShort) - bloomOrder.indexOf(b.levelShort)
        );
        bestKompetensi = sorted[0];
      }

      if (bestKompetensi) {
        // Build clean TP: "Verb + topic"
        let topikForTP = materi.topik;
        
        // Remove redundancy: if topic starts with the verb's root
        // e.g., verb "Menganalisis" + topic "Analisis Data" → "Menganalisis data"
        const verbRoot = bestKompetensi.kataKerja.toLowerCase().replace(/^(?:meny|meng|mem|men|me|ber|di|ter|ke|se)/, '');
        if (verbRoot.length > 3 && topikForTP.toLowerCase().startsWith(verbRoot)) {
          topikForTP = topikForTP.substring(verbRoot.length).trim();
          // Remove leading "dan", "serta" etc after stripping
          topikForTP = topikForTP.replace(/^(?:dan|serta|atau)\s+/i, '').trim();
        }
        
        const topikLower = topikForTP.charAt(0).toLowerCase() + topikForTP.slice(1);
        
        // Truncate long topics at natural break points for readability
        let tpText = `${bestKompetensi.kataKerja} ${topikLower}`;
        if (tpText.length > 80) {
          // Try to cut at a natural break (comma, semicolon, period, or "dan")
          const cutPoint = tpText.substring(0, 80).search(/[,;.]|(?:\sdan\s)/);
          if (cutPoint > 20) {
            tpText = tpText.substring(0, cutPoint).trim();
          } else {
            // Cut at last space before 80 chars
            const lastSpace = tpText.substring(0, 80).lastIndexOf(' ');
            tpText = tpText.substring(0, lastSpace > 20 ? lastSpace : 80).trim();
          }
        }
        
        tujuanPembelajaran.push({
          tp: tpText,
          kompetensi: bestKompetensi.kataKerja,
          levelBloom: bestKompetensi.levelShort,
          lingkupMateri: materi.topik,
        });
      }
    }
  }
  
  // If no TP formed but have kompetensi, create TP from kompetensi context
  if (tujuanPembelajaran.length === 0 && kompetensi.length > 0) {
    for (const k of kompetensi.slice(0, 5)) {
      tujuanPembelajaran.push({
        tp: k.konteks.length > 120 ? k.konteks.substring(0, 120) + '...' : k.konteks,
        kompetensi: k.kataKerja,
        levelBloom: k.levelShort,
        lingkupMateri: k.konteks,
      });
    }
  }

  return {
    kompetensi,
    lingkupMateri,
    tujuanPembelajaran,
    statistik: {
      totalKKO: kompetensi.length,
      totalMateri: lingkupMateri.length,
      totalTP: tujuanPembelajaran.length,
      levelBloomTertinggi: kompetensi.length > 0 
        ? kompetensi.reduce((max, k) => {
            const order = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'];
            return order.indexOf(k.levelShort) > order.indexOf(max) ? k.levelShort : max;
          }, 'C1')
        : '-',
    }
  };
}

/**
 * Analisis seluruh CP data array
 */
export function analisisSemuaCP(cpDataArray) {
  if (!cpDataArray || cpDataArray.length === 0) return [];
  
  return cpDataArray.map((cp, idx) => ({
    cpIndex: idx,
    cpCode: cp.code || `CP-${idx + 1}`,
    cpDescription: cp.description || '',
    analisis: analisisCPNarasi(cp.description || ''),
  }));
}

/**
 * Format analisis into structured data for prompt injection 
 */
export function formatAnalisisForPrompt(analisisResults) {
  if (!analisisResults || analisisResults.length === 0) return '';
  
  let text = '\n🔬 HASIL ANALISIS NARASI CP (BEDAH KALIMAT):\n';
  text += '══════════════════════════════════════════════\n';
  
  for (const result of analisisResults) {
    text += `\n${result.cpCode}:\n`;
    
    if (result.analisis.kompetensi.length > 0) {
      text += '  📌 Kompetensi (KKO):\n';
      for (const k of result.analisis.kompetensi) {
        text += `    • ${k.kataKerja} [${k.levelLabel}]\n`;
      }
    }
    
    if (result.analisis.lingkupMateri.length > 0) {
      text += '  📚 Lingkup Materi:\n';
      for (const m of result.analisis.lingkupMateri) {
        text += `    • ${m.topik}\n`;
      }
    }
    
    if (result.analisis.tujuanPembelajaran.length > 0) {
      text += '  🎯 Rumusan TP:\n';
      for (const tp of result.analisis.tujuanPembelajaran) {
        text += `    • [${tp.levelBloom}] ${tp.tp}\n`;
      }
    }
  }
  
  text += '\n══════════════════════════════════════════════\n';
  text += 'INSTRUKSI: Gunakan hasil analisis di atas sebagai FONDASI untuk:\n';
  text += '1. Menyusun Tujuan Pembelajaran (TP) yang SMART\n';
  text += '2. Menyusun Alur Tujuan Pembelajaran (ATP) berurutan dari konkret ke abstrak\n';
  text += '3. Merumuskan KKTP (Kriteria Ketercapaian TP) berbasis rubrik kualitatif\n';
  text += '4. Mendesain asesmen tegak lurus dengan KKTP\n';
  text += '5. Mendesain pengalaman belajar dengan Deep Learning & Backward Design\n';
  
  return text;
}
