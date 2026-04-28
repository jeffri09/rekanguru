// ============================================================
// Crossword Engine — Grid generation algorithm (v2)
// Supports Latin (A-Z), Arabic, and Arabic with harakat
// Features: multi-attempt retry, dynamic grid, improved scoring
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
 * Full pipeline: generate crossword grid with multi-attempt optimization.
 * Tries multiple word orderings and picks the best result.
 *
 * @param {Array<{word: string, clue: string}>} wordList
 * @returns {{ grid: string[][], placedWords: Array, rows: number, cols: number, totalPlaced: number, totalAttempted: number }}
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

  // Dynamic grid size based on word count and total letters
  const totalLetters = words.reduce((sum, w) => sum + w.word.length, 0);
  const maxSize = Math.min(50, Math.max(20, Math.ceil(Math.sqrt(totalLetters * 3)) + 5));

  // Multi-attempt: try several orderings, keep the best result
  const ATTEMPTS = Math.min(8, Math.max(3, words.length));
  let bestResult = null;
  let bestScore = -1;

  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const orderedWords = attempt === 0
      ? [...words] // first attempt: longest-first (default)
      : shuffleWithLongestFirst(words, attempt);

    const result = attemptBuild(orderedWords, maxSize);
    if (!result) continue;

    // Score: placed count (primary) + density (secondary) + balance (tertiary)
    const density = result.totalPlaced / (result.rows * result.cols + 1);
    const acrossCount = result.placedWords.filter(w => w.direction === 'across').length;
    const downCount = result.placedWords.filter(w => w.direction === 'down').length;
    const balance = 1 - Math.abs(acrossCount - downCount) / (result.totalPlaced + 1);
    const score = result.totalPlaced * 100 + density * 50 + balance * 30;

    if (score > bestScore) {
      bestScore = score;
      bestResult = result;
    }

    // If all words placed, no need to try more
    if (result.totalPlaced === words.length) break;
  }

  if (!bestResult) return null;

  bestResult.totalAttempted = words.length;
  return bestResult;
}

/**
 * Shuffle words with longest-first bias but randomized after top words.
 */
function shuffleWithLongestFirst(words, seed) {
  const sorted = [...words];

  // Keep top 2 longest words in place, shuffle the rest
  const head = sorted.slice(0, 2);
  const tail = sorted.slice(2);

  // Simple deterministic shuffle based on seed
  for (let i = tail.length - 1; i > 0; i--) {
    const j = (seed * 31 + i * 17) % (i + 1);
    [tail[i], tail[j]] = [tail[j], tail[i]];
  }

  return [...head, ...tail];
}

/**
 * Single attempt to build a crossword grid.
 */
function attemptBuild(words, maxSize) {
  const grid = Array.from({ length: maxSize }, () => Array(maxSize).fill(''));
  const placedWords = [];

  // Place first word horizontally in the center
  const firstWord = words[0];
  const startRow = Math.floor(maxSize / 2);
  const startCol = Math.floor((maxSize - firstWord.word.length) / 2);

  for (let i = 0; i < firstWord.word.length; i++) {
    grid[startRow][startCol + i] = firstWord.word[i];
  }
  placedWords.push({ ...firstWord, row: startRow, col: startCol, direction: 'across', number: 0 });

  // Try to place remaining words (with retry for failed words)
  const failed = [];
  for (let w = 1; w < words.length; w++) {
    const placed = tryPlaceWord(grid, placedWords, words[w], maxSize);
    if (placed) {
      placedWords.push(placed);
    } else {
      failed.push(words[w]);
    }
  }

  // Retry failed words (they may fit now that more words are on the grid)
  for (const wordObj of failed) {
    const placed = tryPlaceWord(grid, placedWords, wordObj, maxSize);
    if (placed) placedWords.push(placed);
  }

  if (placedWords.length < 2) return null;

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
  };
}

/**
 * Try to place a word on the grid by finding intersections
 */
function tryPlaceWord(grid, placedWords, wordObj, maxSize) {
  const word = wordObj.word;
  const candidates = [];

  // For each placed word, find common characters
  for (const placed of placedWords) {
    for (let pi = 0; pi < placed.word.length; pi++) {
      for (let wi = 0; wi < word.length; wi++) {
        if (placed.word[pi] !== word[wi]) continue;

        // Calculate position based on perpendicular direction
        let row, col, direction;

        if (placed.direction === 'across') {
          direction = 'down';
          row = placed.row - wi;
          col = placed.col + pi;
        } else {
          direction = 'across';
          row = placed.row + pi;
          col = placed.col - wi;
        }

        // Check if placement is valid
        if (isValidPlacement(grid, word, row, col, direction, maxSize)) {
          const intersections = countIntersections(grid, word, row, col, direction, maxSize);
          const centerDist = Math.abs(row - maxSize / 2) + Math.abs(col - maxSize / 2);
          const score = intersections * 15 - centerDist;

          candidates.push({ ...wordObj, row, col, direction, number: 0, score });
        }
      }
    }
  }

  if (candidates.length === 0) return null;

  // Pick best candidate
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  // Place on grid
  const dr = best.direction === 'down' ? 1 : 0;
  const dc = best.direction === 'across' ? 1 : 0;
  for (let i = 0; i < best.word.length; i++) {
    grid[best.row + dr * i][best.col + dc * i] = best.word[i];
  }

  delete best.score; // clean up
  return best;
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
