type Surface = {
  context: CanvasRenderingContext2D;
  createSurface: (width: number, height: number) => Surface;
};

type BarcodeBakeryGlobals = {
  BCGpdf417: new () => {
    setScale(scale: number): void;
    setRatio(ratio: number): void;
    setForegroundColor(color: unknown): void;
    setBackgroundColor(color: unknown): void;
    parse(text: string): void;
  };
  BCGColor: new (red: number, green: number, blue: number) => unknown;
  BCGDrawing: new (surfaceFactory: (width: number, height: number) => Surface) => {
    draw(code: unknown): void;
    getImage(): { context: CanvasRenderingContext2D };
  };
};

declare global {
  interface Window {
    BarcodeBakery?: BarcodeBakeryGlobals;
  }
}

function assertBrowser(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error(
      'renderPdf417 must be called in a browser after barcode scripts have loaded.',
    );
  }
}

export function isPdf417Ready(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof window.BarcodeBakery !== 'undefined'
  );
}

export async function waitForPdf417Ready(timeoutMs = 3000): Promise<void> {
  assertBrowser();

  const startedAt = Date.now();

  while (!isPdf417Ready()) {
    if (Date.now() - startedAt >= timeoutMs) {
      throw new Error('Barcode libraries did not load.');
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 50);
    });
  }
}

function createSurface(width: number, height: number): Surface {
  assertBrowser();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas 2D context is unavailable.');
  }

  return { context, createSurface };
}

export function renderPdf417(text: string): string {
  assertBrowser();

  if (!isPdf417Ready()) {
    throw new Error('Barcode libraries did not load.');
  }

  const barcodeBakery = window.BarcodeBakery;

  if (!barcodeBakery) {
    throw new Error('Barcode libraries did not load.');
  }

  const { BCGpdf417, BCGColor, BCGDrawing } = barcodeBakery;
  const code = new BCGpdf417();
  code.setScale(3);
  code.setRatio(0.2);
  code.setForegroundColor(new BCGColor(0, 0, 0));
  code.setBackgroundColor(new BCGColor(255, 255, 255));
  code.parse(text);

  const drawing = new BCGDrawing(createSurface);
  drawing.draw(code);

  return drawing.getImage().context.canvas.toDataURL('image/png');
}
