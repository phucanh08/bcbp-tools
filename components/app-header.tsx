import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

function StatusBullet({ children, lang }: { children: React.ReactNode; lang?: string }) {
  return (
    <span className="flex items-center gap-1.5" lang={lang}>
      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
      {children}
    </span>
  );
}

export function AppHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-12 lg:py-12">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export; logo is a plain public asset */}
              <img
                src="/logo.png"
                alt="BCBP Tools logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-cover"
              />
              <h1 className="text-4xl font-semibold text-neutral-900">BCBP Tools</h1>
            </div>
            <p className="mb-6 max-w-2xl text-base text-neutral-600" lang="en">
              Encode and decode IATA Bar Coded Boarding Pass (v6). All processing happens locally in
              your browser — no data is sent to any server.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
              <StatusBullet lang="en">Client-side processing</StatusBullet>
              <StatusBullet lang="en">PDF417 compatible</StatusBullet>
              <StatusBullet lang="en">Multi-leg support</StatusBullet>
            </div>
          </div>

          <Button asChild variant="ghost" size="icon" aria-label="View on GitHub">
            <a href="https://github.com/phucanh08/bcbp-tools" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5 text-neutral-600" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
