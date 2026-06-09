'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { renderPdf417, waitForPdf417Ready } from '@/lib/pdf417';

interface Pdf417BarcodeProps {
  text: string;
  alt: string;
}

export function Pdf417Barcode({ text, alt }: Pdf417BarcodeProps) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let cancelled = false;

    const renderBarcode = async () => {
      if (!text) {
        setSrc('');
        return;
      }

      try {
        await waitForPdf417Ready();

        if (cancelled) {
          return;
        }

        setSrc(renderPdf417(text));
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(error);
        setSrc('');
        toast.error('Không thể tạo mã PDF417.');
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
      {/* eslint-disable-next-line @next/next/no-img-element -- client-generated canvas data URL is not suitable for next/image */}
      <img src={src} alt={alt} className="mx-auto h-auto max-w-full sm:max-w-[350px]" />
    </div>
  );
}
