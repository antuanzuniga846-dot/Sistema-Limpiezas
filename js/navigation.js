// ===== NAV =====
  function go(page){
    document.querySelectorAll(".navBtn").forEach(b => {
      b.classList.toggle("active", b.dataset.page === page);
    });

    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    const target = document.getElementById("page-" + page);
    if(!target){ console.warn("No existe la página:", "page-" + page); return; }
    target.classList.add("active");

    const title = document.getElementById("pageTitle");
    const sub = document.getElementById("pageSub");
    const map = {
      historial: ["Historial", "Consulta y reutiliza limpiezas guardadas."],
      home: ["Inicio", "Panel de control y accesos rápidos."],
      "gen-nc": ["Generador NC", "Genera el formato NC (CM,908,...)."],
      "gen-nd": ["Generador ND", "Genera el formato ND (IN,911,...)."],
      "gen-acometida": ["Generador Acometida", "Genera formatos para acometidas."],
      help: ["Ayuda", "Guía rápida de uso."],
      plantillas: ["Plantillas", "Plantillas para OneMarketer y más."],
      estadisticas: ["Estadísticas", "Visualiza estadísticas de uso."],
    };
    if(map[page]){
      title.textContent = map[page][0];
      sub.textContent = map[page][1];
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".navBtn").forEach(b => {
      b.addEventListener("click", () => go(b.dataset.page));
    });
    go("home");
  });

  /**
 * Alterna el estado colapsado/expandido del Sidebar
 */
function toggleSidebar() {
  const app = document.getElementById("appContainer") || document.querySelector(".app");
  const overlay = document.getElementById("sidebarOverlay");
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Modo móvil: abrir/cerrar menú flotante
    const isOpen = app.classList.toggle("sidebar-mobile-open");
    if (overlay) {
      overlay.classList.toggle("active", isOpen);
    }
  } else {
    // Modo escritorio: colapsar/expandir ancho
    const isCollapsed = app.classList.toggle("sidebar-collapsed");
    localStorage.setItem("sidebarCollapsed", isCollapsed ? "true" : "false");
  }
}

// Restaurar estado guardado en escritorio al cargar
document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.innerWidth <= 768;
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  const app = document.getElementById("appContainer") || document.querySelector(".app");

  if (!isMobile && isCollapsed && app) {
    app.classList.add("sidebar-collapsed");
  }
});

// Auto-cerrar sidebar en móvil al seleccionar una página
const originalGo = window.go;
window.go = function(pageId) {
  if (typeof originalGo === "function") {
    originalGo(pageId);

               // Si navegan a estadísticas, cargar datos automáticamente
    if (pageId === 'estadisticas' && typeof cargarEstadisticas === 'function') {
      cargarEstadisticas();
    }
  }
  // Si está en pantalla pequeña, cerrar el sidebar tras hacer clic
  if (window.innerWidth <= 768) {
    const app = document.getElementById("appContainer") || document.querySelector(".app");
    const overlay = document.getElementById("sidebarOverlay");
    if (app) app.classList.remove("sidebar-mobile-open");
    if (overlay) overlay.classList.remove("active");
  }
};