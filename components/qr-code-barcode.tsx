'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { renderQrCode } from '@/lib/qr-code';

interface QrCodeBarcodeProps {
  text: string;
  alt: string;
}

export function QrCodeBarcode({ text, alt }: QrCodeBarcodeProps) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let cancelled = false;

    const renderBarcode = async () => {
      if (!text) {
        setSrc('');
        return;
      }

      try {
        const dataUrl = await renderQrCode(text);

        if (!cancelled) {
          setSrc(dataUrl);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(error);
        setSrc('');
        toast.error('Không thể tạo mã QR.', { id: 'qr-render-error' });
      }
    };

    void renderBarcode();

    return () => {
      cancelled = true;
    };
  }, [text]);

  if (!src) {
    return null;
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 text-center shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element -- client-generated SVG data URL is not suitable for next/image */}
      <img src={src} alt={alt} className="mx-auto h-auto w-full max-w-[280px]" />
    </div>
  );
}
