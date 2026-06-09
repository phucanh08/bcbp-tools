'use client';

import { ChevronRight, Copy, Lock, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Pdf417Barcode } from '@/components/pdf417-barcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { encodeBcbp } from '@/lib/bcbp-client';
import {
  buildBcbpPayload,
  createDefaultEncodeFormData,
  getMissingRequiredEncodeFields,
  type EncodeFormData,
} from '@/lib/encode-payload';

type FieldName = keyof EncodeFormData;

function isValidDateInput(value: string) {
  return value.trim() !== '' && !Number.isNaN(new Date(value).getTime());
}

interface FieldProps {
  field: FieldName;
  label: string;
  value: string;
  onChange: (field: FieldName, value: string) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  type?: 'text' | 'date';
  uppercase?: boolean;
}

function Field({
  field,
  label,
  value,
  onChange,
  placeholder,
  helperText,
  required = false,
  maxLength,
  className,
  type = 'text',
  uppercase = false,
}: FieldProps) {
  const inputId = `encode-${field}`;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={inputId}>
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </Label>
      <Input
        id={inputId}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(event) => {
          const nextValue = uppercase ? event.target.value.toUpperCase() : event.target.value;
          onChange(field, nextValue);
        }}
        className={uppercase ? 'uppercase' : undefined}
      />
      {helperText ? <p className="text-xs text-neutral-500">{helperText}</p> : null}
    </div>
  );
}

export function EncodePanel() {
  const [formData, setFormData] = useState<EncodeFormData>(() => createDefaultEncodeFormData());
  const [result, setResult] = useState('');
  const [isEncoding, setIsEncoding] = useState(false);
  const encodeRequestId = useRef(0);

  function updateField(field: FieldName, value: string) {
    encodeRequestId.current += 1;
    setFormData((current) => ({ ...current, [field]: value }));
    setResult('');
    setIsEncoding(false);
  }

  async function handleEncode() {
    const missingFields = getMissingRequiredEncodeFields(formData);

    if (missingFields.length > 0) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    if (!isValidDateInput(formData.flightDate) || !isValidDateInput(formData.issuanceDate)) {
      toast.error('Vui lòng nhập ngày bay và ngày phát hành hợp lệ');
      return;
    }

    const requestId = ++encodeRequestId.current;
    setIsEncoding(true);

    try {
      const encoded = await encodeBcbp(buildBcbpPayload(formData));

      if (requestId !== encodeRequestId.current) {
        return;
      }

      setResult(encoded);
      toast.success('Mã hóa thành công');
    } catch {
      if (requestId !== encodeRequestId.current) {
        return;
      }

      setResult('');
      toast.error('Không thể mã hóa. Vui lòng kiểm tra thông tin.');
    } finally {
      if (requestId === encodeRequestId.current) {
        setIsEncoding(false);
      }
    }
  }

  function handleClear() {
    encodeRequestId.current += 1;
    setFormData(createDefaultEncodeFormData());
    setResult('');
    setIsEncoding(false);
  }

  async function handleCopyString() {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      toast.success('Đã sao chép chuỗi BCBP');
    } catch {
      toast.error('Không thể sao chép chuỗi BCBP');
    }
  }

  return (
    <div className="space-y-4" aria-busy={isEncoding}>
      <Card className="bg-white">
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              field="passengerName"
              label="Hành khách"
              value={formData.passengerName}
              onChange={updateField}
              placeholder="LE/PHUC ANH MR"
              helperText="Định dạng BCBP thường dùng: LAST/FIRST TITLE"
              required
              maxLength={20}
              className="md:col-span-2"
              uppercase
            />
            <Field
              field="pnr"
              label="PNR"
              value={formData.pnr}
              onChange={updateField}
              placeholder="LH8W9P"
              required
              maxLength={7}
              uppercase
            />
            <Field
              field="carrier"
              label="Hãng bay"
              value={formData.carrier}
              onChange={updateField}
              placeholder="VN"
              maxLength={3}
              uppercase
            />
            <Field
              field="fromAirport"
              label="Sân bay đi"
              value={formData.fromAirport}
              onChange={updateField}
              placeholder="SGN"
              required
              maxLength={3}
              uppercase
            />
            <Field
              field="toAirport"
              label="Sân bay đến"
              value={formData.toAirport}
              onChange={updateField}
              placeholder="DLI"
              required
              maxLength={3}
              uppercase
            />
            <Field
              field="flightNumber"
              label="Số hiệu chuyến bay"
              value={formData.flightNumber}
              onChange={updateField}
              placeholder="1381"
              maxLength={5}
            />
            <Field
              field="flightDate"
              label="Ngày bay"
              value={formData.flightDate}
              onChange={updateField}
              type="date"
            />
            <Field
              field="compartment"
              label="Hạng ghế"
              value={formData.compartment}
              onChange={updateField}
              placeholder="Y"
              maxLength={1}
              uppercase
            />
            <Field
              field="seatNumber"
              label="Ghế ngồi"
              value={formData.seatNumber}
              onChange={updateField}
              placeholder="010B"
              maxLength={4}
              uppercase
            />
            <Field
              field="checkInSeq"
              label="Số thứ tự check-in"
              value={formData.checkInSeq}
              onChange={updateField}
              placeholder="0002"
              maxLength={5}
            />
            <Field
              field="airlineInfo"
              label="Airline info"
              value={formData.airlineInfo}
              onChange={updateField}
              placeholder="12299"
              maxLength={5}
            />
            <Field
              field="issuanceDate"
              label="Ngày phát hành"
              value={formData.issuanceDate}
              onChange={updateField}
              type="date"
            />
            <Field
              field="documentType"
              label="Loại tài liệu"
              value={formData.documentType}
              onChange={updateField}
              placeholder="B"
              maxLength={1}
              uppercase
            />
            <Field
              field="issuer"
              label="Đơn vị phát hành"
              value={formData.issuer}
              onChange={updateField}
              placeholder="VN"
              maxLength={3}
              uppercase
            />
            <Field
              field="baggage"
              label="Mã hành lý"
              value={formData.baggage}
              onChange={updateField}
              placeholder="0000000000000"
              maxLength={13}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleEncode} disabled={isEncoding}>
              {isEncoding ? 'Đang mã hóa' : 'Mã hóa'}
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button onClick={handleClear} variant="secondary">
              <X className="h-4 w-4" />
              Xóa
            </Button>
            <Button onClick={handleCopyString} variant="ghost" disabled={!result}>
              <Copy className="h-4 w-4" />
              Sao chép chuỗi
            </Button>
          </div>
        </CardContent>
      </Card>

      {result ? (
        <Card className="bg-white">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Chuỗi BCBP</h3>
                <p className="text-xs text-neutral-500">Kết quả mã hóa sẵn sàng để sao chép hoặc tạo PDF417</p>
              </div>
              <button
                type="button"
                onClick={handleCopyString}
                className="rounded-md p-1.5 transition-colors hover:bg-neutral-100"
                aria-label="Sao chép chuỗi BCBP"
              >
                <Copy className="h-4 w-4 text-neutral-500" />
              </button>
            </div>
            <div className="overflow-x-auto rounded-md bg-neutral-50 p-4">
              {/* whitespace-pre-wrap preserves the BCBP padding spaces (HTML would otherwise collapse them) */}
              <code className="block whitespace-pre-wrap break-all font-mono text-xs text-neutral-800">{result}</code>
            </div>
            <Pdf417Barcode text={result} alt="PDF417 barcode for encoded BCBP string" />
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
            <Lock className="h-6 w-6 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-500">Điền thông tin chuyến bay để tạo chuỗi BCBP và mã PDF417</p>
        </div>
      )}
    </div>
  );
}
