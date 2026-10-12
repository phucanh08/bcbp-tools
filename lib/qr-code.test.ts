import jsQR from 'jsqr';
import { describe, expect, it } from 'vitest';
import { renderQrCode } from './qr-code';

// Real-shaped BCBP M1 string with padding spaces (name field and conditional section).
const BCBP_WITH_PADDING =
  'M1LE/PHUC ANH MR      ELH8W9P SGNDLIVN 1381 160Y010B0002 15C>5180  6160BVN              2A0000000000000 0                          N';

/**
 * Rasterises the SVG produced by renderQrCode and decodes it with jsQR, so the
 * test checks the actual rendered artifact rather than the library internals.
 * The qrcode SVG renderer draws dark modules as horizontal stroke segments
 * using only `M x y`, `m dx dy` and `h len` commands (qrcode lib/renderer/svg-tag.js).
 * If a qrcode upgrade changes that format, this parser throws rather than passing falsely.
 */
function decodeSvgDataUrl(dataUrl: string): string | null {
  const svg = decodeURIComponent(dataUrl.slice(dataUrl.indexOf(',') + 1));
  const viewBox = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
  const strokePath = /<path stroke="#000000" d="([^"]*)"/.exec(svg);

  if (!viewBox || !strokePath) {
    throw new Error('Unexpected SVG output from qrcode renderer.');
  }

  const modules = Number(viewBox[1]);
  const scale = 4;
  const full = modules * scale;
  const pixels = new Uint8ClampedArray(full * full * 4).fill(255);

  let x = 0;
  let y = 0;

  for (const [, command, args] of strokePath[1].matchAll(/([MmhH])([^MmhH]*)/g)) {
    const numbers = args.trim().split(/\s+/).map(Number);

    if (command === 'M') {
      [x, y] = numbers;
    } else if (command === 'm') {
      x += numbers[0];
      y += numbers[1];
    } else if (command === 'h') {
      const row = Math.floor(y);

      for (let col = x; col < x + numbers[0]; col += 1) {
        for (let dy = 0; dy < scale; dy += 1) {
          for (let dx = 0; dx < scale; dx += 1) {
            const offset = ((row * scale + dy) * full + col * scale + dx) * 4;
            pixels[offset] = 0;
            pixels[offset + 1] = 0;
            pixels[offset + 2] = 0;
          }
        }
      }

      x += numbers[0];
    } else {
      throw new Error(`Unsupported SVG path command ${command}.`);
    }
  }

  return jsQR(pixels, full, full)?.data ?? null;
}

describe('QR code rendering', () => {
  it('produces an SVG data URL', async () => {
    const url = await renderQrCode(BCBP_WITH_PADDING);

    expect(url.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true);
    expect(decodeURIComponent(url.slice(url.indexOf(',') + 1))).toContain('<svg');
  });

  it('round-trips the exact BCBP string including padding spaces', async () => {
    expect(decodeSvgDataUrl(await renderQrCode(BCBP_WITH_PADDING))).toBe(BCBP_WITH_PADDING);
  });

  it('preserves leading and trailing spaces', async () => {
    const padded = '  M1TEST/PAX   ';

    expect(decodeSvgDataUrl(await renderQrCode(padded))).toBe(padded);
  });

  it('rejects empty text', async () => {
    await expect(renderQrCode('')).rejects.toThrow();
  });
});
