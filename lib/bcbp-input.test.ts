import { describe, expect, it } from 'vitest';
import { decodeBcbp } from './bcbp-client';
import { normalizeBcbpInput } from './bcbp-input';

// Ends with a space-padded airline-use field: the trailing spaces are BCBP data.
const BCBP_TRAILING_PADDING =
  'M1LE/PHUC ANH MR      ELH8W9P SGNDLIVN 1381 160Y010B0002 15C>5180  6160BVN              2A0000000000000 0                          N   ';

describe('normalizeBcbpInput', () => {
  it('keeps trailing padding spaces unchanged', () => {
    expect(normalizeBcbpInput(BCBP_TRAILING_PADDING)).toBe(BCBP_TRAILING_PADDING);
  });

  it('keeps internal padding spaces unchanged', () => {
    const text = 'M1LE/PHUCANH           LH8W9P HANSGNVN 1187 120Y001A0025 106>10000';

    expect(normalizeBcbpInput(text)).toBe(text);
  });

  it.each([
    ['LF', '\n'],
    ['CRLF', '\r\n'],
    ['CR', '\r'],
    ['several line breaks', '\r\n\r\n'],
    ['line break followed by whitespace', '\n  \t'],
  ])('removes a trailing %s but keeps the padding before it', (_label, suffix) => {
    expect(normalizeBcbpInput(`${BCBP_TRAILING_PADDING}${suffix}`)).toBe(BCBP_TRAILING_PADDING);
  });

  it.each([
    ['spaces', '   '],
    ['line breaks', '\r\n\n'],
    ['mixed whitespace', ' \t\r\n '],
  ])('removes leading %s (a BCBP always starts with its format code)', (_label, prefix) => {
    expect(normalizeBcbpInput(`${prefix}${BCBP_TRAILING_PADDING}`)).toBe(BCBP_TRAILING_PADDING);
  });

  it.each(['', ' ', '   ', '\n', '\r\n', ' \t\r\n '])(
    'treats whitespace-only input %j as empty',
    (input) => {
      expect(normalizeBcbpInput(input)).toBe('');
    },
  );

  it('keeps line breaks and whitespace inside the string', () => {
    expect(normalizeBcbpInput('M1A\r\n  B  \n')).toBe('M1A\r\n  B  ');
  });

  it('runs in linear time on long internal runs of line breaks and spaces', () => {
    // A backtracking regex took ~8s on this input; the linear version takes ~0ms.
    const input = `M${'\n '.repeat(50_000)}X`;
    const start = performance.now();

    expect(normalizeBcbpInput(input)).toBe(input);
    expect(performance.now() - start).toBeLessThan(500);
  });

  it('produces a string the bcbp decoder accepts, from a pasted value with surrounding line breaks', async () => {
    const decoded = (await decodeBcbp(normalizeBcbpInput(`\r\n${BCBP_TRAILING_PADDING}\r\n`))) as {
      data?: { passengerName?: string; legs?: Array<{ departureAirport?: string; arrivalAirport?: string }> };
    };

    expect(decoded.data?.passengerName).toBe('LE/PHUC ANH MR');
    expect(decoded.data?.legs?.[0]?.departureAirport).toBe('SGN');
    expect(decoded.data?.legs?.[0]?.arrivalAirport).toBe('DLI');
  });
});
