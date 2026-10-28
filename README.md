# fast-ts-qr

QR code generator for JavaScript and TypeScript projects, implemented in Rust
and compiled to WebAssembly. The library receives text and returns the QR code
matrix as a `Uint8Array`, allowing the consuming application to choose how to
render it: `Canvas`, SVG, HTML, an image, or another format.

## Features

- Generate QR codes from JavaScript or TypeScript.
- Built with Rust and WebAssembly.
- Small and easy-to-integrate API.
- Binary result returned as a `Uint8Array`.
- Generation errors are propagated as JavaScript exceptions.

## Requirements

- Rust and Cargo.
- `wasm-pack` to compile the WebAssembly package.
- Node.js and npm, pnpm, or yarn to consume the package from a JavaScript or
  TypeScript project.

Install `wasm-pack` if it is not already available:

```bash
cargo install wasm-pack
```

## Build

Run the following command from the project root:

```bash
wasm-pack build --target web
```

The command generates or updates the distributable files inside `pkg/`.
These are the files that JavaScript or TypeScript applications should import.

## Usage

After building the project, import the generated module:

```ts
import init, { generar_qr_matriz } from "./pkg/fast_ts_qr.js";

await init();

const data = generar_qr_matriz("https://example.com");

console.log(data instanceof Uint8Array); // true
console.log(data.length);                // matrix width × height
```

`generar_qr_matriz` returns the matrix flattened by rows. Each element
represents a QR code module and can be interpreted as a binary value:

- `0`: light module.
- `1`: dark module.

The width and height depend on the QR version selected internally by the
generation dependency. To render the matrix, the application must determine
or preserve that size when building its visual representation.

The following is a simple `Canvas` rendering example:

```ts
import init, { generar_qr_matriz } from "./pkg/fast_ts_qr.js";

await init();

const matrix = generar_qr_matriz("Example text");
const side = Math.sqrt(matrix.length);

if (!Number.isInteger(side)) {
  throw new Error("The QR matrix does not have a valid square size");
}

const canvas = document.querySelector("canvas");
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Canvas element not found");
}

canvas.width = side;
canvas.height = side;

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("Could not obtain the 2D context");
}

const image = context.createImageData(side, side);

for (let i = 0; i < matrix.length; i += 1) {
  const color = matrix[i] === 1 ? 0 : 255;
  const pixel = i * 4;
  image.data[pixel] = color;
  image.data[pixel + 1] = color;
  image.data[pixel + 2] = color;
  image.data[pixel + 3] = 255;
}

context.putImageData(image, 0, 0);
```

## API

### `generar_qr_matriz(texto: string): Uint8Array`

Generates a QR code for `texto` and returns its modules in a `Uint8Array`. If
the dependency cannot build the code, the function throws an error describing
the generation failure.

> The exported function names and parameter names currently follow the
> project's existing Spanish API.

## Dependency and acknowledgements

This library uses [`fast_qr`](https://crates.io/crates/fast_qr) to encode data
in QR format. Many thanks to its authors and contributors for providing a fast,
reusable implementation for the Rust ecosystem.

`fast-ts-qr` acts as a lightweight WebAssembly layer over that dependency. It
does not replace or claim authorship of `fast_qr`. Review its repository and
license to understand its terms of use:

<https://github.com/erwanvivien/fast_qr>

This project also uses:

- [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) to expose the Rust
  API to JavaScript.
- [`js-sys`](https://github.com/rustwasm/wasm-bindgen/tree/main/crates/js-sys)
  to construct the `Uint8Array`.

## License

This project is distributed under the MIT license. See `Cargo.toml` for the
license declaration and the versions of the dependencies in use.

Third-party dependencies retain their own licenses and notices. In particular,
using `fast_qr` must comply with the terms of its license.
