# BCBP Tools

NextJS browser tool for encoding and decoding IATA Bar Coded Boarding Pass (BCBP) v6 strings.

## What it does

- Decode a BCBP string with `bcbp@6.0.2`
- Encode a one-leg BCBP string with `bcbp@6.0.2`
- Render PDF417 barcodes locally in the browser with vendored Barcode Bakery scripts
- Render the same BCBP string as a QR code (PDF417 | QR toggle) with the `qrcode` package
- Copy decoded JSON or encoded string to clipboard
- Keep all boarding pass processing client-side

## Stack

- NextJS 15 app router
- TypeScript
- TailwindCSS
- shadcn/ui-style Radix primitives
- `bcbp@6.0.2`
- Vendored Barcode Bakery PDF417 scripts under `public/`
- `qrcode` for client-side QR SVG rendering (error correction level M)

## Run

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Build the static export (written to `out/`):

```powershell
npm run build
```

Preview the static export locally after a successful build (`npm run start` does not work with `output: 'export'`):

```powershell
npx serve out
```

Run unit tests:

```powershell
npm run test
```

Run lint:

```powershell
npm run lint
```

## Deployment

The app is a static export (`output: 'export'` in `next.config.ts`) hosted on GitHub Pages at the custom domain [bcbp.anhlp.com](https://bcbp.anhlp.com), so no base path is needed. `.github/workflows/deploy.yml` deploys on every push to `main` (or a manual run): `npm ci` → `npm run build` → adds `out/.nojekyll` and copies `CNAME` into `out/` → publishes `out/` to Pages.

## Architecture at a glance

- `app/` owns the NextJS layout, route, and global styles
- `components/` owns the Figma-inspired UI
- `components/ui/` contains focused shadcn/ui primitives
- `lib/encode-payload.ts` builds the one-leg BCBP payload
- `lib/bcbp-client.ts` loads the BCBP library on the client
- `lib/bcbp-input.ts` normalizes pasted decode input without dropping trailing padding spaces
- `lib/pdf417.ts` renders PDF417 using browser canvas and `window.BarcodeBakery`
- `lib/qr-code.ts` renders the exact BCBP string (padding spaces included) as a QR SVG data URL
- `components/bcbp-barcode.tsx` lets users switch between PDF417 and QR output
- `public/barcode-common.js` and `public/barcode-pdf417.js` are loaded by `app/layout.tsx`

## Scope

Encode UI currently builds one leg only. Decode can show multi-leg data returned by the `bcbp` library.
