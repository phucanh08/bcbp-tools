import { describe, expect, it } from 'vitest';
import {
  buildBcbpPayload,
  createDefaultEncodeFormData,
  getMissingRequiredEncodeFields,
  parseLocalDateInput,
} from './encode-payload';

describe('encode payload helpers', () => {
  it('creates defaults using a provided ISO date', () => {
    expect(createDefaultEncodeFormData('2026-06-09')).toEqual({
      passengerName: 'LE/PHUC ANH MR',
      pnr: 'LH8W9P',
      fromAirport: 'SGN',
      toAirport: 'DLI',
      carrier: 'VN',
      flightNumber: '1381',
      flightDate: '2026-06-09',
      compartment: 'Y',
      seatNumber: '010B',
      checkInSeq: '0002',
      airlineInfo: '12299',
      issuanceDate: '2026-06-09',
      documentType: 'B',
      issuer: 'VN',
      baggage: '0000000000000',
    });
  });

  it('reports missing required fields', () => {
    const formData = createDefaultEncodeFormData('2026-06-09');

    expect(
      getMissingRequiredEncodeFields({
        ...formData,
        passengerName: ' ',
        pnr: '',
        fromAirport: 'SGN',
        toAirport: '',
      }),
    ).toEqual(['passengerName', 'pnr', 'toAirport']);
  });

  it('builds the one-leg BCBP payload used by the current app', () => {
    const payload = buildBcbpPayload({
      passengerName: ' le/phuc anh mr ',
      pnr: ' lh8w9p ',
      fromAirport: 'sgn',
      toAirport: 'dli',
      carrier: 'vn',
      flightNumber: '1381',
      flightDate: '2026-06-09',
      compartment: 'y',
      seatNumber: '010b',
      checkInSeq: '0002',
      airlineInfo: '12299',
      issuanceDate: '2026-06-09',
      documentType: 'B',
      issuer: 'vn',
      baggage: '0000000000000',
    });

    expect(payload).toMatchObject({
      data: {
        passengerName: 'le/phuc anh mr',
        legs: [
          {
            operatingCarrierPNR: 'lh8w9p',
            departureAirport: 'SGN',
            arrivalAirport: 'DLI',
            operatingCarrierDesignator: 'VN',
            flightNumber: '1381',
            compartmentCode: 'Y',
            seatNumber: '010B',
            checkInSequenceNumber: '0002',
            airlineInfo: '12299',
          },
        ],
        documentType: 'B',
        boardingPassIssuerDesignator: 'VN',
        baggageTagNumber: '0000000000000',
      },
      meta: {
        formatCode: 'M',
        numberOfLegs: 1,
        versionNumberIndicator: '>',
        versionNumber: 1,
      },
    });

    expect(payload.data.legs[0].flightDate).toEqual(parseLocalDateInput('2026-06-09'));
    expect(payload.data.issuanceDate).toEqual(parseLocalDateInput('2026-06-09'));
  });

  it('parses date inputs as local calendar dates at year boundaries', () => {
    const newYear = parseLocalDateInput('2026-01-01');
    const yearEnd = parseLocalDateInput('2026-12-31');

    expect({
      year: newYear.getFullYear(),
      month: newYear.getMonth(),
      day: newYear.getDate(),
    }).toEqual({ year: 2026, month: 0, day: 1 });

    expect({
      year: yearEnd.getFullYear(),
      month: yearEnd.getMonth(),
      day: yearEnd.getDate(),
    }).toEqual({ year: 2026, month: 11, day: 31 });
  });
});
