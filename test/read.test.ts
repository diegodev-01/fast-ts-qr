import { generateQr, readQr, readQrAll } from '../src-js/index.js';

async function render(text: string, scale = 8, quiet = 4) {
  const qr = await generateQr(text);
  const n = (qr.size + quiet * 2) * scale;
  const data = new Uint8Array(n * n * 4).fill(255);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const r = Math.floor(y / scale) - quiet, c = Math.floor(x / scale) - quiet;
      if (r >= 0 && c >= 0 && r < qr.size && c < qr.size && qr.data[r * qr.size + c] === 1) {
        const i = (y * n + x) * 4;
        data[i] = data[i + 1] = data[i + 2] = 0;
      }
    }
  return { data, width: n, height: n };
}

for (const text of ['https://example.com', 'hola ñandú 🚀', 'x'.repeat(300)]) {
  const got = await readQr(await render(text));
  if (got !== text) throw new Error(`mismatch: ${text.slice(0, 20)} -> ${got}`);
}
const blank = { data: new Uint8Array(64 * 64 * 4).fill(255), width: 64, height: 64 };
if ((await readQrAll(blank)).length !== 0) throw new Error('blank should be empty');
let threw = false;
try { await readQr({ data: new Uint8Array(3), width: 2, height: 2 }); } catch { threw = true; }
if (!threw) throw new Error('bad size should throw');
console.log('ok');
