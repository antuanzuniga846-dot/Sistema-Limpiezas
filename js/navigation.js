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