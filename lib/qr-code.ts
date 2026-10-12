import type { QRCodeErrorCorrectionLevel } from 'qrcode';

type QrCodeModule = typeof import('qrcode');

/**
 * Lazy-loads qrcode so it stays out of the initial bundle (QR is opt-in).
 * qrcode is CommonJS; prefer the interop `default` (the real exports object).
 */
async function loadQrCode(): Promise<QrCodeModule> {
  const qrcodeModule = await import('qrcode');

  return (qrcodeModule as QrCodeModule & { default?: QrCodeModule }).default ?? qrcodeModule;
}

/**
 * Error correction level M (~15% recovery): a good balance between density and
 * robustness for BCBP strings (~60-160 ASCII chars) shown on screens or printed.
 */
export const QR_ERROR_CORRECTION_LEVEL: QRCodeErrorCorrectionLevel = 'M';

/** Quiet zone width in modules; 4 is the minimum required by the QR spec. */
export const QR_MARGIN = 4;

/** Intrinsic SVG size in CSS pixels (the image is vector, so it scales cleanly). */
export const QR_SIZE_PX = 280;

/**
 * Renders the given text as a QR code SVG data URL.
 *
 * The text is encoded as-is (no trimming), so BCBP padding spaces are preserved.
 * Uses the SVG renderer, which needs no canvas and works in both browser and Node.
 */
export async function renderQrCode(text: string): Promise<string> {
  if (!text) {
    throw new Error('Cannot render an empty QR code.');
  }

  const QRCode = await loadQrCode();
  const svg = await QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: QR_ERROR_CORRECTION_LEVEL,
    margin: QR_MARGIN,
    width: QR_SIZE_PX,
    color: { dark: '#000000', light: '#ffffff' },
  });

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
