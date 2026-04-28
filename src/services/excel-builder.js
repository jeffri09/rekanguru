// ============================================================
// Excel Builder — Generate crossword puzzle Excel files (v2)
// Layout: Landscape F4 — Grid kiri, Petunjuk kanan (1 halaman)
// Fixes: harakat rendering, Arabic filename, 3 sheets
// Added: Sheet Petunjuk terpisah, branding kustom
// ============================================================

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { splitDisplayChars } from '../utils/crossword-engine.js';

/**
 * Get the display character for a grid cell, using originalWord if available (harakat support).
 */
function getDisplayCharForCell(placedWords, row, col, gridChar) {
  for (const pw of placedWords) {
    const dr = pw.direction === 'down' ? 1 : 0;
    const dc = pw.direction === 'across' ? 1 : 0;

    for (let i = 0; i < pw.word.length; i++) {
      const wr = pw.row + dr * i;
      const wc = pw.col + dc * i;
      if (wr === row && wc === col) {
        if (pw.originalWord) {
          const displayChars = splitDisplayChars(pw.originalWord);
          if (i < displayChars.length) {
            return displayChars[i];
          }
        }
        return gridChar;
      }
    }
  }
  return gridChar;
}

/**
 * Build and download crossword puzzle as Excel file
 * Sheet 1: Soal (grid kiri + petunjuk kanan) — landscape F4, 1 page
 * Sheet 2: Kunci Jawaban — separate page
 * Sheet 3: Daftar Petunjuk — clean list of all clues
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

  // Answer grid (filled, same position as soal) — with harakat support
  const answerGridStart = 3;
  for (let r = 0; r < rows; r++) {
    const excelRow = answerGridStart + r;
    sheetJawaban.getRow(excelRow).height = GRID_CELL_H;

    for (let c = 0; c < cols; c++) {
      const cell = sheetJawaban.getCell(excelRow, c + 1);

      if (grid[r][c] !== '') {
        // Use display char with harakat if available
        const displayChar = getDisplayCharForCell(placedWords, r, c, grid[r][c]);
        cell.value = displayChar;
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
    tCell.value = w.originalWord || w.word;
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
    tCell.value = w.originalWord || w.word;
    tCell.font = { bold: true, size: 10, name: 'Arial', color: { argb: '2E7D32' } };
    aRow++;
  }

  // ============================================================
  // SHEET 3: DAFTAR PETUNJUK (Clean printable clue list)
  // ============================================================
  const sheetPetunjuk = workbook.addWorksheet('Daftar Petunjuk', {
    pageSetup: {
      paperSize: 41,
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      margins: { left: 0.6, right: 0.6, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 },
    },
    properties: { defaultRowHeight: 20 },
  });

  // Set column widths
  sheetPetunjuk.getColumn(1).width = 6;   // No.
  sheetPetunjuk.getColumn(2).width = 10;  // Arah
  sheetPetunjuk.getColumn(3).width = 50;  // Petunjuk
  sheetPetunjuk.getColumn(4).width = 10;  // Jumlah Huruf

  // Title
  sheetPetunjuk.mergeCells(1, 1, 1, 4);
  const pTitle = sheetPetunjuk.getCell(1, 1);
  pTitle.value = '📋 DAFTAR PETUNJUK — ' + (title || 'Teka-Teki Silang');
  pTitle.font = { bold: true, size: 14, name: 'Arial' };
  pTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  sheetPetunjuk.getRow(1).height = 30;

  // Subtitle
  sheetPetunjuk.mergeCells(2, 1, 2, 4);
  const pSub = sheetPetunjuk.getCell(2, 1);
  pSub.value = 'Gunakan petunjuk di bawah untuk mengisi TTS di Sheet "Soal TTS"';
  pSub.font = { italic: true, size: 9, name: 'Arial', color: { argb: '666666' } };
  pSub.alignment = { horizontal: 'center', vertical: 'middle' };

  // Header row
  const headerRow = 4;
  const headers = ['No.', 'Arah', 'Petunjuk', 'Huruf'];
  const headerColors = ['F5F5F5', 'F5F5F5', 'F5F5F5', 'F5F5F5'];
  headers.forEach((h, idx) => {
    const cell = sheetPetunjuk.getCell(headerRow, idx + 1);
    cell.value = h;
    cell.font = { bold: true, size: 10, name: 'Arial', color: { argb: '333333' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerColors[idx] } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      bottom: { style: 'medium', color: { argb: '333333' } },
    };
  });
  sheetPetunjuk.getRow(headerRow).height = 24;

  // Mendatar section
  let pRow = headerRow + 1;

  // Section header: Mendatar
  sheetPetunjuk.mergeCells(pRow, 1, pRow, 4);
  const mendatarHeader = sheetPetunjuk.getCell(pRow, 1);
  mendatarHeader.value = '➡️ MENDATAR';
  mendatarHeader.font = { bold: true, size: 11, name: 'Arial', color: { argb: '1565C0' } };
  mendatarHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E3F2FD' } };
  mendatarHeader.alignment = { vertical: 'middle' };
  sheetPetunjuk.getRow(pRow).height = 24;
  pRow++;

  for (const w of acrossWords) {
    const noCell = sheetPetunjuk.getCell(pRow, 1);
    noCell.value = w.number;
    noCell.font = { bold: true, size: 10, name: 'Arial' };
    noCell.alignment = { horizontal: 'center', vertical: 'top' };

    const arCell = sheetPetunjuk.getCell(pRow, 2);
    arCell.value = 'Mendatar';
    arCell.font = { size: 9, name: 'Arial', color: { argb: '1565C0' } };
    arCell.alignment = { horizontal: 'center', vertical: 'top' };

    const clCell = sheetPetunjuk.getCell(pRow, 3);
    clCell.value = w.clue;
    clCell.font = { size: 10, name: 'Arial' };
    clCell.alignment = { wrapText: true, vertical: 'top' };

    const hlCell = sheetPetunjuk.getCell(pRow, 4);
    hlCell.value = w.word.length;
    hlCell.font = { size: 10, name: 'Arial', color: { argb: '666666' } };
    hlCell.alignment = { horizontal: 'center', vertical: 'top' };

    // Light border bottom
    for (let c = 1; c <= 4; c++) {
      sheetPetunjuk.getCell(pRow, c).border = {
        bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
      };
    }

    pRow++;
  }

  // Section header: Menurun
  pRow++;
  sheetPetunjuk.mergeCells(pRow, 1, pRow, 4);
  const menurunHeader = sheetPetunjuk.getCell(pRow, 1);
  menurunHeader.value = '⬇️ MENURUN';
  menurunHeader.font = { bold: true, size: 11, name: 'Arial', color: { argb: '2E7D32' } };
  menurunHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8F5E9' } };
  menurunHeader.alignment = { vertical: 'middle' };
  sheetPetunjuk.getRow(pRow).height = 24;
  pRow++;

  for (const w of downWords) {
    const noCell = sheetPetunjuk.getCell(pRow, 1);
    noCell.value = w.number;
    noCell.font = { bold: true, size: 10, name: 'Arial' };
    noCell.alignment = { horizontal: 'center', vertical: 'top' };

    const arCell = sheetPetunjuk.getCell(pRow, 2);
    arCell.value = 'Menurun';
    arCell.font = { size: 9, name: 'Arial', color: { argb: '2E7D32' } };
    arCell.alignment = { horizontal: 'center', vertical: 'top' };

    const clCell = sheetPetunjuk.getCell(pRow, 3);
    clCell.value = w.clue;
    clCell.font = { size: 10, name: 'Arial' };
    clCell.alignment = { wrapText: true, vertical: 'top' };

    const hlCell = sheetPetunjuk.getCell(pRow, 4);
    hlCell.value = w.word.length;
    hlCell.font = { size: 10, name: 'Arial', color: { argb: '666666' } };
    hlCell.alignment = { horizontal: 'center', vertical: 'top' };

    for (let c = 1; c <= 4; c++) {
      sheetPetunjuk.getCell(pRow, c).border = {
        bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
      };
    }

    pRow++;
  }

  // Footer
  pRow += 2;
  sheetPetunjuk.mergeCells(pRow, 1, pRow, 4);
  const pFooter = sheetPetunjuk.getCell(pRow, 1);
  pFooter.value = `Dibuat dengan Perangkat Guru AI — ${placedWords.length} soal`;
  pFooter.font = { size: 8, name: 'Arial', italic: true, color: { argb: '999999' } };
  pFooter.alignment = { horizontal: 'center' };

  // ====== GENERATE & DOWNLOAD ======
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  // Safe filename: handle Arabic/non-Latin titles gracefully
  const safeTitle = (title || 'Puzzle')
    .replace(/[<>:"/\\|?*]/g, '')     // remove filesystem-unsafe chars
    .replace(/\s+/g, '_')              // spaces to underscores
    .substring(0, 60);                 // limit length
  const filename = `TTS_${safeTitle}.xlsx`;
  saveAs(blob, filename);

  return filename;
}
