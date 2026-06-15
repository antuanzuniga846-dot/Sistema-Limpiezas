  // ============================
// FILTROS
// ============================
let fechaSeleccionada = "";

// ============================
// HISTORIAL CON FILTRO
// ============================
window.cargarHistorial = async (reset = true) => {
  try{
    if(loading || noMoreData) return;

    await getSessionOrFail();

    const tbody = document.getElementById("tablaHistorial");

    if(reset){
      tbody.innerHTML = "";
      page = 0;
      noMoreData = false;
    }

    loading = true;

    const from = page * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("limpiezas")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);


    const { data, error } = await query;

    if (error) {
      console.error("ERROR SUPABASE:", error);
      loading = false;
      return;
    }

    if (!data || data.length === 0) {
      noMoreData = true;
      loading = false;
      return;
    }

    const facturasVistas = new Set();

data.forEach(item => {

  const factura = String(item.factura || "").trim();

  if(facturasVistas.has(factura)){
    return;
  }

  facturasVistas.add(factura);

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input type="checkbox" class="chkHist"
      data-json="${encodeURIComponent(JSON.stringify(item))}"></td>
    <td>${item.factura ?? ""}</td>
    <td>${item.billingid ?? ""}</td>
    <td>${item.monto ?? ""}</td>
    <td>${item.raiz ?? ""}</td>
    <td>${item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
  `;

  tbody.appendChild(tr);
});

    page++;
    loading = false;

  } catch(e){
    console.warn("Historial cancelado por sesión");
  }
};

  window.usarSeleccionParaND = () => {
  const checks = document.querySelectorAll(".chkHist:checked");

  if (!checks.length) {
    showToast("warn", "Nada seleccionado", "Marca al menos un registro del historial.");
    return;
  }

  let resultado = "";

  checks.forEach(chk => {
    const data = JSON.parse(decodeURIComponent(chk.dataset.json));

    // ND: raiz billing monto factura
    resultado += `${data.raiz} ${data.billingid} ${data.monto} ${data.factura}\n`;
  });

  // meter en textarea ND
  const nd = document.getElementById("data_nd");
  if (nd) nd.value = resultado;

  // ir a página ND
  go("gen-nd");

  showToast("success", "Listo", "Datos enviados al generador ND.");
};

// ============================
// RESALTAR FILAS Y RAÍCES
// ============================
document.addEventListener("click", (e) => {

  const fila = e.target.closest("#tablaHistorial tr");

  if (!fila) return;

  // evitar doble click raro en checkbox
  if (e.target.classList.contains("chkHist")) {
    return;
  }

  // raíz seleccionada
  const raiz = fila.children[4]?.textContent.trim();

  if (!raiz) return;

  const facturasVistas = new Set();

  document.querySelectorAll("#tablaHistorial tr").forEach(tr => {

    const r = tr.children[4]?.textContent.trim();

    const factura =
      tr.children[1]?.textContent.trim();

    const chk =
      tr.querySelector(".chkHist");

    if (
      r === raiz &&
      chk &&
      !facturasVistas.has(factura)
    ) {

      chk.checked = true;

      tr.classList.add(
        "fila-activa",
        "misma-raiz"
      );

      facturasVistas.add(factura);
    }

  });

});
// ============================
// FILTROS
// ============================
window.aplicarFiltros = () => {
  fechaSeleccionada = document.getElementById("fechaFiltro").value;
  cargarHistorial(true);
};

window.limpiarFiltros = () => {
  document.getElementById("fechaFiltro").value = "";
  fechaSeleccionada = "";
  cargarHistorial(true);
};