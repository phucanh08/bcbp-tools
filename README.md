# BCBP Tools

NextJS browser tool for encoding and decoding IATA Bar Coded Boarding Pass (BCBP) v6 strings.

## What it does

- Decode a BCBP string with `bcbp@6.0.2`
- Encode a one-leg BCBP string with `bcbp@6.0.2`
- Render PDF417 barcodes locally in the browser with vendored Barcode Bakery scripts
- Copy decoded JSON or encoded string to clipboard
- Keep all boarding pass processing client-side

## Stack

- NextJS 15 app router
- TypeScript
- TailwindCSS
- shadcn/ui-style Radix primitives
- `bcbp@6.0.2`
- Vendored Barcode Bakery PDF417 scripts under `public/`

## Run

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Build production output:

```powershell
npm run build
```

Run the production server after a successful build:

```powershell
npm run start
```

Run unit tests:

```powershell
npm run test
```

Run lint:

```powershell
npm run lint
```

## Deployment note

The current config builds and serves as a standard NextJS app. Static export or GitHub Pages deployment is not configured yet. If GitHub Pages remains the target, add the required `next.config.ts` export/base-path settings and document the deploy command before publishing.

## Architecture at a glance

- `app/` owns the NextJS layout, route, and global styles
- `components/` owns the Figma-inspired UI
- `components/ui/` contains focused shadcn/ui primitives
- `lib/encode-payload.ts` builds the one-leg BCBP payload
- `lib/bcbp-client.ts` loads the BCBP library on the client
- `lib/pdf417.ts` renders PDF417 using browser canvas and `window.BarcodeBakery`
- `public/barcode-common.js` and `public/barcode-pdf417.js` are loaded by `app/layout.tsx`

## Scope

Encode UI currently builds one leg only. Decode can show multi-leg data returned by the `bcbp` library.
