# fast-ts-qr

Generate QR codes in JavaScript and TypeScript with a small WebAssembly-powered
API. `fast-ts-qr` returns the QR modules as a `Uint8Array`, so you can render
them with Canvas, SVG, HTML, or any other UI library.

## Installation

```bash
npm install fast-ts-qr
```

Or with another package manager:

```bash
pnpm add fast-ts-qr
# or
yarn add fast-ts-qr
```

The published package includes the compiled WebAssembly binary. End users do
not need Rust, Cargo, or `wasm-pack`.

## Quick start

```ts
import { generateQr } from "fast-ts-qr";

const qr = await generateQr("https://example.com");

console.log(qr.size); // Number of modules per row/column
console.log(qr.data); // Uint8Array with size * size values
```

`generateQr` accepts a string and returns a `Promise<QrResult>`. The first call
initializes WebAssembly; subsequent calls reuse the same initialized module.

## Rendering in a browser

The result is a square matrix stored in row-major order. Each value is:

- `0`: light module
- `1`: dark module

For example, render a QR code to a `<canvas>`:

```html
<canvas id="qr-canvas"></canvas>
```

```ts
import { generateQr } from "fast-ts-qr";

const qr = await generateQr("https://example.com");
const canvas = document.querySelector<HTMLCanvasElement>("#qr-canvas");

if (!canvas) {
  throw new Error("QR canvas not found");
}

const scale = 8;
canvas.width = qr.size * scale;
canvas.height = qr.size * scale;

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("Could not obtain the 2D context");
}

context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = "black";

for (let row = 0; row < qr.size; row += 1) {
  for (let column = 0; column < qr.size; column += 1) {
    const module = qr.data[row * qr.size + column];

    if (module === 1) {
      context.fillRect(column * scale, row * scale, scale, scale);
    }
  }
}
```

The library only generates the QR matrix. Rendering, colors, size, margins,
and accessibility are controlled by your application.

## API

### `generateQr(text: string): Promise<QrResult>`

Generates a QR code from `text`.

The promise is rejected when the input cannot be encoded as a QR code:

```ts
try {
  const qr = await generateQr("Text to encode");
  // Use qr.size and qr.data here.
} catch (error) {
  console.error("Could not generate QR code", error);
}
```

### `QrResult`

| Property | Type | Description |
| --- | --- | --- |
| `size` | `number` | Number of modules in each row and column. |
| `data` | `Uint8Array` | Flattened row-major matrix with `size * size` values. |

The matrix index for a module at `(row, column)` is
`row * qr.size + column`.

## Development

This section is only needed if you are contributing to `fast-ts-qr` or
building the package from source.

### Requirements

- Node.js and npm
- Rust and Cargo
- [`wasm-pack`](https://rustwasm.github.io/wasm-pack/)

Install `wasm-pack` if necessary:

```bash
cargo install wasm-pack
```

Install the JavaScript dependencies and build the distributable package:

```bash
npm install
npm run build
```

The build compiles the Rust crate to WebAssembly, embeds the binary in the
JavaScript wrapper, and writes the package files to `dist/`.

## Performance Benchmark

`fast-ts-qr` is designed to deliver high-level performance by leveraging WebAssembly (Rust). Below is a speed comparison generating a QR matrix (standard URL payload, executed with `tinybench` in Node.js):

| Library | Throughput (ops/sec) | Average Latency |
| :--- | :--- | :--- |
| **`fast-ts-qr` (WASM)** | **`8,207 ops/sec`** | **`0.12 ms`** |
| `node-qrcode` | `3,397 ops/sec` | `0.30 ms` |
| `paulmillr/qr` | `768 ops/sec` | `1.30 ms` |

> *Note: Results may vary slightly depending on your hardware. You can run the benchmarks yourself by cloning the repository and running:*
>
> ```bash
> npm install
> npm run bench
> ```

## Acknowledgements

The QR encoding is provided by
[`fast_qr`](https://crates.io/crates/fast_qr). This project also uses
[`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) and
[`js-sys`](https://github.com/rustwasm/wasm-bindgen/tree/main/crates/js-sys).

Please review the upstream projects and their licenses when distributing
software that uses this package.

## License

This project is distributed under the MIT license. See
[`Cargo.toml`](./Cargo.toml) for the license declaration. Third-party
dependencies retain their own licenses and notices.
