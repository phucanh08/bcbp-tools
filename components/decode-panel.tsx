'use client';

import { ChevronRight, Copy, RotateCcw } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Pdf417Barcode } from '@/components/pdf417-barcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { decodeBcbp } from '@/lib/bcbp-client';

const exampleBCBP = 'M1LE/PHUCANH           LH8W9P HANSGNVN 1187 120Y001A0025 106>10000';

export function DecodePanel() {
  const [input, setInput] = useState(exampleBCBP);
  const [result, setResult] = useState('');
  const [barcodeText, setBarcodeText] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const decodeRequestId = useRef(0);

  async function handleDecode() {
    const text = input.trim();

    if (!text) {
      toast.error('Vui lòng nhập chuỗi BCBP');
      return;
    }

    const requestId = ++decodeRequestId.current;
    setIsDecoding(true);
    try {
      const decoded = await decodeBcbp(text);

      if (requestId !== decodeRequestId.current) {
        return;
      }

      setResult(JSON.stringify(decoded, null, 2));
      setBarcodeText(text);
      toast.success('Giải mã thành công');
    } catch {
      if (requestId !== decodeRequestId.current) {
        return;
      }

      setResult('');
      setBarcodeText('');
      toast.error('Không thể giải mã. Vui lòng kiểm tra định dạng BCBP.');
    } finally {
      if (requestId === decodeRequestId.current) {
        setIsDecoding(false);
      }
    }
  }

  function handleInputChange(value: string) {
    decodeRequestId.current += 1;
    setInput(value);
    setIsDecoding(false);
  }

  function handleClear() {
    decodeRequestId.current += 1;
    setInput('');
    setResult('');
    setBarcodeText('');
    setIsDecoding(false);
  }

  async function handleCopyJSON() {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      toast.success('Đã sao chép JSON');
    } catch {
      toast.error('Không thể sao chép JSON');
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="decode-input">Chuỗi BCBP</Label>
            <Textarea
              id="decode-input"
              value={input}
              onChange={(event) => handleInputChange(event.target.value)}
              placeholder={exampleBCBP}
              rows={4}
            />
            <p className="text-xs text-neutral-500">Ví dụ: {exampleBCBP}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleDecode} disabled={!input.trim() || isDecoding}>
          {isDecoding ? 'Đang giải mã' : 'Giải mã'}
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button onClick={handleClear} variant="secondary">
          <RotateCcw className="h-4 w-4" />
          Xóa
        </Button>
        <Button onClick={handleCopyJSON} variant="ghost" disabled={!result}>
          <Copy className="h-4 w-4" />
          Sao chép JSON
        </Button>
      </div>

      {result ? (
        <Card>
          <CardContent>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900">Kết quả</h3>
              <button
                type="button"
                onClick={handleCopyJSON}
                className="rounded-md p-1.5 transition-colors hover:bg-neutral-100"
                aria-label="Sao chép kết quả JSON"
              >
                <Copy className="h-4 w-4 text-neutral-500" />
              </button>
            </div>
            <pre className="max-h-96 overflow-auto rounded-md bg-neutral-50 p-4">
              <code className="font-mono text-xs text-neutral-800">{result}</code>
            </pre>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
            <ChevronRight className="h-6 w-6 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-500">Nhập chuỗi BCBP và nhấn Giải mã để xem kết quả</p>
        </div>
      )}

      <Pdf417Barcode text={barcodeText} alt="PDF417 barcode for decoded BCBP input" />
    </div>
  );
}
