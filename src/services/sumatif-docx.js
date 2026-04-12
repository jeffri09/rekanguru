// ============================================================
// Sumatif DOCX Builder — Word Document for Soal Sumatif
// Kunci jawaban di lembar paling akhir
// ============================================================

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  convertMillimetersToTwip,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  VerticalAlign,
} from 'docx';
import { saveAs } from 'file-saver';

const optionLetters = ['A', 'B', 'C', 'D', 'E'];

// ====== HELPER: Create a bordered table ======
function borderedTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
    },
  });
}

function cell(text, opts = {}) {
  const { bold = false, width, alignment = AlignmentType.LEFT, font = 'Times New Roman', size = 24 } = opts;
  const cellOpts = {
    children: [
      new Paragraph({
        alignment,
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({ text: String(text), font, size, bold }),
        ],
      }),
    ],
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
  };
  if (width) cellOpts.width = { size: width, type: WidthType.PERCENTAGE };
  return new TableCell(cellOpts);
}

// ====== PAGE PROPERTIES ======
const pageProps = {
  size: {
    width: convertMillimetersToTwip(210),
    height: convertMillimetersToTwip(297),
  },
  margin: {
    top: convertMillimetersToTwip(25),
    right: convertMillimetersToTwip(25),
    bottom: convertMillimetersToTwip(25),
    left: convertMillimetersToTwip(30),
  },
};

// ====== SECTION HEADER ======
function sectionHeader(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text,
        font: 'Arial',
        size: 26,
        bold: true,
      }),
    ],
  });
}

// ====== BUILD PILIHAN GANDA SECTION ======
function buildPGSection(data, sectionNum) {
  const elements = [];
  elements.push(sectionHeader(`${sectionNum}. Pilihan Ganda`));
  elements.push(new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: 'Pilihlah jawaban yang paling tepat!',
        font: 'Times New Roman',
        size: 24,
        italics: true,
      }),
    ],
  }));

  for (const q of data.questions) {
    // Question text
    elements.push(new Paragraph({
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({ text: `${q.number}. `, font: 'Times New Roman', size: 24, bold: true }),
        new TextRun({ text: q.question, font: 'Times New Roman', size: 24 }),
      ],
    }));

    // Options
    const opts = q.options || {};
    for (const letter of Object.keys(opts)) {
      elements.push(new Paragraph({
        spacing: { before: 20, after: 20 },
        indent: { left: 400 },
        children: [
          new TextRun({ text: `${letter}. `, font: 'Times New Roman', size: 24, bold: true }),
          new TextRun({ text: opts[letter], font: 'Times New Roman', size: 24 }),
        ],
      }));
    }
  }

  return elements;
}

// ====== BUILD ISIAN SINGKAT SECTION ======
function buildIsianSection(data, sectionNum) {
  const elements = [];
  elements.push(sectionHeader(`${sectionNum}. Isian Singkat`));
  elements.push(new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: 'Jawablah pertanyaan berikut dengan singkat dan tepat!',
        font: 'Times New Roman',
        size: 24,
        italics: true,
      }),
    ],
  }));

  for (const q of data.questions) {
    elements.push(new Paragraph({
      spacing: { before: 160, after: 40 },
      children: [
        new TextRun({ text: `${q.number}. `, font: 'Times New Roman', size: 24, bold: true }),
        new TextRun({ text: q.question, font: 'Times New Roman', size: 24 }),
      ],
    }));
    // Answer line
    elements.push(new Paragraph({
      spacing: { before: 40, after: 80 },
      indent: { left: 400 },
      children: [
        new TextRun({ text: 'Jawab: _______________________________________________', font: 'Times New Roman', size: 24, color: '888888' }),
      ],
    }));
  }

  return elements;
}

// ====== BUILD ESAI SECTION ======
function buildEsaiSection(data, sectionNum) {
  const elements = [];
  elements.push(sectionHeader(`${sectionNum}. Esai / Uraian`));
  elements.push(new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: 'Jawablah pertanyaan berikut dengan uraian yang jelas dan lengkap!',
        font: 'Times New Roman',
        size: 24,
        italics: true,
      }),
    ],
  }));

  for (const q of data.questions) {
    const pointsText = q.points ? ` (${q.points} poin)` : '';
    elements.push(new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [
        new TextRun({ text: `${q.number}. `, font: 'Times New Roman', size: 24, bold: true }),
        new TextRun({ text: q.question, font: 'Times New Roman', size: 24 }),
        new TextRun({ text: pointsText, font: 'Times New Roman', size: 22, bold: true, italics: true }),
      ],
    }));
    // Space for answer
    for (let i = 0; i < 4; i++) {
      elements.push(new Paragraph({
        spacing: { before: 20, after: 20 },
        indent: { left: 400 },
        children: [
          new TextRun({ text: '....................................................................................................................', font: 'Times New Roman', size: 24, color: 'cccccc' }),
        ],
      }));
    }
  }

  return elements;
}

// ====== BUILD MENCOCOKKAN SECTION ======
function buildMencocokkanSection(data, sectionNum) {
  const elements = [];
  elements.push(sectionHeader(`${sectionNum}. Mencocokkan / Menjodohkan`));
  elements.push(new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: 'Cocokkan pernyataan di kolom kiri dengan jawaban yang tepat di kolom kanan!',
        font: 'Times New Roman',
        size: 24,
        italics: true,
      }),
    ],
  }));

  // Combine right answers + distractors, then shuffle
  const allRight = [
    ...(data.pairs || []).map(p => p.right),
    ...(data.distractors || []),
  ];
  // Shuffle using Fisher-Yates
  for (let i = allRight.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allRight[i], allRight[j]] = [allRight[j], allRight[i]];
  }

  // Build table
  const headerRow = new TableRow({
    children: [
      cell('No.', { bold: true, width: 8, alignment: AlignmentType.CENTER }),
      cell('Pernyataan (Kolom Kiri)', { bold: true, width: 46, alignment: AlignmentType.CENTER }),
      cell('Jawaban', { bold: true, width: 8, alignment: AlignmentType.CENTER }),
      cell('Pilihan Jawaban (Kolom Kanan)', { bold: true, width: 38, alignment: AlignmentType.CENTER }),
    ],
  });

  const rows = [headerRow];
  const maxRows = Math.max((data.pairs || []).length, allRight.length);
  
  for (let i = 0; i < maxRows; i++) {
    const pair = (data.pairs || [])[i];
    const rightItem = allRight[i];
    const rightLetter = optionLetters[i] || String(i + 1);

    rows.push(new TableRow({
      children: [
        cell(pair ? String(pair.number) : '', { width: 8, alignment: AlignmentType.CENTER }),
        cell(pair ? pair.left : '', { width: 46 }),
        cell(pair ? '( .... )' : '', { width: 8, alignment: AlignmentType.CENTER }),
        cell(rightItem ? `${rightLetter}. ${rightItem}` : '', { width: 38 }),
      ],
    }));
  }

  elements.push(borderedTable(rows));
  return elements;
}

// ====== BUILD KUNCI JAWABAN ======
function buildAnswerKey(generatedData, enabledTypes) {
  const elements = [];

  // Page break + Title
  elements.push(new Paragraph({ children: [new PageBreak()] }));
  elements.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 400 },
    children: [
      new TextRun({
        text: 'KUNCI JAWABAN',
        font: 'Arial',
        size: 32,
        bold: true,
      }),
    ],
  }));

  let sectionNum = 1;

  // PG Answer Key
  if (enabledTypes.pilihan_ganda && generatedData.pilihan_ganda) {
    elements.push(sectionHeader(`${sectionNum}. Kunci Jawaban Pilihan Ganda`));
    
    const pgData = generatedData.pilihan_ganda.questions || [];
    // Build table for PG answers - 5 columns per row
    const cols = 5;
    const pgRows = [];
    pgRows.push(new TableRow({
      children: Array.from({ length: cols }, () => [
        cell('No.', { bold: true, width: Math.floor(50 / cols), alignment: AlignmentType.CENTER }),
        cell('Jawaban', { bold: true, width: Math.floor(50 / cols), alignment: AlignmentType.CENTER }),
      ]).flat(),
    }));

    for (let i = 0; i < pgData.length; i += cols) {
      const rowCells = [];
      for (let j = 0; j < cols; j++) {
        const q = pgData[i + j];
        rowCells.push(cell(q ? String(q.number) : '', { width: Math.floor(50 / cols), alignment: AlignmentType.CENTER }));
        rowCells.push(cell(q ? q.answer : '', { bold: true, width: Math.floor(50 / cols), alignment: AlignmentType.CENTER }));
      }
      pgRows.push(new TableRow({ children: rowCells }));
    }
    elements.push(borderedTable(pgRows));

    // Explanations
    elements.push(new Paragraph({ spacing: { before: 200, after: 100 }, children: [
      new TextRun({ text: 'Pembahasan:', font: 'Arial', size: 24, bold: true }),
    ] }));
    for (const q of pgData) {
      if (q.explanation) {
        elements.push(new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({ text: `${q.number}. `, font: 'Times New Roman', size: 22, bold: true }),
            new TextRun({ text: q.explanation, font: 'Times New Roman', size: 22 }),
          ],
        }));
      }
    }
    sectionNum++;
  }

  // Isian Singkat Answer Key
  if (enabledTypes.isian_singkat && generatedData.isian_singkat) {
    elements.push(sectionHeader(`${sectionNum}. Kunci Jawaban Isian Singkat`));
    const isianData = generatedData.isian_singkat.questions || [];
    for (const q of isianData) {
      elements.push(new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({ text: `${q.number}. `, font: 'Times New Roman', size: 24, bold: true }),
          new TextRun({ text: q.answer, font: 'Times New Roman', size: 24 }),
        ],
      }));
    }
    sectionNum++;
  }

  // Esai Answer Key / Rubrik
  if (enabledTypes.esai && generatedData.esai) {
    elements.push(sectionHeader(`${sectionNum}. Kunci Jawaban / Rubrik Esai`));
    const esaiData = generatedData.esai.questions || [];
    for (const q of esaiData) {
      const pointsText = q.points ? ` (${q.points} poin)` : '';
      elements.push(new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({ text: `${q.number}.${pointsText} `, font: 'Times New Roman', size: 24, bold: true }),
        ],
      }));
      // Answer/rubric as bullet points or paragraph
      const answerLines = (q.answer || '').split('\n');
      for (const line of answerLines) {
        if (line.trim()) {
          elements.push(new Paragraph({
            spacing: { before: 20, after: 20 },
            indent: { left: 400 },
            children: [
              new TextRun({ text: line.trim(), font: 'Times New Roman', size: 22 }),
            ],
          }));
        }
      }
    }
    sectionNum++;
  }

  // Mencocokkan Answer Key
  if (enabledTypes.mencocokkan && generatedData.mencocokkan) {
    elements.push(sectionHeader(`${sectionNum}. Kunci Jawaban Mencocokkan`));
    const pairs = generatedData.mencocokkan.pairs || [];
    for (const p of pairs) {
      elements.push(new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({ text: `${p.number}. `, font: 'Times New Roman', size: 24, bold: true }),
          new TextRun({ text: `${p.left}  →  `, font: 'Times New Roman', size: 24 }),
          new TextRun({ text: p.right, font: 'Times New Roman', size: 24, bold: true }),
        ],
      }));
    }
  }

  return elements;
}

// ====== MAIN: Build and Download ======
export async function buildSumatifDocx(generatedData, config) {
  const {
    topic = '',
    subject = '',
    classPhase = '',
    enabledTypes = {},
  } = config;

  const children = [];

  // ====== DOCUMENT HEADER ======
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [
      new TextRun({ text: 'SOAL UJIAN SUMATIF', font: 'Arial', size: 32, bold: true }),
    ],
  }));

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [
      new TextRun({ text: subject || 'Mata Pelajaran', font: 'Arial', size: 26, bold: true }),
    ],
  }));

  if (classPhase) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({ text: classPhase, font: 'Arial', size: 24 }),
      ],
    }));
  }

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [
      new TextRun({ text: `Topik: ${topic}`, font: 'Times New Roman', size: 24, italics: true }),
    ],
  }));

  // Divider
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', size: 18 }),
    ],
  }));

  // Info box
  const infoRows = [
    new TableRow({
      children: [
        cell('Nama', { bold: true, width: 25 }),
        cell(': ........................................................', { width: 75 }),
      ],
    }),
    new TableRow({
      children: [
        cell('Kelas', { bold: true, width: 25 }),
        cell(': ........................................................', { width: 75 }),
      ],
    }),
    new TableRow({
      children: [
        cell('Tanggal', { bold: true, width: 25 }),
        cell(': ........................................................', { width: 75 }),
      ],
    }),
  ];
  children.push(borderedTable(infoRows));
  children.push(new Paragraph({ spacing: { before: 200 } }));

  // ====== SOAL SECTIONS ======
  let sectionNum = 1;
  const sectionOrder = ['pilihan_ganda', 'isian_singkat', 'esai', 'mencocokkan'];

  for (const type of sectionOrder) {
    if (!enabledTypes[type] || !generatedData[type]) continue;

    switch (type) {
      case 'pilihan_ganda':
        children.push(...buildPGSection(generatedData.pilihan_ganda, sectionNum));
        break;
      case 'isian_singkat':
        children.push(...buildIsianSection(generatedData.isian_singkat, sectionNum));
        break;
      case 'esai':
        children.push(...buildEsaiSection(generatedData.esai, sectionNum));
        break;
      case 'mencocokkan':
        children.push(...buildMencocokkanSection(generatedData.mencocokkan, sectionNum));
        break;
    }
    sectionNum++;
  }

  // ====== KUNCI JAWABAN (Lembar Terakhir) ======
  children.push(...buildAnswerKey(generatedData, enabledTypes));

  // ====== CREATE DOCUMENT ======
  const doc = new Document({
    creator: 'Perangkat Guru AI',
    title: `Soal Sumatif - ${subject || 'Ujian'} - ${topic || 'Umum'}`,
    description: `Soal ujian sumatif ${subject} tentang ${topic}`,
    sections: [
      {
        properties: {
          page: pageProps,
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `Soal Sumatif — ${subject || 'Ujian'}`,
                      font: 'Times New Roman',
                      size: 18,
                      italics: true,
                      color: '888888',
                    }),
                  ],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      children: [PageNumber.CURRENT],
                      font: 'Times New Roman',
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          },
        },
        children,
      },
    ],
  });

  // ====== PACK & DOWNLOAD ======
  const blob = await Packer.toBlob(doc);
  const safeName = `Soal_Sumatif_${(subject || 'Ujian').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}_${(topic || '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 30)}`;
  const filename = `${safeName}.docx`;
  saveAs(blob, filename);

  return filename;
}
