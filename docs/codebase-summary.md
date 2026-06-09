# Codebase Summary

## Purpose

BCBP Tools is a NextJS 15 browser application for encoding and decoding IATA Bar Coded Boarding Pass (BCBP) v6 strings. The app keeps passenger and flight data in the browser, uses `bcbp@6.0.2` for string conversion, and renders PDF417 barcodes locally with vendored Barcode Bakery scripts.

## Current State

- Legacy static entrypoint `index.html` has been removed.
- Legacy `lib/barcode-common.js` and `lib/barcode-pdf417.js` copies were removed.
- Canonical barcode vendor assets now live in `public/barcode-common.js` and `public/barcode-pdf417.js`.
- The app is served from the NextJS app router entry under `app/`.

## Main Directories

### `app/`
- `layout.tsx` defines metadata, global shell, and loads barcode scripts with `next/script` before interactive hydration.
- `page.tsx` mounts the root application component.
- `globals.css` contains global styling and theme primitives.

### `components/`
- `bcbp-tools-app.tsx` composes the page shell, tabs, and footer.
- `decode-panel.tsx` owns decode input, async decode flow, JSON output, and clipboard behavior.
- `encode-panel.tsx` owns one-leg encode form state, validation, async encode flow, and clipboard behavior.
- `pdf417-barcode.tsx` waits for vendor scripts, renders PDF417 output, and reports browser-side failures.
- `documentation.tsx` renders in-app field reference content.
- `app-header.tsx` and `components/ui/*` provide presentational structure and primitives.

### `lib/`
- `encode-payload.ts` defines encode form types, default values, required-field checks, and the one-leg BCBP payload builder.
- `bcbp-client.ts` lazy-loads the `bcbp` package on the client and validates the exposed API boundary.
- `pdf417.ts` validates browser-only execution, waits for `window.BarcodeBakery`, and renders PNG data URLs through canvas.
- `utils.ts` contains shared utility helpers.
- `encode-payload.test.ts` covers encode payload logic.

### `public/`
- `barcode-common.js` and `barcode-pdf417.js` are vendored browser assets and the only supported Barcode Bakery script sources.

## Runtime Flow

1. NextJS serves the app router page from `app/page.tsx`.
2. `app/layout.tsx` injects the public barcode scripts before interactive code runs.
3. Decode actions call `decodeBcbp`, which lazy-loads `bcbp` and returns decoded JSON.
4. Encode actions validate form fields, build a one-leg payload, then call `encodeBcbp`.
5. Barcode display waits until `window.BarcodeBakery` is ready, then renders a PDF417 image from the active BCBP string.

## Constraints

- Encode flow currently supports one leg only.
- All BCBP data processing is client-side; no app API or persistence layer exists.
- PDF417 rendering depends on browser globals supplied by public vendor scripts.
- The app currently builds as a standard NextJS application. Static export and GitHub Pages deployment are not configured yet.
