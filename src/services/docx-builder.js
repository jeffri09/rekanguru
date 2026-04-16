// ============================================================
// DOCX Builder — Word Document Generation (Professional)
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
  NumberFormat,
  TableOfContents,
  convertInchesToTwip,
  convertMillimetersToTwip,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle
} from 'docx';
import { saveAs } from 'file-saver';

/**
 * Handle docLabels fallback correctly
 */
function getDocLabelStr(book) {
  if (book.docTypes && book.docTypes.length > 0) return book.docTypes.join('_').toUpperCase();
  if (book.docType) return book.docType.toUpperCase();
  return 'DOKUMEN_PENDIDIKAN';
}

function getTitleStr(book) {
  let typeStr = getDocLabelStr(book).replace(/_/g, ' ');
  return typeStr + (book.topic ? ' - ' + book.topic : '');
}

/**
 * Parse markdown-like chapter content into docx paragraphs
 */
function parseContentToParagraphs(text, settings) {
  const elements = [];
  const lines = text.split('\n');
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Markdown Table parsing
    if (line.trim().startsWith('|')) {
      let tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      
      if (tableLines.length > 2) {
        // Build table
        const rows = [];
        
        // tableLines[0] is header
        // tableLines[1] is separator (skip)
        // tableLines[2+] are rows
        
        // Function to parse row
        const parseRow = (rLine, isHeader) => {
          const cols = rLine.split('|').slice(1, -1).map(c => c.trim());
          return new TableRow({
            children: cols.map(c => new TableCell({
              children: [new Paragraph({
                alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
                children: parseInlineFormatting(c, settings, isHeader)
              })],
              margin: { top: 100, bottom: 100, left: 100, right: 100 }
            }))
          });
        };
        
        rows.push(parseRow(tableLines[0], true));
        for (let r = 2; r < tableLines.length; r++) {
          rows.push(parseRow(tableLines[r], false));
        }

        elements.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: rows,
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          }
        }));
      }
      continue;
    }

    // H2: ## Sub-heading
    if (line.startsWith('## ')) {
      elements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 360, after: 160 },
          children: [
            new TextRun({
              text: line.replace(/^##\s*/, ''),
              font: settings.headingFont || 'Arial',
              size: 26, // 13pt
              bold: true,
              color: '000000',
            }),
          ],
        })
      );
      i++;
      continue;
    }

    // H3: ### Sub-sub-heading
    if (line.startsWith('### ')) {
      elements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 280, after: 120 },
          children: [
            new TextRun({
              text: line.replace(/^###\s*/, ''),
              font: settings.headingFont || 'Arial',
              size: 24, // 12pt
              bold: true,
              color: '000000',
            }),
          ],
        })
      );
      i++;
      continue;
    }

    // Bullet points: - item
    if (line.match(/^[-*]\s/)) {
      elements.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          indent: { left: convertInchesToTwip(0.5) },
          children: [
            new TextRun({
              text: '• ' + line.replace(/^[-*]\s*/, ''),
              font: settings.bodyFont || 'Times New Roman',
              size: settings.bodySize ? settings.bodySize * 2 : 24,
            }),
          ],
        })
      );
      i++;
      continue;
    }

    // Numbered list: 1. item
    if (line.match(/^\d+\.\s/)) {
      elements.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          indent: { left: convertInchesToTwip(0.5) },
          children: [
            new TextRun({
              text: line,
              font: settings.bodyFont || 'Times New Roman',
              size: settings.bodySize ? settings.bodySize * 2 : 24,
            }),
          ],
        })
      );
      i++;
      continue;
    }

    // Regular paragraph — handle bold and italic
    const children = parseInlineFormatting(line, settings);
    elements.push(
      new Paragraph({
        spacing: {
          before: 80,
          after: 80,
          line: Math.round((settings.spacing || 1.5) * 240),
        },
        alignment: AlignmentType.JUSTIFIED,
        children,
      })
    );
    
    i++;
  }

  return elements;
}

/**
 * Parse inline bold/italic formatting
 */
function parseInlineFormatting(text, settings, forceBold = false) {
  const runs = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  const font = settings.bodyFont || 'Times New Roman';
  const size = settings.bodySize ? settings.bodySize * 2 : 24;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({ text: text.slice(lastIndex, match.index), font, size, bold: forceBold }));
    }

    if (match[2]) {
      // Bold: **text**
      runs.push(new TextRun({ text: match[2], bold: true, font, size }));
    } else if (match[3]) {
      // Italic: *text*
      runs.push(new TextRun({ text: match[3], italics: true, bold: forceBold, font, size }));
    } else if (match[4]) {
      // Code: `text`
      runs.push(new TextRun({ text: match[4], font: 'Courier New', size: size - 2 }));
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIndex), font, size, bold: forceBold }));
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text: text, font, size, bold: forceBold }));
  }

  return runs;
}

/**
 * Create cover page section
 */
function createCoverPage(book, settings, profile) {
  const mainTitle = getTitleStr(book);
  const subTitle = book.targetRole === 'guru' ? 
    (book.subject || '') + (book.classPhase ? ' (' + book.classPhase + ')' : '') : 
    (book.description || '');
  const p = profile || {};
  const semesterLabel = book.semester === '2' ? 'Semester 2 (Genap)' : 'Semester 1 (Ganjil)';
  const tahunAjaran = book.tahunAjaran || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;

  const elements = [];

  // School Name (Kop)
  if (p.namaSekolah) {
    elements.push(
      new Paragraph({ spacing: { before: 1200 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: p.namaSekolah.toUpperCase(), font: settings.headingFont || 'Arial', size: 32, bold: true })],
      }),
    );
    if (p.alamatSekolah) {
      elements.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: p.alamatSekolah, font: settings.bodyFont || 'Times New Roman', size: 20, color: '555555' })],
      }));
    }
    if (p.kabupatenKota || p.provinsi) {
      elements.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: [p.kabupatenKota, p.provinsi].filter(Boolean).join(', '), font: settings.bodyFont || 'Times New Roman', size: 20, color: '555555' })],
      }));
    }
    // Separator line
    elements.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', size: 20 })],
    }));
  } else {
    elements.push(new Paragraph({ spacing: { before: 3000 } }));
  }

  // Main Title
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: mainTitle.toUpperCase(), font: settings.headingFont || 'Arial', size: 48, bold: true, color: '000000' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: '━━━━━━━━━━━━━━━━━━━━━━', size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: subTitle, font: settings.bodyFont || 'Times New Roman', size: 28, italics: true, color: '333333' })],
    }),
  );

  // Semester & Tahun Ajaran
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
    children: [new TextRun({ text: `${semesterLabel} — Tahun Ajaran ${tahunAjaran}`, font: settings.bodyFont || 'Times New Roman', size: 24, color: '333333' })],
  }));

  // Disusun Oleh
  if (p.namaGuru) {
    elements.push(
      new Paragraph({ spacing: { before: 1200 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: 'Disusun oleh:', font: settings.bodyFont || 'Times New Roman', size: 24, color: '555555' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: p.namaGuru, font: settings.bodyFont || 'Times New Roman', size: 28, bold: true })],
      }),
    );
    if (p.nip) {
      elements.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: `NIP. ${p.nip}`, font: settings.bodyFont || 'Times New Roman', size: 22, color: '555555' })],
      }));
    }
  }

  // Footer info
  elements.push(
    new Paragraph({ spacing: { before: 1200 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: p.namaSekolah || 'Kurikulum Merdeka Terintegrasi AI', font: settings.headingFont || 'Arial', size: 24, color: '000000' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: new Date().getFullYear().toString(), font: settings.bodyFont || 'Times New Roman', size: 24 })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  );

  return elements;
}

/**
 * Create Halaman Pengesahan (Approval Page)
 */
function createPengesahanPage(book, settings, profile) {
  const p = profile || {};
  const tahunAjaran = book.tahunAjaran || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;
  const semesterLabel = book.semester === '2' ? 'Semester 2 (Genap)' : 'Semester 1 (Ganjil)';
  const lokasi = p.kabupatenKota || '.....................';

  return [
    new Paragraph({ spacing: { before: 1200 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: 'LEMBAR PENGESAHAN', font: settings.headingFont || 'Arial', size: 32, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: `Dokumen ini telah disahkan dan disetujui untuk digunakan pada ${semesterLabel}, Tahun Ajaran ${tahunAjaran}.`, font: settings.bodyFont || 'Times New Roman', size: 24 })],
    }),
    new Paragraph({ spacing: { before: 800 } }),
    // Two-column signature layout using tabs
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: `${lokasi}, ........................ ${new Date().getFullYear()}`, font: settings.bodyFont || 'Times New Roman', size: 22 }),
      ],
    }),
    new Paragraph({ spacing: { before: 400 } }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: 'Guru Mata Pelajaran,', font: settings.bodyFont || 'Times New Roman', size: 22 }),
        new TextRun({ text: '\t\t\t\t\tMengetahui,', font: settings.bodyFont || 'Times New Roman', size: 22 }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: '', font: settings.bodyFont || 'Times New Roman', size: 22 }),
        new TextRun({ text: '\t\t\t\t\tKepala Sekolah', font: settings.bodyFont || 'Times New Roman', size: 22 }),
      ],
    }),
    new Paragraph({ spacing: { before: 1200 } }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: p.namaGuru || '........................................', font: settings.bodyFont || 'Times New Roman', size: 22, bold: true, underline: {} }),
        new TextRun({ text: '\t\t\t\t\t', font: settings.bodyFont || 'Times New Roman', size: 22 }),
        new TextRun({ text: p.namaKepalaSekolah || '........................................', font: settings.bodyFont || 'Times New Roman', size: 22, bold: true, underline: {} }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: p.nip ? `NIP. ${p.nip}` : 'NIP. ........................', font: settings.bodyFont || 'Times New Roman', size: 20, color: '555555' }),
        new TextRun({ text: '\t\t\t\t\t', font: settings.bodyFont || 'Times New Roman', size: 22 }),
        new TextRun({ text: p.nipKepalaSekolah ? `NIP. ${p.nipKepalaSekolah}` : 'NIP. ........................', font: settings.bodyFont || 'Times New Roman', size: 20, color: '555555' }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

/**
 * Build and download the Word document
 */
export async function buildAndDownload(book, outline, content, exportSettings, profile) {
  const settings = exportSettings || {
    bodyFont: 'Times New Roman',
    headingFont: 'Arial',
    bodySize: 12,
    headingSize: 14,
    spacing: 1.5,
    includeCover: true,
    includeToc: true,
    includePageNumbers: true,
    includeHeaders: true,
  };
  
  const p = profile || {};
  const sections = [];

  // Header/Footer for content pages
  const headerText = p.namaSekolah || 'Perangkat Guru AI';
  const docHeader = settings.includeHeaders ? {
    default: new Header({
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: headerText, font: settings.bodyFont || 'Times New Roman', size: 18, color: '999999', italics: true }),
          ],
        }),
      ],
    }),
  } : undefined;

  const docFooter = settings.includePageNumbers ? {
    default: new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ children: [PageNumber.CURRENT], font: settings.bodyFont || 'Times New Roman', size: 18, color: '999999' }),
            new TextRun({ text: ' / ', font: settings.bodyFont || 'Times New Roman', size: 18, color: '999999' }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: settings.bodyFont || 'Times New Roman', size: 18, color: '999999' }),
          ],
        }),
      ],
    }),
  } : undefined;

  // Page props for A4 size and formal margins
  const officialPageProps = {
    size: {
      width: convertMillimetersToTwip(210), // A4 width
      height: convertMillimetersToTwip(297) // A4 height
    },
    margin: {
      top: convertMillimetersToTwip(25), // 2.5cm
      right: convertMillimetersToTwip(25), // 2.5cm
      bottom: convertMillimetersToTwip(25), // 2.5cm
      left: convertMillimetersToTwip(30), // 3.0cm
    },
  };

  // ====== COVER PAGE SECTION ======
  if (settings.includeCover) {
    sections.push({
      properties: { page: officialPageProps },
      children: createCoverPage(book, settings, p),
    });

    // Pengesahan page (after cover)
    sections.push({
      properties: { page: officialPageProps },
      children: createPengesahanPage(book, settings, p),
    });
  }

  // ====== TABLE OF CONTENTS SECTION ======
  if (settings.includeToc) {
    const tocChildren = [
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: 'DAFTAR ISI',
            font: settings.headingFont || 'Arial',
            size: 32,
            bold: true,
          }),
        ],
      }),
    ];

    outline.chapters.forEach((ch, idx) => {
      tocChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [
            new TextRun({
              text: `Bagian ${idx + 1}: ${ch.title}`,
              font: settings.bodyFont || 'Times New Roman',
              size: (settings.bodySize || 12) * 2,
            }),
          ],
        })
      );
    });

    tocChildren.push(new Paragraph({ children: [new PageBreak()] }));

    sections.push({
      properties: { page: officialPageProps },
      children: tocChildren,
    });
  }

  // ====== CHAPTER SECTIONS ======
  outline.chapters.forEach((chapter, idx) => {
    const chapterContent = content[chapter.id]?.text || '';
    const chapterChildren = [];

    // Chapter title
    chapterChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 120 },
        children: [
          new TextRun({
            text: `BAGIAN ${idx + 1}: ${chapter.title.toUpperCase()}`,
            font: settings.headingFont || 'Arial',
            size: 28, // 14pt
            bold: true,
            color: '000000',
          }),
        ],
      })
    );

    // Chapter content paragraphs
    const contentParagraphs = parseContentToParagraphs(chapterContent, settings);
    chapterChildren.push(...contentParagraphs);

    // Section headers/footers
    const sectionProps = { page: officialPageProps };

    if (settings.includeHeaders && docHeader) {
      sectionProps.headers = docHeader;
    }

    if (settings.includePageNumbers && docFooter) {
      sectionProps.footers = docFooter;
    }

    sections.push({
      properties: sectionProps,
      children: chapterChildren,
    });
  });

  // ====== CREATE DOCUMENT ======
  const doc = new Document({
    creator: 'Admin Guru AI',
    title: getTitleStr(book),
    description: book.description || '',
    sections,
  });

  // ====== PACK & DOWNLOAD ======
  const blob = await Packer.toBlob(doc);
  
  // Improved file naming: [Mapel]_[Fase]_[DocType]_[Year].docx
  const sanitize = (str) => str.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 30);
  const year = new Date().getFullYear();
  const subjectPart = book.subject ? sanitize(book.subject) : '';
  const phasePart = book.classPhase ? sanitize(book.classPhase) : '';
  const docTypePart = getDocLabelStr(book);
  
  let filenameParts = [];
  if (subjectPart) filenameParts.push(subjectPart);
  if (phasePart) filenameParts.push(phasePart);
  filenameParts.push(docTypePart);
  if (book.modulAjarMode) {
    filenameParts.push(book.modulAjarMode === 'tahunan' ? '1Tahun' : '1Semester');
    filenameParts.push(`${book.totalPertemuan || 0}Pertemuan`);
  }
  filenameParts.push(year.toString());
  
  const filename = filenameParts.join('_') + '.docx';
  saveAs(blob, filename);

  return filename;
}
