/**
 * js/estadisticas.js
 * Genera el ranking de usuarios por cantidad de cédulas únicas procesadas.
 */

let chartRankingInstance = null;

/**
 * Procesa los datos del historial y calcula las métricas
 */
function calcularRankingPorCedulaUnica(registros) {
  if (!Array.isArray(registros) || registros.length === 0) {
    return [];
  }

  const mapaAgentes = {}; // { usuario: { cedulas: Set(), total: 0 } }

  registros.forEach(item => {
    // Normalizar nombre de usuario
    const usuario = (item.usuario || item.user || item.username || "Desconocido").trim();
    // Normalizar cédula
    const cedula = (item.cedula || item.ced || "").toString().trim().replace(/[^0-9a-zA-Z]/g, "");

    // Validar que la cédula sea válida (no vacía ni placeholder)
    if (!cedula || cedula === "0" || cedula === "-") return;

    if (!mapaAgentes[usuario]) {
      mapaAgentes[usuario] = {
        cedulas: new Set(),
        totalRegistros: 0
      };
    }

    // El Set garantiza que cada cédula solo se cuente 1 vez por agente
    mapaAgentes[usuario].cedulas.add(cedula);
    mapaAgentes[usuario].totalRegistros++;
  });

  // Convertir a arreglo y ordenar de MAYOR a MENOR por cédulas únicas
  const ranking = Object.keys(mapaAgentes).map(usuario => {
    const unicas = mapaAgentes[usuario].cedulas.size;
    const total = mapaAgentes[usuario].totalRegistros;
    return {
      usuario: usuario,
      cedulasUnicas: unicas,
      totalRegistros: total,
      ratio: total > 0 ? ((unicas / total) * 100).toFixed(1) : "0"
    };
  }).sort((a, b) => b.cedulasUnicas - a.cedulasUnicas);

  return ranking;
}

/**
 * Función principal que carga datos y actualiza la vista
 */
async function cargarEstadisticas() {
  // 1. Obtener registros (intenta desde Supabase o desde variable global del historial)
  let datos = [];

  if (typeof window.obtenerRegistrosHistorial === "function") {
    datos = await window.obtenerRegistrosHistorial();
  } else if (Array.isArray(window.historialCompleto) && window.historialCompleto.length > 0) {
    datos = window.historialCompleto;
  } else if (typeof window.supabase !== "undefined" && window.supabaseClient) {
    // Si usas supabase directamente:
    try {
      const { data, error } = await window.supabaseClient.from("limpiezas").select("*");
      if (!error && data) datos = data;
    } catch (e) {
      console.warn("No se pudo consultar Supabase directamente:", e);
    }
  }

  // 2. Si la tabla de historial en el DOM ya tiene datos, los leemos de respaldo si no hay conexión
  if (datos.length === 0) {
    const filas = document.querySelectorAll("#tablaHistorial tr");
    if (filas.length > 0) {
      datos = Array.from(filas).map(fila => {
        const celdas = fila.querySelectorAll("td");
        if (celdas.length >= 8) {
          return {
            cedula: celdas[7]?.innerText?.trim() || "",
            usuario: celdas[8]?.innerText?.trim() || ""
          };
        }
        return null;
      }).filter(Boolean);
    }
  }

  // 3. Procesar ranking
  const ranking = calcularRankingPorCedulaUnica(datos);

  // 4. Renderizar componentes
  renderizarKPIs(ranking, datos);
  renderizarPodium(ranking);
  renderizarGrafica(ranking);
  renderizarTablaRanking(ranking);
}

/**
 * Renderiza los KPIs superiores
 */
function renderizarKPIs(ranking, datosOriginales) {
  const kpiLider = document.getElementById("kpiLider");
  const kpiLiderCount = document.getElementById("kpiLiderCount");
  const kpiTotalAgentes = document.getElementById("kpiTotalAgentes");
  const kpiTotalCedulas = document.getElementById("kpiTotalCedulas");

  if (ranking.length > 0) {
    if (kpiLider) kpiLider.textContent = ranking[0].usuario;
    if (kpiLiderCount) kpiLiderCount.textContent = `${ranking[0].cedulasUnicas} cédulas únicas`;
  } else {
    if (kpiLider) kpiLider.textContent = "Sin datos";
    if (kpiLiderCount) kpiLiderCount.textContent = "0 cédulas";
  }

  if (kpiTotalAgentes) kpiTotalAgentes.textContent = ranking.length;

  // Cédulas únicas globales en toda la base de datos
  const todasLasCedulas = new Set();
  datosOriginales.forEach(d => {
    const c = (d.cedula || d.ced || "").toString().trim();
    if (c && c !== "0" && c !== "-") todasLasCedulas.add(c);
  });
  if (kpiTotalCedulas) kpiTotalCedulas.textContent = todasLasCedulas.size;
}

/**
 * Renderiza tarjetas de Podio (Top 3)
 */
function renderizarPodium(ranking) {
  const container = document.getElementById("podiumContainer");
  if (!container) return;

  if (ranking.length === 0) {
    container.innerHTML = `<div style="color:var(--muted); text-align:center; grid-column:1/-1;">No hay registros suficientes para armar el podio.</div>`;
    return;
  }

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
        <div class="podium-score"><b>${item.cedulasUnicas}</b> <span>cédulas únicas</span></div>
        <div class="podium-sub">${item.totalRegistros} registros totales</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Renderiza la gráfica de Chart.js
 */
function renderizarGrafica(ranking) {
  const ctx = document.getElementById("chartRanking");
  if (!ctx) return;

  // Obtener colores del tema actual
  const computedStyle = getComputedStyle(document.documentElement);
  const accent1 = computedStyle.getPropertyValue("--accent1").trim() || "#00d8f5";
  const accent2 = computedStyle.getPropertyValue("--accent2").trim() || "#0072ff";
  const textColor = computedStyle.getPropertyValue("--text").trim() || "#e8f1ff";
  const strokeColor = computedStyle.getPropertyValue("--stroke").trim() || "rgba(255,255,255,0.12)";

  // Tomar hasta los primeros 12 agentes para no saturar la gráfica
  const topAgentes = ranking.slice(0, 12);
  const labels = topAgentes.map(a => a.usuario);
  const dataUnicas = topAgentes.map(a => a.cedulasUnicas);
  const dataTotales = topAgentes.map(a => a.totalRegistros);

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
          borderSkipped: false,
          maxBarThickness: 45
        },
        {
          label: "Total de Registros Subidos",
          data: dataTotales,
          backgroundColor: accent2 + "55",
          borderColor: accent2,
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 45
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { size: 12, family: "Inter, sans-serif", weight: "600" }
          }
        },
        tooltip: {
          backgroundColor: "rgba(11, 18, 32, 0.9)",
          titleColor: accent1,
          bodyColor: "#fff",
          borderColor: strokeColor,
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          callbacks: {
            footer: function(items) {
              const idx = items[0].dataIndex;
              const unicas = dataUnicas[idx];
              const totales = dataTotales[idx];
              return `Duplicados omitidos: ${totales - unicas}`;
            }
          }
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

/**
 * Renderiza la tabla de desglose
 */
function renderizarTablaRanking(ranking) {
  const tbody = document.getElementById("tablaRankingBody");
  if (!tbody) return;

  if (ranking.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--muted);">No hay datos registrados aún.</td></tr>`;
    return;
  }

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
        <td style="padding:12px 14px; font-weight:600; color:var(--accent1);">${item.usuario}</td>
        <td style="padding:12px 14px;"><b style="font-size:15px;">${item.cedulasUnicas}</b> <span style="font-size:11px; color:var(--muted);">únicas</span></td>
        <td style="padding:12px 14px; color:var(--muted);">${item.totalRegistros}</td>
        <td style="padding:12px 14px;">
          <span class="pill" style="font-size:11px;">${item.ratio}% efectividad</span>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// Cargar automáticamente al navegar a la página de estadísticas
document.addEventListener("DOMContentLoaded", () => {
  const btnEstadisticas = document.querySelector('[data-page="estadisticas"]');
  if (btnEstadisticas) {
    btnEstadisticas.addEventListener("click", () => {
      setTimeout(cargarEstadisticas, 100);
    });
  }
});