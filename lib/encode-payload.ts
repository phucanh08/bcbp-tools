export interface EncodeFormData {
  passengerName: string;
  pnr: string;
  fromAirport: string;
  toAirport: string;
  carrier: string;
  flightNumber: string;
  flightDate: string;
  compartment: string;
  seatNumber: string;
  checkInSeq: string;
  airlineInfo: string;
  issuanceDate: string;
  documentType: string;
  issuer: string;
  baggage: string;
}

export interface BcbpPayload {
  data: {
    passengerName: string;
    legs: Array<{
      operatingCarrierPNR: string;
      departureAirport: string;
      arrivalAirport: string;
      operatingCarrierDesignator: string;
      flightNumber: string;
      flightDate: Date;
      compartmentCode: string;
      seatNumber: string;
      checkInSequenceNumber: string;
      airlineInfo: string;
    }>;
    issuanceDate: Date;
    documentType: string;
    boardingPassIssuerDesignator: string;
    baggageTagNumber: string;
  };
  meta: {
    formatCode: 'M';
    numberOfLegs: 1;
    versionNumberIndicator: '>';
    versionNumber: 1;
  };
}

const requiredFields = ['passengerName', 'pnr', 'fromAirport', 'toAirport'] as const;

export function getLocalDateInputValue(date = new Date()): string {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// The bcbp library derives the day-of-year from the Date's UTC fields, so the
// calendar date must be anchored at UTC midnight (not local midnight). Using
// local midnight caused a timezone off-by-one (e.g. UTC+7 encoded the day before).
export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function createDefaultEncodeFormData(dateValue = getLocalDateInputValue()): EncodeFormData {
  return {
    passengerName: 'LE/PHUC ANH MR',
    pnr: 'LH8W9P',
    fromAirport: 'SGN',
    toAirport: 'DLI',
    carrier: 'VN',
    flightNumber: '1381',
    flightDate: dateValue,
    compartment: 'Y',
    seatNumber: '010B',
    checkInSeq: '0002',
    airlineInfo: '12299',
    issuanceDate: dateValue,
    documentType: 'B',
    issuer: 'VN',
    baggage: '0000000000000',
  };
}

export function getMissingRequiredEncodeFields(formData: EncodeFormData): string[] {
  return requiredFields.filter((field) => !formData[field].trim());
}

export function buildBcbpPayload(formData: EncodeFormData): BcbpPayload {
  return {
    data: {
      passengerName: formData.passengerName.trim(),
      legs: [
        {
          operatingCarrierPNR: formData.pnr.trim(),
          departureAirport: formData.fromAirport.trim().toUpperCase(),
          arrivalAirport: formData.toAirport.trim().toUpperCase(),
          operatingCarrierDesignator: formData.carrier.trim().toUpperCase(),
          flightNumber: formData.flightNumber.trim(),
          flightDate: parseDateInput(formData.flightDate),
          compartmentCode: formData.compartment.trim().toUpperCase(),
          seatNumber: formData.seatNumber.trim().toUpperCase(),
          checkInSequenceNumber: formData.checkInSeq.trim(),
          airlineInfo: formData.airlineInfo.trim(),
        },
      ],
      issuanceDate: parseDateInput(formData.issuanceDate),
      documentType: formData.documentType.trim(),
      boardingPassIssuerDesignator: formData.issuer.trim().toUpperCase(),
      baggageTagNumber: formData.baggage.trim(),
    },
    meta: {
      formatCode: 'M',
      numberOfLegs: 1,
      versionNumberIndicator: '>',
      versionNumber: 1,
    },
  };
}
