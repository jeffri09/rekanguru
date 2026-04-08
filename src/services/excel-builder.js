// ============================================================
// Excel Builder — Generate crossword puzzle Excel files
// Layout: Landscape F4 — Grid kiri, Petunjuk kanan (1 halaman)
// ============================================================

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * Build and download crossword puzzle as Excel file
 * Sheet 1: Soal (grid kiri + petunjuk kanan) — landscape F4, 1 page
 * Sheet 2: Kunci Jawaban — separate page
 */
export async function buildCrosswordExcel(crosswordData) {
  const { grid, placedWords, rows, cols, title } = crosswordData;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Perangkat Guru AI';
  workbook.created = new Date();

  // Build number map
  const numberMap = new Map();
  for (const pw of placedWords) {
    const key = `${pw.row},${pw.col}`;
    if (!numberMap.has(key)) numberMap.set(key, pw.number);
  }

  const acrossWords = placedWords.filter(w => w.direction === 'across').sort((a, b) => a.number - b.number);
  const downWords = placedWords.filter(w => w.direction === 'down').sort((a, b) => a.number - b.number);

  // Layout constants
  const GRID_CELL_W = 4;      // nice readable cell width
  const GRID_CELL_H = 25;     // nice cell height
  const CLUE_COL_W = 42;      // wide column for clue text
  const GAP_COL_W = 2;        // gap between grid and clues
  const CLUE_START_COL = cols + 2; // clue column starts after grid + 1 gap col

  // ============================================================
  // SHEET 1: SOAL TTS — Landscape, grid left + clues right
  // ============================================================
  const sheetSoal = workbook.addWorksheet('Soal TTS', {
    pageSetup: {
      paperSize: 41,           // F4 paper
      orientation: 'landscape', // landscape for wide layout
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      margins: { left: 0.4, right: 0.4, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 },
    },
    properties: { defaultRowHeight: 18 },
  });

  // Set column widths
  for (let c = 1; c <= cols; c++) {
    sheetSoal.getColumn(c).width = GRID_CELL_W;
  }
  sheetSoal.getColumn(cols + 1).width = GAP_COL_W; // gap
  sheetSoal.getColumn(CLUE_START_COL).width = 4;    // number column
  sheetSoal.getColumn(CLUE_START_COL + 1).width = CLUE_COL_W; // clue text

  // --- ROW 1: TITLE (spans everything) ---
  const totalSpan = CLUE_START_COL + 1;
  sheetSoal.mergeCells(1, 1, 1, totalSpan);
  const titleCell = sheetSoal.getCell(1, 1);
  titleCell.value = title || 'Teka-Teki Silang';
  titleCell.font = { bold: true, size: 16, name: 'Arial' };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheetSoal.getRow(1).height = 32;

  // --- ROW 2: Subtitle ---
  sheetSoal.mergeCells(2, 1, 2, totalSpan);
  const subCell = sheetSoal.getCell(2, 1);
  subCell.value = 'Isilah kotak-kotak sesuai petunjuk Mendatar dan Menurun!';
  subCell.font = { italic: true, size: 9, name: 'Arial', color: { argb: '666666' } };
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheetSoal.getRow(2).height = 18;

  // --- GRID (starts row 4, left side) ---
  const gridStartRow = 4;

  for (let r = 0; r < rows; r++) {
    const excelRow = gridStartRow + r;
    sheetSoal.getRow(excelRow).height = GRID_CELL_H;

    for (let c = 0; c < cols; c++) {
      const cell = sheetSoal.getCell(excelRow, c + 1);

      if (grid[r][c] !== '') {
        const num = numberMap.get(`${r},${c}`);
        cell.value = num || '';
        cell.font = { size: num ? 7 : 11, name: 'Arial', color: { argb: num ? 'FF888888' : '000000' } };
        cell.alignment = { horizontal: num ? 'left' : 'center', vertical: num ? 'top' : 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };
      } else {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1a1a2e' } };
      }
    }
  }

  // --- CLUES (right side, starting at same row as grid) ---
  let clueRow = gridStartRow;
  const numCol = CLUE_START_COL;
  const textCol = CLUE_START_COL + 1;

  // MENDATAR header
  sheetSoal.mergeCells(clueRow, numCol, clueRow, textCol);
  const mHeader = sheetSoal.getCell(clueRow, numCol);
  mHeader.value = '➡️ MENDATAR';
  mHeader.font = { bold: true, size: 11, name: 'Arial', color: { argb: '1565C0' } };
  mHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E3F2FD' } };
  mHeader.alignment = { vertical: 'middle' };
  sheetSoal.getRow(clueRow).height = Math.max(sheetSoal.getRow(clueRow).height || 0, 22);
  clueRow++;

  for (const w of acrossWords) {
    const nCell = sheetSoal.getCell(clueRow, numCol);
    nCell.value = w.number + '.';
    nCell.font = { bold: true, size: 10, name: 'Arial' };
    nCell.alignment = { horizontal: 'right', vertical: 'top' };

    const tCell = sheetSoal.getCell(clueRow, textCol);
    tCell.value = `${w.clue} (${w.word.length} huruf)`;
    tCell.font = { size: 10, name: 'Arial' };
    tCell.alignment = { wrapText: true, vertical: 'top' };

    if (!sheetSoal.getRow(clueRow).height || sheetSoal.getRow(clueRow).height < 18) {
      sheetSoal.getRow(clueRow).height = 18;
    }
    clueRow++;
  }

  clueRow++; // spacing

  // MENURUN header
  sheetSoal.mergeCells(clueRow, numCol, clueRow, textCol);
  const dHeaderCell = sheetSoal.getCell(clueRow, numCol);
  dHeaderCell.value = '⬇️ MENURUN';
  dHeaderCell.font = { bold: true, size: 11, name: 'Arial', color: { argb: '2E7D32' } };
  dHeaderCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8F5E9' } };
  dHeaderCell.alignment = { vertical: 'middle' };
  sheetSoal.getRow(clueRow).height = Math.max(sheetSoal.getRow(clueRow).height || 0, 22);
  clueRow++;

  for (const w of downWords) {
    const nCell = sheetSoal.getCell(clueRow, numCol);
    nCell.value = w.number + '.';
    nCell.font = { bold: true, size: 10, name: 'Arial' };
    nCell.alignment = { horizontal: 'right', vertical: 'top' };

    const tCell = sheetSoal.getCell(clueRow, textCol);
    tCell.value = `${w.clue} (${w.word.length} huruf)`;
    tCell.font = { size: 10, name: 'Arial' };
    tCell.alignment = { wrapText: true, vertical: 'top' };

    if (!sheetSoal.getRow(clueRow).height || sheetSoal.getRow(clueRow).height < 18) {
      sheetSoal.getRow(clueRow).height = 18;
    }
    clueRow++;
  }

  // Footer at bottom
  const footerRow = Math.max(gridStartRow + rows + 1, clueRow + 1);
  sheetSoal.mergeCells(footerRow, 1, footerRow, totalSpan);
  const footerCell = sheetSoal.getCell(footerRow, 1);
  footerCell.value = `Dibuat dengan Perangkat Guru AI — ${placedWords.length} soal`;
  footerCell.font = { size: 8, name: 'Arial', italic: true, color: { argb: '999999' } };
  footerCell.alignment = { horizontal: 'center' };

  // ============================================================
  // SHEET 2: KUNCI JAWABAN (Separate page, landscape too)
  // ============================================================
  const sheetJawaban = workbook.addWorksheet('Kunci Jawaban', {
    pageSetup: {
      paperSize: 41,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      margins: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
    },
    properties: { defaultRowHeight: 18 },
  });

  for (let c = 1; c <= cols; c++) {
    sheetJawaban.getColumn(c).width = GRID_CELL_W;
  }
  sheetJawaban.getColumn(cols + 1).width = GAP_COL_W;
  sheetJawaban.getColumn(CLUE_START_COL).width = 4;
  sheetJawaban.getColumn(CLUE_START_COL + 1).width = CLUE_COL_W;

  // Title
  sheetJawaban.mergeCells(1, 1, 1, totalSpan);
  const jTitle = sheetJawaban.getCell(1, 1);
  jTitle.value = '🔑 KUNCI JAWABAN — ' + (title || 'Teka-Teki Silang');
  jTitle.font = { bold: true, size: 16, name: 'Arial', color: { argb: 'CC0000' } };
  jTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  sheetJawaban.getRow(1).height = 32;

  // Answer grid (filled, same position as soal)
  const answerGridStart = 3;
  for (let r = 0; r < rows; r++) {
    const excelRow = answerGridStart + r;
    sheetJawaban.getRow(excelRow).height = GRID_CELL_H;

    for (let c = 0; c < cols; c++) {
      const cell = sheetJawaban.getCell(excelRow, c + 1);

      if (grid[r][c] !== '') {
        cell.value = grid[r][c];
        cell.font = { bold: true, size: 12, name: 'Arial' };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8F5E9' } };
      } else {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1a1a2e' } };
      }
    }
  }

  // Answer list on the right side (same as clue position)
  let aRow = answerGridStart;

  sheetJawaban.mergeCells(aRow, numCol, aRow, textCol);
  const alMendatar = sheetJawaban.getCell(aRow, numCol);
  alMendatar.value = '➡️ MENDATAR';
  alMendatar.font = { bold: true, size: 11, name: 'Arial', color: { argb: '1565C0' } };
  alMendatar.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E3F2FD' } };
  aRow++;

  for (const w of acrossWords) {
    const nCell = sheetJawaban.getCell(aRow, numCol);
    nCell.value = w.number + '.';
    nCell.font = { bold: true, size: 10, name: 'Arial' };
    nCell.alignment = { horizontal: 'right' };

    const tCell = sheetJawaban.getCell(aRow, textCol);
    tCell.value = w.word;
    tCell.font = { bold: true, size: 10, name: 'Arial', color: { argb: '1565C0' } };
    aRow++;
  }

  aRow++;

  sheetJawaban.mergeCells(aRow, numCol, aRow, textCol);
  const alMenurun = sheetJawaban.getCell(aRow, numCol);
  alMenurun.value = '⬇️ MENURUN';
  alMenurun.font = { bold: true, size: 11, name: 'Arial', color: { argb: '2E7D32' } };
  alMenurun.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8F5E9' } };
  aRow++;

  for (const w of downWords) {
    const nCell = sheetJawaban.getCell(aRow, numCol);
    nCell.value = w.number + '.';
    nCell.font = { bold: true, size: 10, name: 'Arial' };
    nCell.alignment = { horizontal: 'right' };

    const tCell = sheetJawaban.getCell(aRow, textCol);
    tCell.value = w.word;
    tCell.font = { bold: true, size: 10, name: 'Arial', color: { argb: '2E7D32' } };
    aRow++;
  }

  // ====== GENERATE & DOWNLOAD ======
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const filename = `TTS_${(title || 'Puzzle').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.xlsx`;
  saveAs(blob, filename);

  return filename;
}
