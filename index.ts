import init, { generateQr as _generateQr, QrResult as _QrResult } from './pkg/fast_ts_qr.js';

export type QrResult = _QrResult;

let initPromise: Promise<void> | null = null;

export async function generateQr(text: string): Promise<QrResult> {
    if (!initPromise) {
        initPromise = (async () => {
            await init();
        })();
    }
    
    await initPromise;

    return _generateQr(text);
}