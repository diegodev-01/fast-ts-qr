import init, {
  generateQr as generateQrWasm,
  readQr as readQrWasm,
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

export interface QrImageSource {
  /** RGBA pixels, row-major (same layout as `ImageData.data`). */
  data: Uint8Array | Uint8ClampedArray;
  width: number;
  height: number;
}

/** Decode all QR codes found in an image. Returns their texts (empty if none). */
export async function readQrAll(image: QrImageSource): Promise<string[]> {
  await ensureInit();
  const { data, width, height } = image;
  const bytes =
    data instanceof Uint8Array
      ? data
      : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  return readQrWasm(bytes, width, height);
}

/** Decode the first QR code found in an image, or `null` if none. */
export async function readQr(image: QrImageSource): Promise<string | null> {
  return (await readQrAll(image))[0] ?? null;
}

export type { QrResultWasm as QrResult };
