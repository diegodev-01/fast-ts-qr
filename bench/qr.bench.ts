import { Bench } from "tinybench";
import { generateQr } from "../src-js/index";

// 2. Importa las librerías de la competencia que instalaste
import QRCode from "qrcode";
import { encodeQR } from "@paulmillr/qr";

async function run() {
  const bench = new Bench({ time: 1000, warmupIterations: 5 });

  const payload = "https://github.com/diegodev-01/fast-ts-qr";

  bench
    .add("🚀 Tu Librería (WASM/TS)", () => {
      // Importante: retorna el resultado para que JS no elimine el código por optimización
      return generateQr(payload);
    })
    .add("paulmillr/qr", () => {
      return encodeQR(payload, "bytes", "M");
    })
    .add("node-qrcode", () => {
      return QRCode.create(payload, { errorCorrectionLevel: "M" });
    });

  console.log("🏁 Ejecutando benchmarks de QR...");
  await bench.run();

  console.table(bench.table());
}

run();
