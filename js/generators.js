 // ===== Parse NC con header =====
  function parseTablaNC(texto){
    const lines = (texto || "").trim().split("\n").filter(l => l.trim());
    if (lines.length < 2) return [];

    const splitRow = (row) => row.trim().split(/\t|\s{2,}/).filter(Boolean);
    const header = splitRow(lines[0]).map(h => h.toLowerCase());

    const idxFactura = header.findIndex(h => h.includes("factura"));
    const idxBilling = header.findIndex(h => h.includes("billing"));
    let idxMonto = header.findIndex(h => h.includes("monto") && h.includes("pagar"));
    if (idxMonto === -1) idxMonto = header.findIndex(h => h.includes("monto") && h.includes("factura"));

    if (idxFactura === -1 || idxBilling === -1 || idxMonto === -1) return [];

    const out = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = splitRow(lines[i]);
      if (cols.length <= Math.max(idxFactura, idxBilling, idxMonto)) continue;

      const factura = cols[idxFactura].trim();
      const billingid = cols[idxBilling].trim();
      const monto = normalizarMonto(cols[idxMonto]);
      if (!factura || !billingid || !monto) continue;
      out.push({ factura, billingid, monto });
    }
    return out;
  }

  // ===== Parse ND por fila =====
  function parseTablaND(texto){
    const lines = (texto || "").trim().split("\n").filter(l => l.trim());
    if (lines.length === 0) return [];

    const splitRow = (row) => row.trim().split(/\t|\s{2,}|\s+/).filter(Boolean);

    const IDX_RAIZ    = 0;
    const IDX_BILLING = 1;
    const IDX_MONTO   = 2;
    const IDX_FACTURA = 3;

    let start = 0;
    const first = splitRow(lines[0])[0]?.toLowerCase() || "";
    if (first.includes("raiz") || first.includes("factura")) start = 1;

    const out = [];
    for(let i = start; i < lines.length; i++){
      const cols = splitRow(lines[i]);
      if(cols.length <= Math.max(IDX_RAIZ, IDX_BILLING, IDX_MONTO, IDX_FACTURA)) continue;

      const raiz = cols[IDX_RAIZ].trim();
      const billingid = cols[IDX_BILLING].trim();
      const monto = normalizarMonto(cols[IDX_MONTO]);
      const factura = cols[IDX_FACTURA].trim();
      if(!raiz || !billingid || !monto || !factura) continue;
      out.push({ raiz, billingid, monto, factura });
    }
    return out;
  }

  // ===== Reglas extras =====
  function agregarRegla(mode){
    const rules = document.getElementById(`rules_${mode}`);
    const item = document.createElement("div");
    item.className = "ruleItem";

    item.innerHTML = `
      <div class="ruleTop">
        <div style="flex:1;">
          <label style="margin:0 0 6px;">Raíz extra</label>
          <input class="ruleRaiz" type="text" placeholder="Ej: 1.2270038">
        </div>
        <button class="btn btnGhost" type="button" onclick="eliminarRegla(this)">🗑️ Quitar</button>
      </div>

      <div class="ruleGrid">
        <div>
          <label style="margin:0 0 6px;">Tabla de esta raíz</label>
          <textarea class="ruleTabla" rows="6" placeholder="Pega aquí la tabla completa..."></textarea>
          <div class="hintText">Debe traer factura, billing account y monto.</div>
        </div>
      </div>
    `;
    rules.appendChild(item);
  }
  window.agregarRegla = agregarRegla;

  function eliminarRegla(btn){
    const item = btn.closest(".ruleItem");
    if(item) item.remove();
  }
  window.eliminarRegla = eliminarRegla;

  // ===== Generar plantilla NC/ND =====
 async function generarPlantilla(mode){
  const raizDefault = (mode === "nc")
    ? document.getElementById(`raiz_${mode}`).value.trim()
    : "";

  const textoPrincipal = document.getElementById(`data_${mode}`).value;

  if(mode === "nc" && !raizDefault){
    showToast("warn","Falta raíz","Escribe la raíz principal.");
    return;
  }

  const ahora = new Date();
  const dia = String(ahora.getDate()).padStart(2,'0');
  const mes = String(ahora.getMonth()+1).padStart(2,'0');
  const anio = ahora.getFullYear();
  const fecha = `${dia}/${mes}/${anio}`;

  const descripcion = (mode === "nc")
    ? "CM,908,200_Recuperacion de Clientes Proyecto de Ventas Móvil"
    : "IN,911,200_Se aplico reversión por proyecto de Venta Servicio Móvil Limpieza de Saldos";

  const userTag = getUsuarioActual();

  let resultado = "";
  let count = 0;
  let registrosGuardar = [];

  const tuplasPrincipal = (mode === "nc")
    ? parseTablaNC(textoPrincipal)
    : parseTablaND(textoPrincipal);

  for(const r of tuplasPrincipal){
    const raizUsar = (mode === "nc") ? raizDefault : r.raiz;

    resultado += `${raizUsar},${r.billingid},${descripcion},${r.monto},${fecha},${fecha},I,${r.factura},,0,,${userTag},,02\n`;

    registrosGuardar.push({
      factura: r.factura,
      billingid: r.billingid,
      monto: r.monto,
      raiz: raizUsar
    });

    count++;
  }

  const rules = document.querySelectorAll(`#rules_${mode} .ruleItem`);

  for (const rule of rules) {
    const raizExtra = rule.querySelector(".ruleRaiz")?.value.trim();
    const tablaExtra = rule.querySelector(".ruleTabla")?.value || "";

    if(mode === "nc" && !raizExtra) continue;

    const tuplasExtra = (mode === "nc")
      ? parseTablaNC(tablaExtra)
      : parseTablaND(tablaExtra);

    for(const r of tuplasExtra){
      const raizUsar = (mode === "nc") ? raizExtra : r.raiz;

      resultado += `${raizUsar},${r.billingid},${descripcion},${r.monto},${fecha},${fecha},I,${r.factura},,0,,${userTag},,02\n`;

      registrosGuardar.push({
        factura: r.factura,
        billingid: r.billingid,
        monto: r.monto,
        raiz: raizUsar
      });

      count++;
    }
  }

  document.getElementById(`resultado_${mode}`).value = resultado;
  document.getElementById(`count_${mode}`).textContent = String(count);

  if(count === 0){
    showToast("error","Sin datos","Pega tablas válidas.");
    return;
  }

  try{
    await navigator.clipboard.writeText(resultado);
    showToast("success","Generado y copiado",`Usuario: ${userTag} | Total: ${count}`);
  }catch{
    showToast("error","No se pudo copiar","Usa https o localhost.");
  }

 if (window.guardarLimpiezaBatch) {
  setTimeout(async () => {
    await window.guardarLimpiezaBatch(registrosGuardar);

    // 🔥 REFRESH AUTOMÁTICO DEL HISTORIAL
    if (typeof cargarHistorial === "function") {
      cargarHistorial();
    }

  }, 50);
}
}
  window.generarPlantilla = generarPlantilla;
// ===== Buscar por raíz en ND =====
      if(mode === "nd"){

  const texto = document
    .getElementById("data_nd")
    .value
    .trim();

  const lineas = texto
    .split("\n")
    .filter(x => x.trim());

  // si solo escribió una raíz
  if(lineas.length === 1 && lineas[0].split(/\s+/).length === 1){

    const raiz = lineas[0];

    try{

      const registros = await buscarPorRaizND(raiz);

      if(!registros.length){
        showToast(
          "warn",
          "Sin resultados",
          `No existe la raíz ${raiz}`
        );
        return;
      }

      document.getElementById("data_nd").value =
        registros
          .map(r =>
            `${r.raiz} ${r.billingid} ${r.monto} ${r.factura}`
          )
          .join("\n");

    }catch(err){

      showToast(
        "error",
        "Error",
        err.message
      );

      return;
    }
  }
}

async function buscarPorRaicesND(raices){

  const { data, error } = await supabase
    .from("limpiezas")
    .select("raiz,billingid,monto,factura")
    .in("raiz", raices);

  if(error) throw error;

  const facturasVistas = new Set();

  return (data || []).filter(r => {

    if(facturasVistas.has(r.factura)){
      return false;
    }

    facturasVistas.add(r.factura);
    return true;
  });
}

const lineas = texto
  .split("\n")
  .map(x => x.trim())
  .filter(Boolean);

const soloRaices = lineas.every(
  x => x.split(/\s+/).length === 1
);

const registros = await buscarPorRaicesND(lineas);

document.getElementById("data_nd").value =
  registros.map(r =>
    `${r.raiz} ${r.billingid} ${r.monto} ${r.factura}`
  ).join("\n");

  const textoPrincipal = document.getElementById(`data_${mode}`).value;

  if(mode === "nc" && !raizDefault){
    showToast("warn","Falta raíz","Escribe la raíz principal.");
    return;
  }

  // ===== Generador Acometida =====
  function generarAcometidaUltra(){
    const texto = document.getElementById("data_acometida").value || "";
    const lineas = texto.split("\n").map(l => l.trim()).filter(Boolean);

    const cedulasVistas = new Set();
    const salida = [];

    for (const linea of lineas){
      const limpio = linea.replace(/\s+/g, " ");
      const partes = limpio.split(" ");
      if (partes.length < 2) continue;

      const cedula = partes.shift();
      const nombre = partes.join(" ").trim();

      if (cedulasVistas.has(cedula)) continue;
      cedulasVistas.add(cedula);

      salida.push(`${cedula}: ${nombre}:`);
    }

    const resultado = salida.join("\n");
    document.getElementById("resultado_acometida").value = resultado;
    document.getElementById("count_acometida").textContent = String(salida.length);

    navigator.clipboard.writeText(resultado).catch(()=>{});
  }
  window.generarAcometidaUltra = generarAcometidaUltra;

  // ===== Limpieza =====
  function limpiarTodo(mode){
    const raizEl = document.getElementById(`raiz_${mode}`);
    if(raizEl) raizEl.value = "";
    const dataEl = document.getElementById(`data_${mode}`);
    if(dataEl) dataEl.value = "";

    const outId = (mode === "acometida") ? "resultado_acometida" : `resultado_${mode}`;
    const outEl = document.getElementById(outId);
    if(outEl) outEl.value = "";

    const countId = (mode === "acometida") ? "count_acometida" : `count_${mode}`;
    const c = document.getElementById(countId);
    if(c) c.textContent = "0";

    const rules = document.getElementById(`rules_${mode}`);
    if(rules) rules.innerHTML = "";

    showToast("success","Limpio",`Se borró el generador ${mode.toUpperCase()}.`);
  }
  window.limpiarTodo = limpiarTodo;