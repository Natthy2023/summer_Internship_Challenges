/**
 * Ethiopian (Ge'ez) Numeral Converter
 * 
 * Ge'ez numerals use a positional additive system with two special
 * multiplier characters: ፻ (100) and ፼ (10,000).
 * 
 * Rules:
 *  - Digits 1–9 map directly to Ge'ez characters.
 *  - Tens 10–90 have dedicated characters.
 *  - ፻ (100) acts as a multiplier: ፪፻ = 200, ፻ alone = 100.
 *  - ፼ (10,000) acts as a multiplier: ፪፼ = 20,000, ፼ alone = 10,000.
 *  - Numbers above 10,000 chunk into groups separated by ፼.
 *
 * Supported range: 1 – 99,999,999
 */

// ── Core Lookup Tables ─────────────────────────────────────────────────────

const ONES = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
const TENS = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];

// Complete character → value map (used in parsing)
const CHAR_VALUE = {
  '፩': 1,  '፪': 2,  '፫': 3,  '፬': 4,  '፭': 5,
  '፮': 6,  '፯': 7,  '፰': 8,  '፱': 9,
  '፲': 10, '፳': 20, '፴': 30, '፵': 40, '፶': 50,
  '፷': 60, '፸': 70, '፹': 80, '፺': 90,
  '፻': 100,
  '፼': 10000,
};

// ── Encode: Arabic → Ge'ez ────────────────────────────────────────────────

/**
 * Encodes a number 1–9999 into Ge'ez characters (no ፼ multiplier).
 * This handles one "chunk" (the part below 10,000).
 */
function encodeChunk(n) {
  if (n <= 0 || n > 9999) throw new RangeError(`encodeChunk: ${n} out of range`);

  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  const tensDigit = Math.floor(remainder / 10);
  const onesDigit = remainder % 10;

  let result = '';

  if (hundreds > 0) {
    // e.g. 2 → ፪, then ፻ for ×100; but 1 → just ፻ (not ፩፻)
    if (hundreds > 1) result += ONES[hundreds];
    result += '፻';
  }

  result += TENS[tensDigit];
  result += ONES[onesDigit];

  return result;
}

/**
 * Converts an Arabic integer (1–99,999,999) to a Ge'ez numeral string.
 * @param {number} n
 * @returns {string}
 */
export function arabicToEthiopian(n) {
  n = Math.floor(n);
  if (n < 1 || n > 99_999_999) {
    throw new RangeError('Input must be between 1 and 99,999,999');
  }

  const upper = Math.floor(n / 10000); // ten-thousands group
  const lower = n % 10000;             // units group (0–9999)

  let result = '';

  if (upper > 0) {
    if (upper > 1) result += encodeChunk(upper);
    result += '፼';                      // ፼ is the 10,000 multiplier
  }

  if (lower > 0) {
    result += encodeChunk(lower);
  }

  return result;
}

// ── Decode: Ge'ez → Arabic ────────────────────────────────────────────────

/**
 * Validates that a string contains only recognised Ge'ez numeral characters.
 * @param {string} str
 * @returns {boolean}
 */
export function isValidEthiopian(str) {
  if (!str || str.length === 0) return false;
  return [...str].every(ch => ch in CHAR_VALUE);
}

/**
 * Decodes a single segment (no ፼ inside) that follows the pattern:
 *   [optional multiplier-prefix] ፻ [optional tens] [optional ones]
 * or just tens + ones with no ፻.
 *
 * @param {string} seg
 * @returns {number}
 */
function decodeSegment(seg) {
  if (seg === '') return 0;

  // Split on ፻ — there should be at most one
  const parts = seg.split('፻');

  if (parts.length > 2) {
    throw new SyntaxError(`Invalid Ge'ez: multiple ፻ in one group → "${seg}"`);
  }

  let value = 0;

  if (parts.length === 2) {
    // parts[0] = multiplier prefix (empty means ×1, i.e. just 100)
    const hundredsMultiplier = parts[0] === ''
      ? 1
      : decodeSimple(parts[0]);
    value += hundredsMultiplier * 100;
    value += decodeSimple(parts[1]);
  } else {
    value = decodeSimple(parts[0]);
  }

  return value;
}

/**
 * Decodes a string made of only tens and ones characters (no ፻ or ፼).
 * @param {string} str
 * @returns {number}
 */
function decodeSimple(str) {
  if (str === '') return 0;
  let total = 0;
  for (const ch of str) {
    const v = CHAR_VALUE[ch];
    if (v === undefined) throw new SyntaxError(`Unknown character: "${ch}"`);
    if (v === 100 || v === 10000) throw new SyntaxError(`Unexpected ፻/፼ in simple segment`);
    total += v;
  }
  return total;
}

/**
 * Converts a Ge'ez numeral string to an Arabic integer.
 * @param {string} str
 * @returns {number}
 */
export function ethiopianToArabic(str) {
  str = str.trim();
  if (!isValidEthiopian(str)) {
    throw new SyntaxError(`"${str}" contains invalid Ge'ez numeral characters`);
  }

  // Split on ፼ — there should be at most one
  const groups = str.split('፼');

  if (groups.length > 2) {
    throw new SyntaxError(`Input has more than one ፼, which is unsupported above 99,999,999`);
  }

  if (groups.length === 2) {
    const upperSeg = groups[0]; // multiplier for ×10,000
    const lowerSeg = groups[1]; // remainder

    const upperValue = upperSeg === '' ? 1 : decodeSegment(upperSeg);
    const lowerValue = decodeSegment(lowerSeg);

    return upperValue * 10000 + lowerValue;
  }

  // No ፼ — everything is below 10,000
  return decodeSegment(str);
}

// ── Quick self-test (runs only in Node) ──────────────────────────────────

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('ethiopian.js')) {
  const cases = [
    [1, '፩'], [9, '፱'], [10, '፲'], [11, '፲፩'], [99, '፺፱'],
    [100, '፻'], [101, '፻፩'], [200, '፪፻'], [999, '፱፻፺፱'],
    [1000, '፲፻'], [9999, '፺፱፻፺፱'],
    [10000, '፼'], [10001, '፼፩'], [20000, '፪፼'],
    [99999999, '፺፱፻፺፱፼፺፱፻፺፱'],
  ];

  let pass = 0, fail = 0;
  for (const [arabic, geez] of cases) {
    const encoded = arabicToEthiopian(arabic);
    const decoded = ethiopianToArabic(geez);
    const ok = encoded === geez && decoded === arabic;
    console.log(`${ok ? '✓' : '✗'} ${arabic} ↔ ${geez}  (got: ${encoded} / ${decoded})`);
    ok ? pass++ : fail++;
  }
  console.log(`\n${pass} passed, ${fail} failed`);
}
