'use client';

import { AppHeader } from '@/components/app-header';
import { DecodePanel } from '@/components/decode-panel';
import { Documentation } from '@/components/documentation';
import { EncodePanel } from '@/components/encode-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function BcbpToolsApp() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-12">
        <Tabs defaultValue="decode" className="w-full">
          <TabsList className="mb-6 flex w-full gap-1 sm:inline-flex sm:w-auto">
            <TabsTrigger value="decode" className="flex-1 sm:flex-none">Giải mã</TabsTrigger>
            <TabsTrigger value="encode" className="flex-1 sm:flex-none">Mã hóa</TabsTrigger>
          </TabsList>

          <TabsContent value="decode"><DecodePanel /></TabsContent>
          <TabsContent value="encode"><EncodePanel /></TabsContent>
        </Tabs>

        <Documentation />
      </main>

      <footer className="mx-auto max-w-5xl border-t border-neutral-200 px-6 py-8 text-center text-xs text-neutral-500">
        <p>
          BCBP Tools - Công cụ mã hóa/giải mã thẻ lên máy bay IATA
          <br />
          Mọi xử lý diễn ra trên trình duyệt của bạn. Không có dữ liệu nào được gửi đến máy chủ.
        </p>
      </footer>
    </div>
  );
}
