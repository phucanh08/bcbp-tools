declare module 'bcbp' {
  export function encode(payload: unknown): string;
  export function decode(input: string): unknown;

  const bcbp: {
    encode: typeof encode;
    decode: typeof decode;
  };

  export default bcbp;
}
