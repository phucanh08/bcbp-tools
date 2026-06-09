import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = compat.extends(
  'eslint-config-next/core-web-vitals.js',
  'eslint-config-next/typescript.js',
);

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'lib/barcode-*.js',
      'public/barcode-*.js',
    ],
  },
  ...eslintConfig,
];

export default config;
