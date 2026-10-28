import { readFileSync, writeFileSync } from 'node:fs';

const wasm = readFileSync('pkg/fast_ts_qr_bg.wasm');
writeFileSync(
  'src-js/wasm-inline.ts',
  `export const wasmBase64 = "${wasm.toString('base64')}";\n`
);