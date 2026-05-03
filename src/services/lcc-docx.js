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

export async function buildLccDocx(resultsArray, config) {
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

  // Render each subject's result
  resultsArray.forEach((result, index) => {
    if (index > 0) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: `MATA PELAJARAN: ${result.subject.toUpperCase()}`,
          font: 'Arial',
          size: 28,
          bold: true,
        }),
      ],
    }));

    (result.teams || []).forEach(team => {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: team.team_name,
            font: 'Arial',
            size: 24,
            bold: true,
          }),
        ],
      }));

      (team.questions || []).forEach(q => {
        children.push(new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({ text: `${q.number}. `, font: 'Times New Roman', size: 24, bold: true }),
            new TextRun({ text: q.question, font: 'Times New Roman', size: 24 }),
          ],
        }));
        children.push(new Paragraph({
          spacing: { before: 40, after: 80 },
          indent: { left: 400 },
          children: [
            new TextRun({ text: `Kunci Jawaban: ${q.answer}`, font: 'Times New Roman', size: 22, bold: true, italics: true }),
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
