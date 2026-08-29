// ==========================================================================
// GESTIÓN DE FILTROS
// ==========================================================================
window.aplicarFiltros = () => {
  if (typeof cargarHistorial === "function") {
    cargarHistorial(true);
  }
};

window.limpiarFiltros = () => {
  const inputFecha = document.getElementById("fechaFiltro");
  const selectTipo = document.getElementById("tipoFiltro");

  if (inputFecha) {
    if (inputFecha._flatpickr) {
      inputFecha._flatpickr.clear();
    }
    inputFecha.value = "";
  }

  if (selectTipo) {
    selectTipo.value = "";
  }

  if (typeof cargarHistorial === "function") {
    cargarHistorial(true);
  }
};

// Filtrar automáticamente cuando se cambia el selector de tipo
document.addEventListener("DOMContentLoaded", () => {
  const selectTipo = document.getElementById("tipoFiltro");
  if (selectTipo) {
    selectTipo.addEventListener("change", () => window.aplicarFiltros());
  }
});

// ==========================================================================
// 2. RESALTAR FILAS Y AGRUPACIÓN POR RAÍZ (Toggle)
// ==========================================================================
document.addEventListener("click", (e) => {
  const fila = e.target.closest("#tablaHistorial tr");

  // Ignorar clics fuera de filas del cuerpo o clics directos al checkbox
  if (!fila || e.target.classList.contains("chkHist")) return;

  const raizSeleccionada = fila.children[4]?.textContent.trim();
  if (!raizSeleccionada) return;

  const todasLasFilas = document.querySelectorAll("#tablaHistorial tr");
  const yaEstabaActiva = fila.classList.contains("fila-activa");

  // Desmarcar todo
  todasLasFilas.forEach(tr => {
    tr.classList.remove("fila-activa", "misma-raiz");
    const chk = tr.querySelector(".chkHist");
    if (chk) chk.checked = false;
  });

  // Si no estaba activa, seleccionar todas las que compartan la misma raíz
  if (!yaEstabaActiva) {
    const facturasVistas = new Set();

    todasLasFilas.forEach(tr => {
      const r = tr.children[4]?.textContent.trim();
      const factura = tr.children[1]?.textContent.trim();
      const chk = tr.querySelector(".chkHist");

      if (r === raizSeleccionada && chk && !facturasVistas.has(factura)) {
        chk.checked = true;
        tr.classList.add("fila-activa", "misma-raiz");
        facturasVistas.add(factura);
      }
    });
  }
});

// ==========================================================================
// 3. ENVIAR REGISTROS A GENERADOR ND
// ==========================================================================
window.usarSeleccionParaND = () => {
  const checks = document.querySelectorAll(".chkHist:checked");

  if (!checks.length) {
    if (typeof showToast === "function") {
      showToast("warn", "Nada seleccionado", "Marca al menos un registro del historial.");
    }
    return;
  }

  let resultado = "";

  checks.forEach(chk => {
    try {
      const data = JSON.parse(decodeURIComponent(chk.dataset.json));
      resultado += `${data.raiz || ""} ${data.billingid || ""} ${data.monto || ""} ${data.factura || ""} ${data.cedula || ""}\n`.trimStart();
    } catch (err) {
      console.error("Error parseando data-json:", err);
    }
  });

  const nd = document.getElementById("data_nd");
  if (nd) nd.value = resultado;

  if (typeof go === "function") go("gen-nd");
  if (typeof showToast === "function") showToast("success", "Listo", "Datos enviados al generador ND.");
};