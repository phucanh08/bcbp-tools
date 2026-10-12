'use client';

import { useState } from 'react';
import { Pdf417Barcode } from '@/components/pdf417-barcode';
import { QrCodeBarcode } from '@/components/qr-code-barcode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type BarcodeFormat = 'pdf417' | 'qr';

interface BcbpBarcodeProps {
  text: string;
  /** Describes what the barcode encodes, e.g. "encoded BCBP string". Used in alt text. */
  subject: string;
}

/** Shows a BCBP string as PDF417 (default) or QR code, chosen with a segmented control. */
export function BcbpBarcode({ text, subject }: BcbpBarcodeProps) {
  const [format, setFormat] = useState<BarcodeFormat>('pdf417');

  if (!text) {
    return null;
  }

  return (
    <Tabs value={format} onValueChange={(value) => setFormat(value as BarcodeFormat)} className="space-y-3">
      <div className="flex justify-center">
        <TabsList aria-label="Định dạng mã vạch">
          <TabsTrigger value="pdf417">PDF417</TabsTrigger>
          <TabsTrigger value="qr">QR</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="pdf417">
        <Pdf417Barcode text={text} alt={`PDF417 barcode for ${subject}`} />
      </TabsContent>
      <TabsContent value="qr">
        <QrCodeBarcode text={text} alt={`QR code for ${subject}`} />
      </TabsContent>
    </Tabs>
  );
}
