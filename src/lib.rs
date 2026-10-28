use wasm_bindgen::prelude::*;
use fast_qr::QRBuilder;

#[wasm-bindgen]
pub fn generar_qr_matriz(texto: &str) -> Result<js_sys::Uint8Array, JsValue> {
    // 1. Construir el QR usando fast_qr
    let qrcode = QRBuilder::new(texto)
        .build()
        .map_err(|e| JsValue::from_str(&format!("Error al generar QR: {:?}", e)))?;

    let modules = qrcode.modules;
    let size = modules.len();
    
    // 2. Aplanar la matriz bidimensional en un vector de bytes (1 para negro, 0 para blanco)
    let mut matriz_plana = Vec::with_capacity(size * size);
    
    for row in modules.iter() {
        for &cell in row.iter() {
            matriz_plana.push(if cell { 1 } else { 0 });
        }
    }

    // 3. Retornar como Uint8Array optimizado para JavaScript
    Ok(js_sys::Uint8Array::from(&matriz_plana[..]))
}