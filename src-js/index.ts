import init, {
  generateQr as generateQrWasm,
  type QrResult as QrResultWasm,
} from '../pkg/fast_ts_qr.js';
import { wasmBase64 } from './wasm-inline.js';

let ready: Promise<void> | null = null;

function ensureInit(): Promise<void> {
  if (!ready) {
    ready = Promise.resolve()
      .then(() => {
        const bytes = Uint8Array.from(atob(wasmBase64), (character) =>
          character.charCodeAt(0),
        );
        return init({ module_or_path: bytes });
      })
      .then(() => undefined)
      .catch((error) => {
        ready = null;
        throw error;
      });
  }

  return ready;
}

export async function generateQr(text: string): Promise<QrResultWasm> {
  await ensureInit();
  return generateQrWasm(text);
}

export type { QrResultWasm as QrResult };
