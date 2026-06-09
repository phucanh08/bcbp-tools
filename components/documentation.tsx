import type { ReactNode } from 'react';
import { Info, Plane, Ticket, User } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

export function Documentation() {
  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Tài liệu tham khảo</h2>
        <Accordion type="single" collapsible className="space-y-3">
          <DocumentationSection value="passenger" icon={<User className="h-5 w-5" />} title="Thông tin hành khách">
            <Field name="passengerName" description="Tên hành khách theo định dạng HỌ/TÊN" format="Chữ in hoa, ngăn cách bởi dấu /" example="LE/PHUCANH" />
            <Field name="documentType" description="Loại giấy tờ" format="1 ký tự" example="B = Thẻ lên máy bay" />
          </DocumentationSection>

          <DocumentationSection value="flight" icon={<Plane className="h-5 w-5" />} title="Thông tin chuyến bay">
            <Field name="operatingCarrierDesignator" description="Mã hãng hàng không IATA" format="2-3 ký tự" example="VN, VJ, QH" />
            <Field name="flightNumber" description="Số hiệu chuyến bay" format="1-4 chữ số" example="1187" />
            <Field name="flightDate" description="Ngày bay" format="Ngày theo input date" example="2026-06-09" />
            <Field name="departureAirport" description="Mã sân bay đi IATA" format="3 chữ cái" example="HAN" />
            <Field name="arrivalAirport" description="Mã sân bay đến IATA" format="3 chữ cái" example="SGN" />
          </DocumentationSection>

          <DocumentationSection value="seat" icon={<Ticket className="h-5 w-5" />} title="Ghế ngồi & Check-in">
            <Field name="compartmentCode" description="Hạng ghế" format="1 chữ cái" example="F, J, Y" />
            <Field name="seatNumber" description="Số ghế được phân" format="Hàng + chữ cái" example="01A, 25F" />
            <Field name="checkInSequenceNumber" description="Thứ tự làm thủ tục" format="4-5 chữ số" example="0025" />
            <Field name="passengerStatus" description="Mã trạng thái hành khách" format="1 chữ số" example="0=Thường" />
          </DocumentationSection>

          <DocumentationSection value="additional" icon={<Info className="h-5 w-5" />} title="Dữ liệu bổ sung">
            <Field name="operatingCarrierPNR" description="Mã đặt chỗ / Booking reference" format="6 ký tự chữ và số" example="ABC123" />
            <Field name="airlineInfo" description="Thông tin bổ sung của hãng bay" format="Độ dài thay đổi" example="12299" />
            <Field name="baggageTagNumber" description="Số tag hành lý ký gửi" format="10-13 chữ số" example="0000000000000" />
            <Field name="issuanceDate" description="Ngày phát hành thẻ lên máy bay" format="Ngày theo input date" example="2026-06-09" />
          </DocumentationSection>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function DocumentationSection({
  value,
  icon,
  title,
  children,
}: {
  value: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>
        <span className="flex items-center gap-2.5">
          <span className="text-neutral-600">{icon}</span>
          <span>{title}</span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <dl className="space-y-2">{children}</dl>
      </AccordionContent>
    </AccordionItem>
  );
}

function Field({
  name,
  description,
  format,
  example,
}: {
  name: string;
  description: string;
  format: string;
  example: string;
}) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-3">
      <dt className="mb-1 font-mono text-xs font-medium text-neutral-600">{name}</dt>
      <dd className="space-y-1 text-sm text-neutral-700">
        <p className="text-xs">{description}</p>
        <p className="text-xs text-neutral-500">
          <span className="font-medium">Định dạng:</span> {format}
        </p>
        <p className="text-xs text-neutral-500">
          <span className="font-medium">Ví dụ:</span> {example}
        </p>
      </dd>
    </div>
  );
}
