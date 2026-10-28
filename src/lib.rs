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