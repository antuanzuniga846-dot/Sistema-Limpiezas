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
  const inputCedula = document.getElementById("cedulaFiltro");

  if (inputFecha) {
    if (inputFecha._flatpickr) {
      inputFecha._flatpickr.clear();
    }
    inputFecha.value = "";
  }

  if (selectTipo) {
    selectTipo.value = "";
  }

  if (inputCedula) {
    inputCedula.value = "";
  }

  const chkAll = document.getElementById("chkSelectAllHist");
  if (chkAll) {
    chkAll.checked = false;
  }

  if (typeof cargarHistorial === "function") {
    cargarHistorial(true);
  }
};

// Filtrar automáticamente cuando se cambia el selector o se presiona Enter en cédula
document.addEventListener("DOMContentLoaded", () => {
  const selectTipo = document.getElementById("tipoFiltro");
  if (selectTipo) {
    selectTipo.addEventListener("change", () => window.aplicarFiltros());
  }

  const inputCedula = document.getElementById("cedulaFiltro");
  if (inputCedula) {
    inputCedula.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        window.aplicarFiltros();
      }
    });
  }

  const btnEjecutar = document.getElementById("btnEjecutarBorrado");
  if (btnEjecutar) {
    btnEjecutar.addEventListener("click", async () => {
      if (typeof window._accionConfirmadaBorrado === "function") {
        const accion = window._accionConfirmadaBorrado;
        window.cerrarModalConfirmarBorrado();
        await accion();
      }
    });
  }
});

// ==========================================================================
// SELECCIÓN Y MARCAR TODAS LAS CASILLAS
// ==========================================================================
window.toggleSelectAllHist = (checked) => {
  const todasLasFilas = document.querySelectorAll("#tablaHistorial tr");
  todasLasFilas.forEach(tr => {
    const chk = tr.querySelector(".chkHist");
    if (chk) chk.checked = checked;
    if (checked) {
      tr.classList.add("fila-activa");
    } else {
      tr.classList.remove("fila-activa", "misma-raiz");
    }
  });
};

// ==========================================================================
// RESALTAR FILAS Y AGRUPACIÓN POR RAÍZ (Toggle)
// ==========================================================================
document.addEventListener("click", (e) => {
  const fila = e.target.closest("#tablaHistorial tr");

  // Ignorar clics fuera de filas del cuerpo o clics directos al checkbox o botón de borrar
  if (!fila || e.target.classList.contains("chkHist") || e.target.closest(".btn-del-row")) return;

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

  const chkAll = document.getElementById("chkSelectAllHist");
  if (chkAll) chkAll.checked = false;

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
// ENVIAR REGISTROS A GENERADOR ND
// ==========================================================================
window.usarSeleccionParaND = () => {
  const checks = document.querySelectorAll("#tablaHistorial .chkHist:checked");

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

// ==========================================================================
// ALERTAS DE CONFIRMACIÓN Y BORRADO DE LIMPIEZAS
// ==========================================================================
window._accionConfirmadaBorrado = null;

window.mostrarAlertaConfirmacion = (mensajeHtml, onConfirmar) => {
  const modal = document.getElementById("modalConfirmarBorrado");
  const texto = document.getElementById("modalConfirmarTexto");

  if (modal && texto) {
    texto.innerHTML = mensajeHtml;
    window._accionConfirmadaBorrado = onConfirmar;
    modal.style.display = "grid";
  } else {
    // Fallback con confirm nativo si no existe el modal en DOM
    const textoPlano = mensajeHtml.replace(/<[^>]*>/g, "");
    if (window.confirm(textoPlano)) {
      onConfirmar();
    }
  }
};

window.cerrarModalConfirmarBorrado = () => {
  const modal = document.getElementById("modalConfirmarBorrado");
  if (modal) modal.style.display = "none";
  window._accionConfirmadaBorrado = null;
};

// Borrar registros seleccionados por casillas
window.confirmarBorrarLimpiezas = () => {
  const checks = document.querySelectorAll("#tablaHistorial .chkHist:checked");

  if (!checks.length) {
    if (typeof showToast === "function") {
      showToast("warn", "Sin selección", "Marca al menos una casilla en el historial para borrar.");
    } else {
      alert("Marca al menos una limpieza para eliminar.");
    }
    return;
  }

  const items = [];
  checks.forEach(chk => {
    try {
      const data = JSON.parse(decodeURIComponent(chk.dataset.json));
      items.push(data);
    } catch (e) {
      console.error(e);
    }
  });

  const cantidad = items.length;
  const mensaje = cantidad === 1
    ? `¿Estás seguro de que deseas eliminar <b>1 registro de limpieza</b> (Factura: <code>${items[0].factura || "N/A"}</code>)? Se borrará permanentemente de la base de datos.`
    : `¿Estás seguro de que deseas eliminar los <b>${cantidad} registros de limpiezas</b> seleccionados? Se borrarán permanentemente de la base de datos.`;

  window.mostrarAlertaConfirmacion(mensaje, async () => {
    if (typeof window.ejecutarBorradoLimpiezas === "function") {
      await window.ejecutarBorradoLimpiezas(items);
    }
  });
};

// Borrar un registro individual desde el botón de la fila
window.confirmarBorrarUna = (id, factura) => {
  const mensaje = `¿Estás seguro de que deseas eliminar la limpieza con factura <code>${factura || "N/A"}</code>? Se borrará permanentemente de la base de datos.`;
  window.mostrarAlertaConfirmacion(mensaje, async () => {
    if (typeof window.ejecutarBorradoLimpiezas === "function") {
      await window.ejecutarBorradoLimpiezas([{ id, factura }]);
    }
  });
};