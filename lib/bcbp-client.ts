import type { BcbpPayload } from './encode-payload';

interface BcbpApi {
  encode(payload: BcbpPayload): string;
  decode(input: string): unknown;
}

type BcbpModule = Partial<BcbpApi> & {
  default?: Partial<BcbpApi>;
};

let cachedApi: BcbpApi | null = null;

export async function getBcbpApi(): Promise<BcbpApi> {
  if (cachedApi) {
    return cachedApi;
  }

  const bcbpModule = (await import('bcbp')) as BcbpModule;
  const api = bcbpModule.decode && bcbpModule.encode ? bcbpModule : bcbpModule.default;

  if (!api?.decode || !api.encode) {
    throw new Error('BCBP library did not expose encode/decode functions.');
  }

  cachedApi = api as BcbpApi;
  return cachedApi;
}

export async function decodeBcbp(input: string): Promise<unknown> {
  const api = await getBcbpApi();
  return api.decode(input);
}

export async function encodeBcbp(payload: BcbpPayload): Promise<string> {
  const api = await getBcbpApi();
  return api.encode(payload);
}
