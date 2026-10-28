use wasm_bindgen::prelude::*;
use fast_qr::QRBuilder;

#[wasm_bindgen]
pub fn generar_qr_matriz(texto: &str) -> Result<js_sys::Uint8Array, JsValue> {
    let qrcode = QRBuilder::new(texto)
        .build()
        .map_err(|e| JsValue::from_str(&format!("Error al generar QR: {:?}", e)))?;

    // `data` ya es una lista plana de size * size módulos
    let matriz_plana: Vec<u8> = qrcode
        .data
        .iter()
        .map(|m| m.value() as u8)
        .collect();

    Ok(js_sys::Uint8Array::from(&matriz_plana[..]))
}