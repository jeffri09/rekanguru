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
} from 'docx';
import { saveAs } from 'file-saver';

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

export async function buildLccDocx(groupedResults, config) {
  const children = [];

  // Title
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [
      new TextRun({ text: 'PAKET SOAL LOMBA CERDAS CERMAT (LCC)', font: 'Arial', size: 32, bold: true }),
    ],
  }));

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({ text: `Babak: ${config.phase.toUpperCase()}`, font: 'Arial', size: 26, bold: true }),
    ],
  }));

  // ============================================
  // BAGIAN 1: SOAL
  // ============================================
  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 200, after: 200 },
    children: [
      new TextRun({ text: 'BAGIAN 1: SOAL PER PESERTA', font: 'Arial', size: 28, bold: true }),
    ],
  }));

  groupedResults.forEach((peserta, index) => {
    if (index > 0) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: peserta.participant_name.toUpperCase(),
          font: 'Arial',
          size: 26,
          bold: true,
        }),
      ],
    }));

    (peserta.subjects || []).forEach(sub => {
      children.push(new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({
            text: `Mapel: ${sub.subject.toUpperCase()}`,
            font: 'Arial',
            size: 24,
            bold: true,
            underline: {},
          }),
        ],
      }));

      (sub.questions || []).forEach(q => {
        children.push(new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({ text: `${q.number}. `, font: 'Times New Roman', size: 24, bold: true }),
            new TextRun({ text: q.question, font: 'Times New Roman', size: 24 }),
          ],
        }));
      });
    });
  });

  // ============================================
  // BAGIAN 2: KUNCI JAWABAN
  // ============================================
  children.push(new Paragraph({ children: [new PageBreak()] }));

  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 200, after: 200 },
    children: [
      new TextRun({ text: 'BAGIAN 2: KUNCI JAWABAN', font: 'Arial', size: 28, bold: true }),
    ],
  }));

  groupedResults.forEach((peserta, index) => {
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: peserta.participant_name.toUpperCase(),
          font: 'Arial',
          size: 26,
          bold: true,
        }),
      ],
    }));

    (peserta.subjects || []).forEach(sub => {
      children.push(new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({
            text: `Mapel: ${sub.subject.toUpperCase()}`,
            font: 'Arial',
            size: 24,
            bold: true,
            underline: {},
          }),
        ],
      }));

      (sub.questions || []).forEach(q => {
        children.push(new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({ text: `${q.number}. `, font: 'Times New Roman', size: 24, bold: true }),
            new TextRun({ text: q.answer, font: 'Times New Roman', size: 24 }),
          ],
        }));
      });
    });
  });

  const doc = new Document({
    creator: 'Perangkat Guru AI',
    title: `Paket Soal LCC - Babak ${config.phase}`,
    description: `Paket soal Lomba Cerdas Cermat`,
    sections: [
      {
        properties: {
          page: pageProps,
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

  const blob = await Packer.toBlob(doc);
  const filename = `Soal_LCC_Babak_${config.phase}.docx`;
  saveAs(blob, filename);

  return filename;
}
