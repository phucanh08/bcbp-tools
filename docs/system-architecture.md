# System Architecture

## Overview

BCBP Tools is a client-first NextJS 15 application. It uses the app router for document structure, React client components for interaction, the `bcbp` package for BCBP encode/decode operations, and vendored Barcode Bakery scripts for PDF417 rendering. There is no backend service.

## Architectural Layers

### 1. Routing and Document Shell
- `app/layout.tsx` is the root document shell.
- It defines metadata and loads `public/barcode-common.js` plus `public/barcode-pdf417.js` through `next/script`.
- `app/page.tsx` exposes the single-tool page.

### 2. Presentation Layer
- `components/bcbp-tools-app.tsx` assembles the header, tab navigation, decode view, encode view, help content, and footer.
- `components/ui/*` provides reusable UI primitives used across feature panels.
- `components/documentation.tsx` keeps field guidance in the UI rather than external network content.

### 3. Feature Layer

#### Decode path
- `components/decode-panel.tsx` accepts raw BCBP text.
- It trims empty input at the UI boundary.
- It calls `decodeBcbp` asynchronously.
- It guards against stale async responses with a request id.
- Successful decode stores formatted JSON and the source text for barcode rendering.

#### Encode path
- `components/encode-panel.tsx` owns controlled form inputs.
- It validates required fields and date values before calling library code.
- It builds a one-leg payload via `buildBcbpPayload`.
- It calls `encodeBcbp` asynchronously and guards stale responses with a request id.
- Successful encode stores the generated BCBP string for copy and barcode rendering.

#### Barcode rendering path
- `components/pdf417-barcode.tsx` reacts to the current BCBP string.
- It waits for vendor script readiness through `waitForPdf417Ready`.
- It calls `renderPdf417` to produce a PNG data URL.
- Rendering failures are surfaced to users through toast notifications.

### 4. Integration Layer
- `lib/bcbp-client.ts` is the boundary around the external `bcbp` package.
- The module is lazy-loaded to keep startup smaller and to ensure client-only usage.
- The module validates that encode and decode functions exist before caching the API.
- `lib/pdf417.ts` is the boundary around `window.BarcodeBakery`.
- It asserts browser execution, waits for script readiness, and throws explicit errors when prerequisites are missing.

### 5. Static Assets
- `public/barcode-common.js` and `public/barcode-pdf417.js` are the canonical Barcode Bakery assets.
- Removed files `index.html`, `lib/barcode-common.js`, and `lib/barcode-pdf417.js` are not part of the runtime architecture anymore.

## Data Boundaries

### External inputs
- User-entered decode text.
- User-entered encode form fields.
- Browser clipboard API.
- Browser global `window.BarcodeBakery` supplied by public scripts.

### Validation points
- Decode path rejects empty trimmed strings.
- Encode path rejects missing required fields.
- Encode path rejects invalid date strings before payload construction.
- `bcbp-client.ts` rejects malformed module shape.
- `pdf417.ts` rejects server-side use, missing DOM APIs, missing canvas context, and missing barcode globals.

## Deployment Model

- The app builds as a standard NextJS application with `npm run build`.
- Public vendor assets ship with the Next build output.
- Static export and GitHub Pages deployment are not configured yet.
- No API routes, database, authentication, or server mutations are present.

## Known Scope Limits

- Encode support is limited to one leg.
- Decode output shape is delegated to the `bcbp` library.
- PDF417 rendering is browser-only because it depends on DOM canvas and vendor globals.
