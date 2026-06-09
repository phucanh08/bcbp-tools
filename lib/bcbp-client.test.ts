import { describe, expect, it } from 'vitest';
import { decodeBcbp, encodeBcbp } from './bcbp-client';
import { buildBcbpPayload, createDefaultEncodeFormData } from './encode-payload';

describe('bcbp library integration (encode/decode)', () => {
  it('encodes the default form data into a BCBP string', async () => {
    const encoded = await encodeBcbp(buildBcbpPayload(createDefaultEncodeFormData('2026-06-09')));
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);
    expect(encoded.startsWith('M1')).toBe(true);
  });

  it('decodes a known BCBP string into structured data', async () => {
    const decoded = (await decodeBcbp(
      'M1LE/PHUCANH           LH8W9P HANSGNVN 1187 120Y001A0025 106>10000',
    )) as { data?: { passengerName?: string; legs?: Array<{ departureAirport?: string }> } };
    expect(decoded.data?.passengerName).toContain('LE/PHUCANH');
    expect(decoded.data?.legs?.[0]?.departureAirport).toBe('HAN');
  });

  it('round-trips encode -> decode preserving key fields', async () => {
    const payload = buildBcbpPayload(createDefaultEncodeFormData('2026-06-09'));
    const encoded = await encodeBcbp(payload);
    const decoded = (await decodeBcbp(encoded)) as {
      data?: {
        passengerName?: string;
        issuanceDate?: string | Date;
        legs?: Array<{ operatingCarrierPNR?: string; flightDate?: string | Date }>;
      };
    };
    expect(decoded.data?.legs?.[0]?.operatingCarrierPNR?.trim()).toBe('LH8W9P');
  });

  it('encodes the calendar date without a timezone off-by-one (regression)', async () => {
    const payload = buildBcbpPayload(createDefaultEncodeFormData('2026-06-09'));
    const encoded = await encodeBcbp(payload);
    // 2026-06-09 is day-of-year 160 (not 159 = June 8)
    expect(encoded).toContain('160');
    const decoded = (await decodeBcbp(encoded)) as {
      data?: { issuanceDate?: string; legs?: Array<{ flightDate?: string }> };
    };
    expect(new Date(decoded.data!.legs![0]!.flightDate!).toISOString()).toBe('2026-06-09T00:00:00.000Z');
    expect(new Date(decoded.data!.issuanceDate!).toISOString()).toBe('2026-06-09T00:00:00.000Z');
  });
});
