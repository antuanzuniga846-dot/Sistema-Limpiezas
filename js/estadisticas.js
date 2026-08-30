/**
 * js/estadisticas.js
 * Ranking de cédulas únicas conectado a Supabase
 */

let chartRankingInstance = null;
let cacheRanking = {
  data: null,
  timestamp: 0
};

const TIEMPO_CACHE_MS = 60 * 1000; // 1 minuto de caché

/**
 * Obtener el cliente activo de Supabase
 */
function getSupabaseClient() {
  return window.supabase || window.supabaseClient || null;
}

/**
 * Consulta la vista o función SQL de Supabase
 */
async function obtenerRankingDesdeSupabase(forzarRecarga = false) {
  const ahora = Date.now();

  // Si hay caché y no se fuerza recarga, devolverlo
  if (!forzarRecarga && cacheRanking.data && (ahora - cacheRanking.timestamp < TIEMPO_CACHE_MS)) {
    return cacheRanking.data;
  }

  const client = getSupabaseClient();

  if (!client) {
    console.warn("⏳ Esperando conexión con Supabase...");
    return null;
  }

  try {
    // 1. Intentar llamar a la función RPC
    let { data, error } = await client.rpc("get_ranking_limpiezas");

    // 2. Si no existe el RPC, consultar la vista directa
    if (error || !data) {
      const res = await client.from("ranking_limpiezas").select("*");
      data = res.data;
      error = res.error;
    }

    if (error) {
      console.error("❌ Error al consultar estadísticas en Supabase:", error);
      return null;
    }

    console.log("✅ Estadísticas cargadas con éxito:", data);
    cacheRanking.data = data || [];
    cacheRanking.timestamp = ahora;
    return cacheRanking.data;

  } catch (err) {
    console.error("❌ Error inesperado al cargar estadísticas:", err);
    return null;
  }
}

/**
 * Carga y actualiza toda la interfaz de estadísticas
 */
async function cargarEstadisticas(forzarRecarga = false) {
  const tbody = document.getElementById("tablaRankingBody");
  if (tbody && (!cacheRanking.data || forzarRecarga)) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--muted);">⏳ Consultando datos a Supabase...</td></tr>`;
  }

  const ranking = await obtenerRankingDesdeSupabase(forzarRecarga);

  if (!ranking || ranking.length === 0) {
    renderizarVacio();
    return;
  }

  renderizarKPIs(ranking);
  renderizarPodium(ranking);
  renderizarGrafica(ranking);
  renderizarTablaRanking(ranking);
}

function renderizarKPIs(ranking) {
  const kpiLider = document.getElementById("kpiLider");
  const kpiLiderCount = document.getElementById("kpiLiderCount");
  const kpiTotalAgentes = document.getElementById("kpiTotalAgentes");
  const kpiTotalCedulas = document.getElementById("kpiTotalCedulas");

  if (ranking.length > 0) {
    if (kpiLider) kpiLider.textContent = ranking[0].usuario;
    if (kpiLiderCount) kpiLiderCount.textContent = `${ranking[0].cedulas_unicas} cédulas únicas`;
  }

  if (kpiTotalAgentes) kpiTotalAgentes.textContent = ranking.length;

  const totalUnicas = ranking.reduce((acc, curr) => acc + Number(curr.cedulas_unicas || 0), 0);
  if (kpiTotalCedulas) kpiTotalCedulas.textContent = totalUnicas;
}

function renderizarPodium(ranking) {
  const container = document.getElementById("podiumContainer");
  if (!container) return;

  const medallas = [
    { medal: "🥇", pos: "1º Lugar", color: "#ffd700", border: "rgba(255,215,0,0.4)" },
    { medal: "🥈", pos: "2º Lugar", color: "#c0c0c0", border: "rgba(192,192,192,0.4)" },
    { medal: "🥉", pos: "3º Lugar", color: "#cd7f32", border: "rgba(205,127,50,0.4)" }
  ];

  const top3 = ranking.slice(0, 3);
  let html = "";

  top3.forEach((item, index) => {
    const m = medallas[index];
    html += `
      <div class="podium-card" style="border-color:${m.border};">
        <div class="podium-badge" style="background:${m.color}22; color:${m.color};">${m.medal} ${m.pos}</div>
        <div class="podium-name">${item.usuario}</div>
        <div class="podium-score"><b>${item.cedulas_unicas}</b> <span>cédulas únicas</span></div>
        <div class="podium-sub">${item.total_registros} registros totales (${item.efectividad}% efectividad)</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderizarGrafica(ranking) {
  const ctx = document.getElementById("chartRanking");
  if (!ctx) return;

  const computed = getComputedStyle(document.documentElement);
  const accent1 = computed.getPropertyValue("--accent1").trim() || "#00d8f5";
  const accent2 = computed.getPropertyValue("--accent2").trim() || "#0072ff";
  const textColor = computed.getPropertyValue("--text").trim() || "#e8f1ff";
  const strokeColor = computed.getPropertyValue("--stroke").trim() || "rgba(255,255,255,0.12)";

  // Tomamos los nombres de los agentes para el eje X
  const topAgentes = ranking.slice(0, 10);
  const labels = topAgentes.map(a => {
    const partes = (a.usuario || "").split(" ");
    return partes.length > 1 ? `${partes[0]} ${partes[1]}` : a.usuario;
  });
  const dataUnicas = topAgentes.map(a => a.cedulas_unicas);
  const dataTotales = topAgentes.map(a => a.total_registros);

  if (chartRankingInstance) {
    chartRankingInstance.destroy();
  }

  chartRankingInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Cédulas Únicas",
          data: dataUnicas,
          backgroundColor: accent1,
          borderRadius: 6,
          maxBarThickness: 45
        },
        {
          label: "Total Registros",
          data: dataTotales,
          backgroundColor: accent2 + "44",
          borderColor: accent2,
          borderWidth: 1,
          borderRadius: 6,
          maxBarThickness: 45
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: textColor, font: { family: "Inter, sans-serif", weight: "600" } }
        },
        tooltip: {
          backgroundColor: "rgba(11, 18, 32, 0.9)",
          titleColor: accent1,
          bodyColor: "#fff",
          borderColor: strokeColor,
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { size: 11 } },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: { color: textColor, stepSize: 1 },
          grid: { color: strokeColor }
        }
      }
    }
  });
}

function renderizarTablaRanking(ranking) {
  const tbody = document.getElementById("tablaRankingBody");
  if (!tbody) return;

  let html = "";
  ranking.forEach((item, index) => {
    const pos = index + 1;
    let iconPos = `#${pos}`;
    if (pos === 1) iconPos = "🥇 1º";
    else if (pos === 2) iconPos = "🥈 2º";
    else if (pos === 3) iconPos = "🥉 3º";

    html += `
      <tr style="border-bottom:1px solid var(--stroke);">
        <td style="padding:12px 14px; font-weight:700;">${iconPos}</td>
        <td style="padding:12px 14px; font-weight:600; color:var(--accent1);">${item.usuario} <span style="font-size:11px; color:var(--muted);">(${item.iniciales})</span></td>
        <td style="padding:12px 14px;"><b style="font-size:15px;">${item.cedulas_unicas}</b> <span style="font-size:11px; color:var(--muted);">únicas</span></td>
        <td style="padding:12px 14px; color:var(--muted);">${item.total_registros}</td>
        <td style="padding:12px 14px;">
          <span class="pill" style="font-size:11px;">${item.efectividad}% efectividad</span>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function renderizarVacio() {
  const tbody = document.getElementById("tablaRankingBody");
  if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--muted);">No hay datos de limpiezas registrados en el sistema.</td></tr>`;
}

// Cargar automáticamente cuando Supabase esté listo o al navegar
window.addEventListener("supabase-ready", () => {
  const seccion = document.getElementById("page-estadisticas");
  if (seccion && seccion.classList.contains("active")) {
    cargarEstadisticas();
  }
});