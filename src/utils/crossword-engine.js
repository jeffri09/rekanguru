// ============================================================
// Crossword Engine — Grid generation algorithm
// Supports Latin (A-Z), Arabic, and Arabic with harakat
// ============================================================

// Harakat unicode range
const HARAKAT_RE = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g;

/**
 * Clean a word: keep only base letters (Latin or Arabic), uppercase Latin.
 * Harakat are stripped so each grid cell = 1 base letter.
 */
function cleanWord(w) {
  let cleaned = w.replace(/[\s\d.,!?\-_'"()\[\]{}؟،؛]/g, '');
  cleaned = cleaned.replace(HARAKAT_RE, '');
  cleaned = cleaned.replace(/[^A-Za-z\u0621-\u064A\u0671-\u06D3]/g, '');
  return cleaned.toUpperCase();
}

/**
 * Split a word (possibly with harakat) into display characters.
 * Each base letter + its trailing harakat = 1 display unit.
 * Used for preview/Excel to show harakat correctly in cells.
 */
export function splitDisplayChars(originalWord) {
  const chars = [];
  let current = '';
  for (const ch of originalWord) {
    if (HARAKAT_RE.test(ch)) {
      current += ch; // attach harakat to current base letter
    } else {
      if (current) chars.push(current);
      current = ch;
    }
  }
  if (current) chars.push(current);
  return chars;
}

/**
 * Generate a crossword grid from a list of words.
 * @param {Array<{word: string, clue: string}>} wordList
 * @returns {{ grid: string[][], placedWords: Array, size: number }}
 */
export function generateCrosswordGrid(wordList) {
  if (!wordList || wordList.length === 0) return null;

  // Clean and sort words (longest first for better placement)
  const words = wordList
    .map(w => ({
      ...w,
      word: cleanWord(w.word),
    }))
    .filter(w => w.word.length >= 2)
    .sort((a, b) => b.word.length - a.word.length);

  if (words.length === 0) return null;

  const maxSize = 30;
  const grid = Array.from({ length: maxSize }, () => Array(maxSize).fill(''));
  const placedWords = [];

  // Place the first word horizontally in the center
  const firstWord = words[0];
  const startRow = Math.floor(maxSize / 2);
  const startCol = Math.floor((maxSize - firstWord.word.length) / 2);

  for (let i = 0; i < firstWord.word.length; i++) {
    grid[startRow][startCol + i] = firstWord.word[i];
  }

  placedWords.push({
    ...firstWord,
    row: startRow,
    col: startCol,
    direction: 'across', // mendatar
    number: 0,
  });

  // Try to place remaining words
  for (let w = 1; w < words.length; w++) {
    const wordObj = words[w];
    const placed = tryPlaceWord(grid, placedWords, wordObj, maxSize);
    if (placed) {
      placedWords.push(placed);
    }
  }

  // Trim grid to bounding box
  const trimmed = trimGrid(grid, maxSize);

  // Assign numbers
  assignNumbers(trimmed.placedWords);

  return {
    grid: trimmed.grid,
    placedWords: trimmed.placedWords,
    rows: trimmed.rows,
    cols: trimmed.cols,
  };
}

/**
 * Try to place a word on the grid by finding intersections
 */
function tryPlaceWord(grid, placedWords, wordObj, maxSize) {
  const word = wordObj.word;
  let bestPlacement = null;
  let bestScore = -1;

  // For each placed word, find common characters
  for (const placed of placedWords) {
    for (let pi = 0; pi < placed.word.length; pi++) {
      for (let wi = 0; wi < word.length; wi++) {
        if (placed.word[pi] !== word[wi]) continue;

        // Calculate position based on perpendicular direction
        let row, col, direction;

        if (placed.direction === 'across') {
          // Place new word going down
          direction = 'down';
          row = placed.row - wi;
          col = placed.col + pi;
        } else {
          // Place new word going across
          direction = 'across';
          row = placed.row + pi;
          col = placed.col - wi;
        }

        // Check if placement is valid
        if (isValidPlacement(grid, word, row, col, direction, maxSize)) {
          // Score: prefer center, more intersections = better
          const centerDist = Math.abs(row - maxSize / 2) + Math.abs(col - maxSize / 2);
          const intersections = countIntersections(grid, word, row, col, direction, maxSize);
          const score = intersections * 10 - centerDist;

          if (score > bestScore) {
            bestScore = score;
            bestPlacement = { ...wordObj, row, col, direction, number: 0 };
          }
        }
      }
    }
  }

  // Place the word on the grid
  if (bestPlacement) {
    const { word: w, row, col, direction } = bestPlacement;
    for (let i = 0; i < w.length; i++) {
      if (direction === 'across') {
        grid[row][col + i] = w[i];
      } else {
        grid[row + i][col] = w[i];
      }
    }
  }

  return bestPlacement;
}

/**
 * Check if a word can be placed at a position
 */
function isValidPlacement(grid, word, row, col, direction, maxSize) {
  const dr = direction === 'down' ? 1 : 0;
  const dc = direction === 'across' ? 1 : 0;

  // Check bounds
  const endRow = row + dr * (word.length - 1);
  const endCol = col + dc * (word.length - 1);
  if (row < 0 || col < 0 || endRow >= maxSize || endCol >= maxSize) return false;

  // Check cell before start (should be empty)
  const beforeRow = row - dr;
  const beforeCol = col - dc;
  if (beforeRow >= 0 && beforeCol >= 0 && grid[beforeRow][beforeCol] !== '') return false;

  // Check cell after end (should be empty)
  const afterRow = row + dr * word.length;
  const afterCol = col + dc * word.length;
  if (afterRow < maxSize && afterCol < maxSize && grid[afterRow][afterCol] !== '') return false;

  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    const cell = grid[r][c];

    if (cell === '') {
      // Cell is empty — check adjacent cells (perpendicular neighbors should be empty)
      if (direction === 'across') {
        if (r > 0 && grid[r - 1][c] !== '') return false;
        if (r < maxSize - 1 && grid[r + 1][c] !== '') return false;
      } else {
        if (c > 0 && grid[r][c - 1] !== '') return false;
        if (c < maxSize - 1 && grid[r][c + 1] !== '') return false;
      }
    } else if (cell === word[i]) {
      // Intersection — this is fine
      continue;
    } else {
      // Conflict
      return false;
    }
  }

  return true;
}

/**
 * Count intersections for scoring
 */
function countIntersections(grid, word, row, col, direction, maxSize) {
  const dr = direction === 'down' ? 1 : 0;
  const dc = direction === 'across' ? 1 : 0;
  let count = 0;

  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (grid[r][c] === word[i]) count++;
  }

  return count;
}

/**
 * Trim grid to the minimum bounding box
 */
function trimGrid(grid, maxSize) {
  let minRow = maxSize, maxRow = 0, minCol = maxSize, maxCol = 0;

  for (let r = 0; r < maxSize; r++) {
    for (let c = 0; c < maxSize; c++) {
      if (grid[r][c] !== '') {
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
      }
    }
  }

  // Add 1 cell padding
  minRow = Math.max(0, minRow - 1);
  minCol = Math.max(0, minCol - 1);
  maxRow = Math.min(maxSize - 1, maxRow + 1);
  maxCol = Math.min(maxSize - 1, maxCol + 1);

  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;
  const trimmedGrid = [];

  for (let r = 0; r < rows; r++) {
    trimmedGrid[r] = [];
    for (let c = 0; c < cols; c++) {
      trimmedGrid[r][c] = grid[minRow + r][minCol + c];
    }
  }

  // Adjust placed word positions (done externally)
  return {
    grid: trimmedGrid,
    rows,
    cols,
    offsetRow: minRow,
    offsetCol: minCol,
    // We'll adjust placedWords outside
    get placedWords() { return []; }, // placeholder
  };
}

/**
 * Full pipeline: generate grid + adjust coordinates + assign numbers
 */
export function buildCrossword(wordList) {
  if (!wordList || wordList.length === 0) return null;

  const words = wordList
    .map(w => ({
      ...w,
      originalWord: w.word, // keep original (may have harakat)
      word: cleanWord(w.word),
    }))
    .filter(w => w.word.length >= 2)
    .sort((a, b) => b.word.length - a.word.length);

  if (words.length === 0) return null;

  const maxSize = 30;
  const grid = Array.from({ length: maxSize }, () => Array(maxSize).fill(''));
  const placedWords = [];

  // Place first word
  const firstWord = words[0];
  const startRow = Math.floor(maxSize / 2);
  const startCol = Math.floor((maxSize - firstWord.word.length) / 2);

  for (let i = 0; i < firstWord.word.length; i++) {
    grid[startRow][startCol + i] = firstWord.word[i];
  }
  placedWords.push({ ...firstWord, row: startRow, col: startCol, direction: 'across', number: 0 });

  // Place remaining
  for (let w = 1; w < words.length; w++) {
    const placed = tryPlaceWord(grid, placedWords, words[w], maxSize);
    if (placed) placedWords.push(placed);
  }

  // Find bounding box
  let minRow = maxSize, maxRow = 0, minCol = maxSize, maxCol = 0;
  for (let r = 0; r < maxSize; r++) {
    for (let c = 0; c < maxSize; c++) {
      if (grid[r][c] !== '') {
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
      }
    }
  }

  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;

  // Build trimmed grid
  const trimmedGrid = [];
  for (let r = 0; r < rows; r++) {
    trimmedGrid[r] = [];
    for (let c = 0; c < cols; c++) {
      trimmedGrid[r][c] = grid[minRow + r][minCol + c];
    }
  }

  // Adjust placed word coordinates
  for (const pw of placedWords) {
    pw.row -= minRow;
    pw.col -= minCol;
  }

  // Assign numbers
  assignNumbers(placedWords);

  return {
    grid: trimmedGrid,
    placedWords,
    rows,
    cols,
    totalPlaced: placedWords.length,
    totalAttempted: words.length,
  };
}

/**
 * Assign sequential numbers to word starting positions
 */
function assignNumbers(placedWords) {
  // Collect unique start positions, sort by row then col
  const starts = new Map();
  for (const pw of placedWords) {
    const key = `${pw.row},${pw.col}`;
    if (!starts.has(key)) {
      starts.set(key, { row: pw.row, col: pw.col });
    }
  }

  const sortedStarts = Array.from(starts.values()).sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });

  const numberMap = new Map();
  sortedStarts.forEach((s, idx) => {
    numberMap.set(`${s.row},${s.col}`, idx + 1);
  });

  for (const pw of placedWords) {
    pw.number = numberMap.get(`${pw.row},${pw.col}`) || 0;
  }
}
