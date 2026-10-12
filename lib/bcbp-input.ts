/**
 * Normalizes a pasted BCBP string before decoding and barcode generation.
 *
 * - Leading whitespace is removed: a BCBP always starts with its format code
 *   (e.g. `M`), so leading whitespace is never part of the data, and the bcbp
 *   decoder misparses every fixed-width field if it is left in place.
 * - At the end, only a trailing line break (CR/LF) and any whitespace after it
 *   are removed, e.g. the newline a copy from a terminal or document adds.
 *   Spaces before that line break are kept, because BCBP fields are fixed-width
 *   and space-padded, so trailing spaces can be part of the encoded data and must
 *   reach the PDF417/QR barcode unchanged.
 *
 * Whitespace-only input normalizes to an empty string.
 */
export function normalizeBcbpInput(input: string): string {
  const text = input.trimStart();
  // Linear-time equivalent of text.replace(/[\r\n]\s*$/, ''); that regex
  // backtracks quadratically on long internal runs of line breaks/whitespace.
  const core = text.trimEnd();
  const trailingWhitespace = text.slice(core.length);
  const lineBreak = trailingWhitespace.search(/[\r\n]/);

  return lineBreak === -1 ? text : core + trailingWhitespace.slice(0, lineBreak);
}
