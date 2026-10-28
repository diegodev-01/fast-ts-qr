import init, { generateQr as _generateQr, QrResult } from '../pkg/fast_ts_qr.js';
import { wasmBase64 } from './wasm-inline.js'; // generado en build

let ready: Promise<void> | null = null;

function ensureInit(): Promise<void> {
  if (!ready) {
    const bytes = Uint8Array.from(atob(wasmBase64), c => c.charCodeAt(0));
    ready = init({ module_or_path: bytes }).then(() => {});
  }
  return ready;
}

export async function generateQr(text: string): Promise<QrResult> {
  await ensureInit();
  return _generateQr(text);
}

export type { QrResult };