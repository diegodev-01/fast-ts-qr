use wasm_bindgen::prelude::*;
use fast_qr::QRBuilder;

#[wasm_bindgen]
pub struct QrResult {
    size: usize,
    data: Vec<u8>,
}

#[wasm_bindgen]
impl QrResult {
    #[wasm_bindgen(getter)]
    pub fn size(&self) -> usize {
        self.size
    }

    #[wasm_bindgen(getter)]
    pub fn data(&self) -> js_sys::Uint8Array {
        js_sys::Uint8Array::from(&self.data[..])
    }
}

#[wasm_bindgen(js_name = generateQr)]
pub fn generate_qr(text: &str) -> Result<QrResult, JsValue> {
    let qrcode = QRBuilder::new(text)
        .build()
        .map_err(|e| JsValue::from_str(&format!("Error generating QR: {:?}", e)))?;

    let size = qrcode.size;
    let data = qrcode
        .data
        .iter()
        .take(size * size)
        .map(|m| m.value() as u8)
        .collect();

    Ok(QrResult { size, data })
}

/// Decode every QR code found in an RGBA image buffer (e.g. `ImageData.data`).
/// Returns the decoded texts; grids that fail to decode are skipped.
#[wasm_bindgen(js_name = readQr)]
pub fn read_qr(rgba: &[u8], width: usize, height: usize) -> Result<Vec<String>, JsValue> {
    if width == 0 || height == 0 || rgba.len() != width * height * 4 {
        return Err(JsValue::from_str(&format!(
            "Invalid image: expected {} RGBA bytes for {}x{}, got {}",
            width * height * 4,
            width,
            height,
            rgba.len()
        )));
    }

    let mut img = rqrr::PreparedImage::prepare_from_greyscale(width, height, |x, y| {
        let i = (y * width + x) * 4;
        let (r, g, b, a) = (
            rgba[i] as u32,
            rgba[i + 1] as u32,
            rgba[i + 2] as u32,
            rgba[i + 3] as u32,
        );
        let luma = (r * 299 + g * 587 + b * 114) / 1000;
        // Composite over white so transparent pixels read as light.
        ((luma * a + 255 * (255 - a)) / 255) as u8
    });

    Ok(img
        .detect_grids()
        .iter()
        .filter_map(|grid| grid.decode().ok().map(|(_, content)| content))
        .collect())
}
